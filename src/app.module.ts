import { Module } from "@nestjs/common";
import { PortfoliosModule } from "./portfolios/portfolios.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [PrismaModule, PortfoliosModule, AuthModule, UserModule],
})
export class AppModule {}
