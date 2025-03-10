import { Module } from '@nestjs/common';
import { PortfoliosModule } from './portfolios/portfolios.module';
import { TemplatesModule } from './templates/templates.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    PortfoliosModule,
    TemplatesModule,
  ],
})
export class AppModule {}