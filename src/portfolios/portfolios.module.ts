import { Module } from "@nestjs/common";
import { Redis } from "ioredis";

import { PortfoliosService } from "./portfolios.service";
import { PortfoliosController } from "./portfolios.controller";

@Module({
  controllers: [PortfoliosController],
  providers: [
    PortfoliosService,
    {
      provide: "REDIS_CLIENT",

      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT, 10),
        });
      },
    },
  ],
  exports: ["REDIS_CLIENT"],
})
export class PortfoliosModule {}
