import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LogInDto {
  @ApiProperty({
    example: "johndoe@example.com",
    description: "User email address",
    required: true,
  })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @ApiProperty({
    example: "StrongPassword123!",
    description: "User password",
    minLength: 6,
    required: true,
  })
  @IsNotEmpty({ message: "Password cannot be empty" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password: string;
}
