import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsUUID,
  IsOptional,
  IsObject,
  IsBoolean,
} from "class-validator";
import { InputJsonValue } from "@prisma/client/runtime/library";

export class CreatePortfolioDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  templateId: string;

  @ApiProperty()
  @IsObject()
  layout: InputJsonValue;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
