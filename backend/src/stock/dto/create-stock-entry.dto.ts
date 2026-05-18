import { StockMovementType } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

export class CreateStockEntryLineDto {
  @IsUUID()
  itemId!: string;

  @IsNumber()
  @Min(0.0001)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unitCost!: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class CreateStockEntryDto {
  @IsEnum(StockMovementType)
  type!: StockMovementType;

  @IsOptional()
  @IsUUID()
  sourceWarehouseId?: string;

  @IsOptional()
  @IsUUID()
  targetWarehouseId?: string;

  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsUUID()
  projectPhaseId?: string;

  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @IsOptional()
  @IsString()
  referenceNo?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateStockEntryLineDto)
  lines!: CreateStockEntryLineDto[];
}
