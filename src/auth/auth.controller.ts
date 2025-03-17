import { Body, Controller, Patch, Post, Req, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LogInDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtGuard } from "./jwt/jwt.guard";
import { ApiBearerAuth, ApiTags, ApiOperation } from "@nestjs/swagger";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { SendOTPDto } from "./dto/send-otp.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Register a new user" })
  @Post("register")
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: "Verify a user by email and verification code" })
  @Post("verifyUser")
  verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    return this.authService.verifyUser(verifyUserDto);
  }

  @ApiOperation({ summary: "Log in an existing user" })
  @Post("login")
  login(@Body() loginDto: LogInDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: "Reset password for an authenticated user" })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Patch("resetPassword")
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Req() req) {
    return this.authService.resetPassword(req.user.userId, resetPasswordDto);
  }

  @ApiOperation({ summary: "Send otp for users who forgot their password" })
  @Post("sendOTP")
  sendOtp(@Body() sendOTPDto: SendOTPDto) {
    return this.authService.sendEmailOTP(sendOTPDto);
  }
}
