import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ItemsModule } from './items/items.module';
import { MaterialRequestsModule } from './material-requests/material-requests.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { ReportsModule } from './reports/reports.module';
import { StockModule } from './stock/stock.module';
import { WarehousesModule } from './warehouses/warehouses.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DashboardModule,
    ItemsModule,
    WarehousesModule,
    ProjectsModule,
    StockModule,
    MaterialRequestsModule,
    ReportsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
