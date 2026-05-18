import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() list() { return this.prisma.project.findMany({ include: { phases: { orderBy: { sequence: 'asc' } }, sites: true, warehouses: true }, orderBy: { createdAt: 'desc' } }); }
  @Post() create(@Body() body: { code: string; name: string; location?: string; budget?: number }) { return this.prisma.project.create({ data: body }); }
  @Post(':id/phases') createPhase(@Param('id') projectId: string, @Body() body: { name: string; sequence?: number; budget?: number }) { return this.prisma.projectPhase.create({ data: { projectId, name: body.name, sequence: body.sequence ?? 0, budget: body.budget ?? 0 } }); }
}
