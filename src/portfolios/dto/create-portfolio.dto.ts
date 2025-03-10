import { IsString, IsUUID, IsOptional, IsObject, IsBoolean } from 'class-validator';

export class CreatePortfolioDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  templateId: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  customizations: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}