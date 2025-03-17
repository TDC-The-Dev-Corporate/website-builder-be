import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsBoolean, IsEmail } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    description: "The first name of the user",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "The email of the user",
    type: String,
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}
