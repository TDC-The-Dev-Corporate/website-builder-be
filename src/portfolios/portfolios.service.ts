import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

@Injectable()
export class PortfoliosService {
  constructor(private prisma: PrismaService) {}

  create(createPortfolioDto: CreatePortfolioDto) {
    return this.prisma.portfolio.create({
      data: createPortfolioDto,
    });
  }

  findAll() {
    return this.prisma.portfolio.findMany({
      include: {
        user: true,
        template: true,
      },
    });
  }

  async findOne(id: string) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
      include: {
        user: true,
        template: true,
      },
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }

    return portfolio;
  }

  findByUserId(userId: string) {
    return this.prisma.portfolio.findMany({
      where: { userId },
      include: {
        template: true,
      },
    });
  }

  async update(id: string, updatePortfolioDto: UpdatePortfolioDto) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
    });

    if (!portfolio) {
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
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
      throw new NotFoundException(`Portfolio with ID ${id} not found`);
    }

    return this.prisma.portfolio.delete({
      where: { id },
    });
  }
}