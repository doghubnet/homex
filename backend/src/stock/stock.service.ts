import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction, Prisma, StockEntryStatus, StockMovementType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockEntryDto } from './dto/create-stock-entry.dto';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  listEntries() {
    return this.prisma.stockEntry.findMany({
      orderBy: { createdAt: 'desc' },
      include: { lines: { include: { item: true } }, sourceWarehouse: true, targetWarehouse: true, project: true },
      take: 100,
    });
  }

  async getEntry(id: string) {
    const entry = await this.prisma.stockEntry.findUnique({
      where: { id },
      include: { lines: { include: { item: true } }, ledgers: true, sourceWarehouse: true, targetWarehouse: true, project: true },
    });
    if (!entry) throw new NotFoundException('Stock entry not found.');
    return entry;
  }

  listBalances() {
    return this.prisma.stockBalance.findMany({ include: { item: true, warehouse: true }, orderBy: { updatedAt: 'desc' }, take: 200 });
  }

  listLedger() {
    return this.prisma.stockLedger.findMany({ include: { item: true, warehouse: true, project: true, projectPhase: true }, orderBy: { createdAt: 'desc' }, take: 200 });
  }

  async createEntry(dto: CreateStockEntryDto, actorId?: string) {
    this.validateMovement(dto);

    return this.prisma.$transaction(async (tx) => {
      const entry = await tx.stockEntry.create({
        data: {
          entryNumber: await this.nextEntryNumber(tx),
          movementType: dto.type,
          status: StockEntryStatus.POSTED,
          sourceWarehouseId: dto.sourceWarehouseId,
          targetWarehouseId: dto.targetWarehouseId,
          projectId: dto.projectId,
          referenceNumber: dto.referenceNo,
          reason: dto.notes,
          postedAt: new Date(),
          createdById: actorId,
          lines: {
            create: await Promise.all(dto.lines.map(async (line) => {
              const item = await tx.item.findUnique({ where: { id: line.itemId }, select: { unitId: true } });
              if (!item) throw new NotFoundException(`Item ${line.itemId} not found.`);
              const totalCost = new Prisma.Decimal(line.quantity).mul(line.unitCost);
              return {
                itemId: line.itemId,
                unitId: item.unitId,
                sourceWarehouseId: dto.sourceWarehouseId,
                targetWarehouseId: dto.targetWarehouseId,
                projectPhaseId: dto.projectPhaseId,
                quantity: line.quantity,
                unitCost: line.unitCost,
                totalCost,
                notes: line.remarks,
              };
            })),
          },
        },
        include: { lines: true },
      });

      for (const line of entry.lines) {
        await this.applyLine(tx, dto, entry.id, line.id, line.itemId, line.unitId, Number(line.quantity), Number(line.unitCost), actorId);
      }

      await tx.auditLog.create({
        data: {
          action: this.auditAction(dto.type),
          entityType: 'StockEntry',
          entityId: entry.id,
          actorId,
          summary: `Posted ${dto.type} stock entry ${entry.entryNumber}`,
          metadata: { lineCount: dto.lines.length, referenceNo: dto.referenceNo },
        },
      });

      return tx.stockEntry.findUnique({ where: { id: entry.id }, include: { lines: { include: { item: true } }, ledgers: true } });
    });
  }

  private validateMovement(dto: CreateStockEntryDto) {
    const needsSource = new Set<StockMovementType>([StockMovementType.MATERIAL_TRANSFER, StockMovementType.MATERIAL_ISSUE, StockMovementType.RETURN_FROM_SITE, StockMovementType.DAMAGE, StockMovementType.LOSS, StockMovementType.ADJUSTMENT]).has(dto.type);
    const needsTarget = new Set<StockMovementType>([StockMovementType.OPENING_BALANCE, StockMovementType.PURCHASE_RECEIPT, StockMovementType.MATERIAL_TRANSFER, StockMovementType.RETURN_FROM_SITE]).has(dto.type);
    if (needsSource && !dto.sourceWarehouseId) throw new BadRequestException(`${dto.type} requires sourceWarehouseId.`);
    if (needsTarget && !dto.targetWarehouseId) throw new BadRequestException(`${dto.type} requires targetWarehouseId.`);
    if (dto.type === StockMovementType.MATERIAL_ISSUE && (!dto.projectId || !dto.projectPhaseId)) throw new BadRequestException('MATERIAL_ISSUE requires projectId and projectPhaseId.');
    if (!dto.lines.length) throw new BadRequestException('At least one stock entry line is required.');
  }

  private async applyLine(tx: Prisma.TransactionClient, dto: CreateStockEntryDto, stockEntryId: string, entryLineId: string, itemId: string, unitId: string, quantity: number, unitCost: number, actorId?: string) {
    const totalCost = new Prisma.Decimal(quantity).mul(unitCost);
    if (new Set<StockMovementType>([StockMovementType.OPENING_BALANCE, StockMovementType.PURCHASE_RECEIPT]).has(dto.type)) {
      await this.increase(tx, stockEntryId, entryLineId, itemId, unitId, dto.targetWarehouseId!, quantity, unitCost, totalCost, dto, actorId);
      return;
    }
    if (dto.type === StockMovementType.MATERIAL_TRANSFER || dto.type === StockMovementType.RETURN_FROM_SITE) {
      await this.decrease(tx, stockEntryId, entryLineId, itemId, unitId, dto.sourceWarehouseId!, quantity, unitCost, totalCost, dto, actorId);
      await this.increase(tx, stockEntryId, entryLineId, itemId, unitId, dto.targetWarehouseId!, quantity, unitCost, totalCost, dto, actorId);
      return;
    }
    if (new Set<StockMovementType>([StockMovementType.MATERIAL_ISSUE, StockMovementType.DAMAGE, StockMovementType.LOSS]).has(dto.type)) {
      await this.decrease(tx, stockEntryId, entryLineId, itemId, unitId, dto.sourceWarehouseId!, quantity, unitCost, totalCost, dto, actorId);
      return;
    }
    if (dto.type === StockMovementType.ADJUSTMENT) {
      await this.increase(tx, stockEntryId, entryLineId, itemId, unitId, dto.targetWarehouseId ?? dto.sourceWarehouseId!, quantity, unitCost, totalCost, dto, actorId);
    }
  }

  private async increase(tx: Prisma.TransactionClient, stockEntryId: string, entryLineId: string, itemId: string, unitId: string, warehouseId: string, quantity: number, unitCost: number, totalCost: Prisma.Decimal, dto: CreateStockEntryDto, actorId?: string) {
    const balance = await this.getOrCreateBalance(tx, itemId, warehouseId);
    const oldQty = new Prisma.Decimal(balance.quantity);
    const newQty = oldQty.plus(quantity);
    const oldValue = oldQty.mul(balance.averageCost);
    const newValue = oldValue.plus(totalCost);
    const averageCost = newQty.equals(0) ? new Prisma.Decimal(0) : newValue.div(newQty);
    const updated = await tx.stockBalance.update({ where: { id: balance.id }, data: { quantity: newQty, averageCost, valuation: newValue } });
    await tx.stockLedger.create({ data: { stockEntryId, entryLineId, movementType: dto.type, itemId, warehouseId, projectId: dto.projectId, projectPhaseId: dto.projectPhaseId, unitId, quantityIn: quantity, balanceAfter: updated.quantity, unitCost, totalCost, reference: dto.referenceNo, remarks: dto.notes, createdById: actorId } });
  }

  private async decrease(tx: Prisma.TransactionClient, stockEntryId: string, entryLineId: string, itemId: string, unitId: string, warehouseId: string, quantity: number, unitCost: number, totalCost: Prisma.Decimal, dto: CreateStockEntryDto, actorId?: string) {
    const balance = await this.getOrCreateBalance(tx, itemId, warehouseId);
    const newQty = new Prisma.Decimal(balance.quantity).minus(quantity);
    const allowNegative = await this.allowNegativeStock(tx);
    if (newQty.lessThan(0) && !allowNegative) {
      throw new BadRequestException(`Insufficient stock for item ${itemId} in warehouse ${warehouseId}. Available ${balance.quantity}, requested ${quantity}.`);
    }
    const averageCost = new Prisma.Decimal(balance.averageCost);
    const valuation = newQty.mul(averageCost);
    const updated = await tx.stockBalance.update({ where: { id: balance.id }, data: { quantity: newQty, valuation } });
    await tx.stockLedger.create({ data: { stockEntryId, entryLineId, movementType: dto.type, itemId, warehouseId, projectId: dto.projectId, projectPhaseId: dto.projectPhaseId, unitId, quantityOut: quantity, balanceAfter: updated.quantity, unitCost: averageCost.equals(0) ? unitCost : averageCost, totalCost, reference: dto.referenceNo, remarks: dto.notes, createdById: actorId } });
  }

  private async getOrCreateBalance(tx: Prisma.TransactionClient, itemId: string, warehouseId: string) {
    return tx.stockBalance.upsert({ where: { itemId_warehouseId: { itemId, warehouseId } }, update: {}, create: { itemId, warehouseId, quantity: 0, averageCost: 0, valuation: 0 } });
  }

  private async allowNegativeStock(tx: Prisma.TransactionClient) {
    const setting = await tx.companySetting.findUnique({ where: { key: 'allowNegativeStock' } });
    return setting?.value === true;
  }

  private async nextEntryNumber(tx: Prisma.TransactionClient) {
    const count = await tx.stockEntry.count();
    return `SE-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
  }

  private auditAction(type: StockMovementType): AuditAction {
    if (type === StockMovementType.PURCHASE_RECEIPT || type === StockMovementType.OPENING_BALANCE) return AuditAction.RECEIVE;
    if (type === StockMovementType.MATERIAL_TRANSFER) return AuditAction.TRANSFER;
    if (type === StockMovementType.MATERIAL_ISSUE) return AuditAction.ISSUE;
    if (type === StockMovementType.DAMAGE) return AuditAction.DAMAGE;
    if (type === StockMovementType.LOSS) return AuditAction.LOSS;
    return AuditAction.ADJUST;
  }
}
