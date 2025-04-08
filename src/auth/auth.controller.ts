import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LogInDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { JwtGuard } from "./jwt/jwt.guard";
import { ApiBearerAuth, ApiTags, ApiOperation } from "@nestjs/swagger";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { SendOTPDto } from "./dto/send-otp.dto";
import { ForgetPasswordDto } from "./dto/forget-password.dto";

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

  @ApiOperation({ summary: "Reset fogotten password" })
  @Put("reset-forget-password")
  forgetPassword(@Body() forgetPwd: ForgetPasswordDto) {
    return this.authService.resetForgottenPassword(forgetPwd);
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

  @ApiOperation({ summary: "Login with google" })
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleLogin() {
    return { message: "Redirecting to Google..." };
  }

  @ApiOperation({ summary: "Login with google" })
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Req() req, @Res() res) {
    const result = await this.authService.handleOAuthLogin(req.user);

    const html = `
    <html>
      <script>
        window.opener.postMessage(${JSON.stringify(result)}, 'http://localhost:3000');
        window.close();
      </script>
    </html>
  `;

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  }
}
