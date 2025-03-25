import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";

import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private prismaService: PrismaService,
    configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get<string>("GOOGLE_CLIENT_SECRET"),
      callbackURL: configService.get<string>("GOOGLE_CALLBACK_URL"),
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ) {
    const { id, emails, displayName, photos } = profile;

    let user = await this.prismaService.user.findUnique({
      where: { googleId: id },
    });

    if (!user) {
      user = await this.prismaService.user.create({
        data: {
          googleId: id,
          email: emails[0].value,
          name: displayName,
          username: displayName.replace(/\s+/g, ""),
          profileImage: photos?.[0]?.value || null,
          is_emailVerified: true,
        },
      });
    }

    done(null, user);
  }
}
