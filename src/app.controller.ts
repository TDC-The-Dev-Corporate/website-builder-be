// app.controller.ts
import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getHealth(): string {
    return "OK";
  }
}
