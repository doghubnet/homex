import { Priority } from '@prisma/client';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';

export class CreateMaterialRequestLineDto {
  @IsUUID()
  itemId!: string;

  @IsNumber()
  @Min(0.0001)
  quantity!: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class CreateMaterialRequestDto {
  @IsUUID()
  projectId!: string;

  @IsUUID()
  projectPhaseId!: string;

  @IsOptional()
  @IsDateString()
  neededDate?: string;

  @IsEnum(Priority)
  priority: Priority = Priority.NORMAL;

  @IsString()
  reason!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateMaterialRequestLineDto)
  lines!: CreateMaterialRequestLineDto[];
}

export class DecisionDto {
  @IsOptional()
  @IsString()
  note?: string;
}
