import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { JwtStrategy } from "./jwt/jwt.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { MailerModule } from "src/mailer/mailer.module";
import { PrismaService } from "src/prisma/prisma.service";
import { VerifyService } from "src/utils/verify.service";
import { MailerService } from "src/mailer/mailer.service";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
  imports: [
    PrismaModule,
    MailerModule,
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "10y" },
      }),
    }),
    ConfigModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,
    VerifyService,
    MailerService,
    ConfigService,
    GoogleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
