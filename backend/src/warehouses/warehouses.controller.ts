import { Body, Controller, Get, Post } from '@nestjs/common';
import { WarehouseType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() list() { return this.prisma.warehouse.findMany({ include: { project: true, site: true }, orderBy: { code: 'asc' } }); }
  @Post() create(@Body() body: { code: string; name: string; type: WarehouseType; projectId?: string; siteId?: string; address?: string }) { return this.prisma.warehouse.create({ data: { ...body, qrCodeValue: `homex://warehouse/${body.code}` } }); }
}
