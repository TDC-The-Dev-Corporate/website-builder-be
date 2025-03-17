// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { PrismaModule } from 'src/prisma/prisma.module';
// import { MailerModule } from 'src/mailer/mailer.module';
// import { VerifyService } from 'src/utils/verify.service';
// import { JwtModule } from '@nestjs/jwt';
// import { JwtStrategy } from './jwt/jwt.strategy';

// @Module({
//   imports: [PrismaModule, MailerModule, JwtModule],
//   controllers: [AuthController],
//   providers: [AuthService, VerifyService, JwtStrategy],
// })
// export class AuthModule {}

import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt/jwt.strategy";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { MailerModule } from "src/mailer/mailer.module";
import { PrismaService } from "src/prisma/prisma.service";
import { VerifyService } from "src/utils/verify.service";
import { MailerService } from "src/mailer/mailer.service";

@Module({
  imports: [
    PrismaModule,
    MailerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET"),
        signOptions: { expiresIn: "1d" },
      }),
    }),
    ConfigModule.forRoot(), // Make sure ConfigModule is imported
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,
    VerifyService,
    MailerService,
    ConfigService,
  ], // Ensure ConfigService is provided
  exports: [AuthService],
})
export class AuthModule {}
