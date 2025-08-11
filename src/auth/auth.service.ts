import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

import axios from "axios";

import { PrismaService } from "src/prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { comparePassword, hashPassword } from "src/utils/utility.functions";
import { VerifyService } from "src/utils/verify.service";
import { MailerService } from "src/mailer/mailer.service";
import { LogInDto } from "./dto/login.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { VerifyUserDto } from "./dto/verify-user.dto";
import { SendOTPDto } from "./dto/send-otp.dto";

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
    private verifyService: VerifyService,
    private mailerService: MailerService
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const checkExistingEmail = await this.prismaService.user.findUnique({
        where: { email: registerDto.email.toLowerCase() },
      });

      if (checkExistingEmail) {
        throw new HttpException(
          "This email already exists.",
          HttpStatus.BAD_REQUEST
        );
      }

      const checkExistingUsername = await this.prismaService.user.findUnique({
        where: { username: registerDto.username },
      });

      if (checkExistingUsername) {
        throw new HttpException(
          "Username already exists.",
          HttpStatus.BAD_REQUEST
        );
      }

      const hashedPassword = await hashPassword(registerDto.password);

      const userCreated = await this.prismaService.user.create({
        data: {
          name: registerDto.name,
          email: registerDto.email.toLowerCase(),
          password: hashedPassword,
          username: registerDto.username,
          companyName: registerDto.companyName,
          phoneNumber: registerDto.phoneNumber,
          address: registerDto.address,
          licenseNumber: registerDto.licenseNumber,
          tradeSpecialization: registerDto.tradeSpecialization,
          profileImage: registerDto.profileImage
            ? registerDto.profileImage
            : null,
        },
      });

      if (!userCreated) {
        throw new HttpException("User not created", HttpStatus.BAD_REQUEST);
      }

      // Send OTP for email verification
      const verifyData = await this.verifyService.generateAndStoreOTP(
        userCreated.email
      );
      await this.mailerService.sendEmail(
        registerDto.email,
        "OTP Verification",
        verifyData.otp
      );

      return {
        success: true,
        message: "User created. Verify your account.",
        data: { name: userCreated.name, email: userCreated.email },
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyUser(verifyUserDto: VerifyUserDto) {
    try {
      const { email, verificationCode } = verifyUserDto;

      await this.verifyService.verifyOTP(email.toLowerCase(), verificationCode);

      const user = await this.prismaService.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
      }

      const token = await this.generateToken(user.id);
      return {
        success: true,
        message: "User verified!",
        data: { access_token: token },
      };
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: LogInDto) {
    const email = loginDto.email.trim().toLowerCase();
    const password = loginDto.password?.trim();

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
    }

    if (!user.password) {
      throw new HttpException(
        "This account is registered via Google. Please log in using Google.",
        HttpStatus.UNAUTHORIZED
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException("Invalid password", HttpStatus.UNAUTHORIZED);
    }

    const token = await this.generateToken(user.id);

    return {
      success: true,
      message: "Login successful",
      data: {
        access_token: token,
        ...user,
      },
    };
  }

  async findOneUserByID(userId: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async generateToken(id: string): Promise<string> {
    if (!id) {
      throw new HttpException("User ID is required", HttpStatus.BAD_REQUEST);
    }

    const payload = { id };
    const jwt_secret = this.configService.get<string>("JWT_SECRET");
    const jwt_expiryTime = this.configService.get<number>("JWT_EXPIRY_TIME");

    if (!jwt_secret || !jwt_expiryTime) {
      throw new HttpException(
        "JWT secret or expiry time is missing in environment variables.",
        HttpStatus.BAD_REQUEST
      );
    }

    return this.jwt.signAsync(payload, {
      expiresIn: "10y",
      secret: jwt_secret,
    });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: resetPasswordDto.email },
    });

    if (!user) {
      throw new HttpException("User not found.", HttpStatus.NOT_FOUND);
    }

    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw new HttpException("Passwords do not match", HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await hashPassword(resetPasswordDto.password);

    await this.prismaService.user.update({
      where: { email: resetPasswordDto.email },
      data: { password: hashedPassword },
    });

    return { success: true, message: "Password updated successfully" };
  }

  async getUserById(userId: string) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
  }

  async sendEmailOTP(sendOtpDto: SendOTPDto) {
    const isUser = await this.prismaService.user.findUnique({
      where: {
        email: sendOtpDto.email,
      },
    });

    if (isUser) {
      const verifyData = await this.verifyService.generateAndStoreOTP(
        isUser.email
      );
      const body = `${verifyData.otp}`;
      const sendEmail = await this.mailerService.sendEmail(
        isUser.email,
        "OTP for verification AI Website Builders",
        body
      );

      return { message: `Email sent to ${isUser.email}`, user: isUser };
    } else {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
  }

  async handleOAuthLogin(user: any) {
    const token = await this.generateToken(user.id);
    return {
      success: true,
      message: "Login successful",
      data: {
        access_token: token,
        ...user,
      },
    };
  }

  async validate(authorizationCode: string) {
    try {
      const tokenResponse = await axios.post(
        "https://oauth2.googleapis.com/token",
        {
          code: authorizationCode,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_CALLBACK_URL,
          grant_type: "authorization_code",
        }
      );

      const { access_token, id_token } = tokenResponse.data;

      const profileResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      const profile = profileResponse.data;
      const { id, email, name, picture } = profile;

      let user = await this.prismaService.user.findUnique({
        where: { googleId: id },
      });

      if (!user) {
        user = await this.prismaService.user.create({
          data: {
            googleId: id,
            email,
            name,
            username: name.replace(/\s+/g, ""),
            profileImage: picture || null,
            is_emailVerified: true,
          },
        });

        const token = await this.generateToken(user.id);
        return { user, token };
      } else {
        const token = await this.generateToken(user.id);
        return { user, token };
      }
    } catch (error) {
      console.error(
        "Google OAuth validation error:",
        error.response?.data || error.message
      );
    }
  }
}
