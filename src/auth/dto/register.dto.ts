import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "John Doe", description: "Full name of the user" })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: "johndoe@example.com",
    description: "User email address",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "StrongPassword123!",
    description: "User password (min 6 characters)",
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: "JohnDoe",
    description: "Optional username - if not provided, will be auto-generated from name",
    required: false,
  })
  @IsOptional()
  @Matches(/^\S*$/, { message: "Username should not contain spaces" })
  username?: string;

  @ApiProperty({
    example: "Tech Solutions",
    description: "Company name",
    required: false,
  })
  @IsOptional()
  companyName?: string;

  @ApiProperty({
    example: "+1234567890",
    description: "Phone number",
    required: false,
  })
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({
    example: "123 Main St, New York, USA",
    description: "User's address",
    required: false,
  })
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: "LIC123456",
    description: "Business license number",
    required: false,
  })
  @IsOptional()
  licenseNumber?: string;

  @ApiProperty({
    example: "Software Development",
    description: "User's trade specialization",
    required: false,
  })
  @IsOptional()
  tradeSpecialization?: string;

  @ApiProperty({
    description: "Profile image URL",
    required: false,
  })
  @IsOptional()
  profileImage?: string;
}
