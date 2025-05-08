import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    example: "johndoe@example.com",
    description: "User email address",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "NewPassword123!",
    description: "New password",
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: "NewPassword123!",
    description: "Confirmation of new password",
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;
}
