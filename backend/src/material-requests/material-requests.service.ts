import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditAction, RequestStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMaterialRequestDto, DecisionDto } from './dto/create-material-request.dto';

@Injectable()
export class MaterialRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.materialRequest.findMany({ include: { project: true, projectPhase: true, requestedBy: true, approvedBy: true, lines: { include: { item: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async get(id: string) {
    const request = await this.prisma.materialRequest.findUnique({ where: { id }, include: { project: true, projectPhase: true, requestedBy: true, approvedBy: true, lines: { include: { item: true } } } });
    if (!request) throw new NotFoundException('Material request not found.');
    return request;
  }

  async create(dto: CreateMaterialRequestDto, requestedById: string) {
    const count = await this.prisma.materialRequest.count();
    const request = await this.prisma.materialRequest.create({
      data: {
        requestNumber: `MR-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`,
        status: RequestStatus.SUBMITTED,
        priority: dto.priority,
        projectId: dto.projectId,
        projectPhaseId: dto.projectPhaseId,
        neededDate: dto.neededDate ? new Date(dto.neededDate) : undefined,
        reason: dto.reason,
        requestedById,
        lines: { create: dto.lines.map((line) => ({ itemId: line.itemId, quantity: line.quantity, remarks: line.remarks })) },
      },
      include: { lines: true },
    });
    await this.audit(AuditAction.CREATE, request.id, requestedById, `Submitted material request ${request.requestNumber}`);
    return request;
  }

  async approve(id: string, approvedById: string, dto: DecisionDto) {
    const request = await this.get(id);
    if (request.status !== RequestStatus.SUBMITTED) throw new BadRequestException('Only submitted material requests can be approved.');
    const updated = await this.prisma.materialRequest.update({ where: { id }, data: { status: RequestStatus.APPROVED, approvedById, approvalNote: dto.note, approvedAt: new Date() } });
    await this.audit(AuditAction.APPROVE, id, approvedById, `Approved material request ${request.requestNumber}`);
    return updated;
  }

  async reject(id: string, rejectedById: string, dto: DecisionDto) {
    const request = await this.get(id);
    if (request.status !== RequestStatus.SUBMITTED && request.status !== RequestStatus.APPROVED) throw new BadRequestException('This material request cannot be rejected.');
    const updated = await this.prisma.materialRequest.update({ where: { id }, data: { status: RequestStatus.REJECTED, approvedById: rejectedById, approvalNote: dto.note, approvedAt: new Date() } });
    await this.audit(AuditAction.REJECT, id, rejectedById, `Rejected material request ${request.requestNumber}`);
    return updated;
  }

  async markIssued(id: string, actorId: string) {
    const request = await this.get(id);
    if (request.status !== RequestStatus.APPROVED && request.status !== RequestStatus.PARTIALLY_ISSUED) throw new BadRequestException('Only approved material requests can be issued.');
    const updated = await this.prisma.materialRequest.update({ where: { id }, data: { status: RequestStatus.ISSUED, issuedAt: new Date() } });
    await this.audit(AuditAction.ISSUE, id, actorId, `Marked material request ${request.requestNumber} as issued`);
    return updated;
  }

  private audit(action: AuditAction, entityId: string, actorId: string, summary: string) {
    return this.prisma.auditLog.create({ data: { action, entityType: 'MaterialRequest', entityId, actorId, summary } });
  }
}
