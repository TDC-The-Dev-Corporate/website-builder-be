import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "John Doe", description: "Full name of the user" })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: "JohnDoe" })
  @IsNotEmpty()
  @Matches(/^\S*$/, { message: "userName should not contain spaces" })
  username: string;

  @ApiProperty({
    example: "johndoe@example.com",
    description: "User email address",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: "StrongPassword123!",
    description: "User password",
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
