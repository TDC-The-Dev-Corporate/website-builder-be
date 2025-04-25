import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";

import { PortfoliosService } from "./portfolios.service";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";
import { JwtGuard } from "src/auth/jwt/jwt.guard";

@Controller("portfolios")
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Post()
  create(@Body() createPortfolioDto: CreatePortfolioDto) {
    return this.portfoliosService.create(createPortfolioDto);
  }

  @Get()
  findAll() {
    return this.portfoliosService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.portfoliosService.findOne(id);
  }

  @Get("user/:userId")
  findByUserId(@Param("userId") userId: string) {
    return this.portfoliosService.findByUserId(userId);
  }

  @Get("userByName/:name")
  findByUserName(@Param("name") name: string) {
    return this.portfoliosService.findByUserName(name);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto
  ) {
    return this.portfoliosService.update(id, updatePortfolioDto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.portfoliosService.remove(id);
  }

  @ApiOperation({ summary: "Publish website for user" })
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Put("publish/:id")
  publish(@Param("id") id: string) {
    return this.portfoliosService.publishPortfolio(id);
  }
}
