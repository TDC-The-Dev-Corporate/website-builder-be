import { IsString, IsOptional, IsObject } from 'class-validator';
import { InputJsonValue } from '@prisma/client/runtime/library';


export class CreateTemplateDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  layout: InputJsonValue;

  @IsString()
  thumbnail: string;
}