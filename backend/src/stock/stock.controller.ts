import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, type RequestUser } from '../common/guards/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateStockEntryDto } from './dto/create-stock-entry.dto';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @UseGuards(JwtAuthGuard)
  @Post('entries')
  createEntry(@Body() dto: CreateStockEntryDto, @CurrentUser() user?: RequestUser) {
    return this.stockService.createEntry(dto, user?.userId);
  }

  @Get('entries')
  listEntries() { return this.stockService.listEntries(); }

  @Get('entries/:id')
  getEntry(@Param('id') id: string) { return this.stockService.getEntry(id); }

  @Get('balances')
  listBalances() { return this.stockService.listBalances(); }

  @Get('ledger')
  listLedger() { return this.stockService.listLedger(); }
}
