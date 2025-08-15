import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID, IsOptional, IsBoolean } from "class-validator";

export class CreatePortfolioDto {
  @ApiProperty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsString()
  htmlContent: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  projectData?: string; // Complete GrapesJS project data (JSON)

  @ApiProperty()
  @IsString()
  @IsOptional()
  pagesData?: string; // Individual pages HTML data (JSON)

  @ApiProperty()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
