import { Body, Controller, Get, Post } from '@nestjs/common';
import { ItemType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly prisma: PrismaService) {}
  @Get() listItems() { return this.prisma.item.findMany({ include: { category: true, unit: true }, orderBy: { name: 'asc' } }); }
  @Post() createItem(@Body() body: { code: string; name: string; type: ItemType; categoryId: string; unitId: string; defaultUnitCost?: number; reorderLevel?: number }) { return this.prisma.item.create({ data: { ...body, qrCodeValue: `homex://item/${body.code}` } }); }
  @Get('categories') listCategories() { return this.prisma.itemCategory.findMany({ orderBy: { name: 'asc' } }); }
  @Get('units') listUnits() { return this.prisma.unit.findMany({ orderBy: { code: 'asc' } }); }
}
