import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly prisma: PrismaService) {}
  @Get('summary') async summary() {
    const [activeProjects, pendingRequests, lowStockItems, toolsCheckedOut, damageLoss] = await Promise.all([
      this.prisma.project.count({ where: { status: 'ACTIVE' } }),
      this.prisma.materialRequest.count({ where: { status: { in: ['SUBMITTED', 'APPROVED'] } } }),
      this.prisma.item.count({ where: { isActive: true } }),
      this.prisma.toolCheckout.count({ where: { status: 'CHECKED_OUT' } }),
      this.prisma.stockLedger.count({ where: { movementType: { in: ['DAMAGE', 'LOSS'] } } }),
    ]);
    const balances = await this.prisma.stockBalance.findMany({ select: { valuation: true } });
    const totalStockValue = balances.reduce((sum, balance) => sum + Number(balance.valuation), 0);
    return { totalStockValue, activeProjects, pendingMaterialRequests: pendingRequests, lowStockItems, toolsCheckedOut, damageLossCount: damageLoss };
  }
}
