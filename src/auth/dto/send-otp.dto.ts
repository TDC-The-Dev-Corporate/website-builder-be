import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SendOTPDto {
  @ApiProperty({
    description: "Email address of the user who forgot the password",
    example: "user@example.com",
    required: true,
  })
  @IsEmail({}, { message: "Invalid Email" })
  email: string;
}
