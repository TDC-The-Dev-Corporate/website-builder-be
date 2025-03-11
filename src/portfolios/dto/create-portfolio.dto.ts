import { IsString, IsUUID, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { InputJsonValue } from '@prisma/client/runtime/library';

export class CreatePortfolioDto {
  @IsUUID()
  userId: string;

  @IsString()
  templateId: string;

  @IsObject()
  layout: InputJsonValue;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}