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

  @ApiProperty({ example: "JohnDoe", description: "Unique username" })
  @IsNotEmpty()
  @Matches(/^\S*$/, { message: "Username should not contain spaces" })
  username: string;

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
    example: "Tech Solutions",
    description: "Company name",
  })
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    example: "+1234567890",
    description: "Phone number",
  })
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: "123 Main St, New York, USA",
    description: "User's address",
  })
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: "LIC123456",
    description: "Business license number",
  })
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty({
    example: "Software Development",
    description: "User's trade specialization",
  })
  @IsNotEmpty()
  tradeSpecialization: string;

  @ApiProperty()
  @IsOptional()
  profileImage: string;
}
