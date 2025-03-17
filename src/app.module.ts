import { Module } from "@nestjs/common";
import { PortfoliosModule } from "./portfolios/portfolios.module";
import { TemplatesModule } from "./templates/templates.module";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [PrismaModule, PortfoliosModule, TemplatesModule, AuthModule],
})
export class AppModule {}
