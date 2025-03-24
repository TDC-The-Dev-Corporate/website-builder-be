import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({ example: "John Doe", description: "Full name of the user" })
  @IsNotEmpty()
  id?: string;

  @ApiProperty({ example: "John Doe", description: "Full name of the user" })
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: "Tech Solutions",
    description: "Company name",
  })
  @IsOptional()
  companyName?: string;

  @ApiProperty({
    example: "+1234567890",
    description: "Phone number",
  })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    example: "123 Main St, New York, USA",
    description: "User's address",
  })
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: "LIC123456",
    description: "Business license number",
  })
  @IsOptional()
  licenseNumber?: string;

  @ApiProperty({
    example: "Software Development",
    description: "User's trade specialization",
  })
  @IsOptional()
  tradeSpecialization?: string;

  @ApiProperty()
  @IsOptional()
  profileImage?: string;
}
