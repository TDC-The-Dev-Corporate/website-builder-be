import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";

@Injectable()
export class PortfoliosService {
  constructor(private prisma: PrismaService) {}

  async create(createPortfolioDto: CreatePortfolioDto) {
    const existingPortfolio = await this.prisma.portfolio.findFirst({
      where: {
        userId: createPortfolioDto.userId,
      },
    });

    return await this.prisma.portfolio.create({
      data: createPortfolioDto,
      include: {
        user: true,
      },
    });
  }

  findAll() {
    return this.prisma.portfolio.findMany({
      include: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!portfolio) {
      throw new NotFoundException(`48 Portfolio with ID ${id} not found`);
    }

    return portfolio;
  }

  findByUserId(userId: string) {
    return this.prisma.portfolio.findMany({
      where: { userId },
      include: {
        user: true,
      },
    });
  }

  async findByUserName(name: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { username: name },
        include: {
          portfolios: true,
        },
      });

      if (!user || user.portfolios.length === 0) {
        throw new Error("User or portfolio not found");
      }

      return user.portfolios.find((portfolio) => portfolio.published);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      return null;
    }
  }

  async update(id: string, updatePortfolioDto: UpdatePortfolioDto) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException(`89 Portfolio with ID ${id} not found`);
    }

    return this.prisma.portfolio.update({
      where: { id },
      data: updatePortfolioDto,
    });
  }

  async remove(id: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException(`104 Portfolio with ID ${id} not found`);
    }

    return this.prisma.portfolio.delete({
      where: { id },
    });
  }

  async publishPortfolio(id: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException(`118 Portfolio with ID ${id} not found`);
    }

    return this.prisma.portfolio.update({
      where: { id },
      data: { published: true },
      include: {
        user: true,
      },
    });
  }
}
