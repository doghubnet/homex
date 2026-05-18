import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly prisma: PrismaService) {}
  @Get('low-stock') lowStock() { return this.prisma.item.findMany({ include: { stockBalances: true, category: true, unit: true }, orderBy: { name: 'asc' } }); }
  @Get('stock-movements') stockMovements() { return this.prisma.stockLedger.findMany({ include: { item: true, warehouse: true, project: true, projectPhase: true }, orderBy: { createdAt: 'desc' }, take: 500 }); }
  @Get('project-cost') projectCost() { return this.prisma.stockLedger.findMany({ where: { projectId: { not: null } }, include: { item: true, project: true, projectPhase: true }, orderBy: { createdAt: 'desc' } }); }
  @Get('tool-checkouts') toolCheckouts() { return this.prisma.toolCheckout.findMany({ include: { toolItem: true, responsibleWorker: true, project: true }, orderBy: { createdAt: 'desc' } }); }
  @Get('equipment-fuel') fuel() { return this.prisma.fuelLog.findMany({ include: { equipmentItem: true, fuelItem: true, project: true }, orderBy: { createdAt: 'desc' } }); }
  @Get('damage-loss') damageLoss() { return this.prisma.stockLedger.findMany({ where: { movementType: { in: ['DAMAGE', 'LOSS'] } }, include: { item: true, warehouse: true }, orderBy: { createdAt: 'desc' } }); }
}
