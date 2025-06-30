import {
  BadRequestException,
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
import { ConfigService } from "@nestjs/config";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

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
  @Patch("resetPassword")
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
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
    const clientUrl = this.configService.get<string>("CLIENT_URL");

    const payload = JSON.stringify(result)
      .replace(/\\/g, "\\\\") // escape backslashes
      .replace(/'/g, "\\'") // escape single quotes
      .replace(/</g, "\\u003c"); // avoid </script> break

    const html = `
    <!DOCTYPE html>
    <html>
      <head><title>Login</title></head>
      <body>
        <script>
          (function() {
            const payload = '${payload}';
            const data = JSON.parse(payload);
            console.log('✅ Sending payload to opener:', data);
            if (window.opener) {
              window.opener.postMessage(data, '${clientUrl}');
              window.close();
            } else {
              console.error('❌ No window.opener');
            }
          })();
        </script>
      </body>
    </html>
  `;

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  }

  @Post("google/validate")
  async googleValidateLogin(@Body("code") code: string) {
    console.log("running......................");
    if (!code) {
      throw new BadRequestException("Authorization code is required");
    }

    const user = await this.authService.validate(code);

    // optionally: generate a JWT token here if your app uses it
    // const token = await this.authService.generateJwt(user);
    // return { user, token };

    return { user };
  }
}
