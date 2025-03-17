import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    example: "OldPassword123!",
    description: "Current password of the user",
  })
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({
    example: "NewPassword123!",
    description: "New password",
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({
    example: "NewPassword123!",
    description: "Confirmation of new password",
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  confirmNewPassword: string;
}
