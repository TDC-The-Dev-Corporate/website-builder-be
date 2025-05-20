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
          host: "localhost", // Redis server host
          port: 6379, // Redis server port
        });
      },
    },
  ],
  exports: ["REDIS_CLIENT"],
})
export class PortfoliosModule {}
