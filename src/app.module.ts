import { Module } from "@nestjs/common";

import { PortfoliosModule } from "./portfolios/portfolios.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { StripeModule } from "./stripe/stripe.module";

@Module({
  imports: [
    PrismaModule,
    PortfoliosModule,
    AuthModule,
    UserModule,
    StripeModule,
  ],
})
export class AppModule {}
