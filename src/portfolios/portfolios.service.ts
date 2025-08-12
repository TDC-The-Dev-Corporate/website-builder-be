import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { Redis } from "ioredis";

import { PrismaService } from "../prisma/prisma.service";
import { CreatePortfolioDto } from "./dto/create-portfolio.dto";
import { UpdatePortfolioDto } from "./dto/update-portfolio.dto";

@Injectable()
export class PortfoliosService {
  constructor(
    @Inject("REDIS_CLIENT") private readonly redisClient: Redis,
    private prisma: PrismaService
  ) {}

  async create(createPortfolioDto: CreatePortfolioDto) {
    const existingPortfolio = await this.prisma.portfolio.findFirst({
      where: {
        userId: createPortfolioDto.userId,
      },
    });

    const newPortfolio = await this.prisma.portfolio.create({
      data: createPortfolioDto,
      include: {
        user: true,
      },
    });

    // Clear user drafts cache after creating new portfolio
    if (createPortfolioDto.userId) {
      await this.clearCacheByUserId(createPortfolioDto.userId);
    }

    return newPortfolio;
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

  async findByUserId(userId: string) {
    const cacheKey = `userDrafts:${userId}`;

    const cachedData = await this.redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return JSON.parse(cachedData);
    }

    const data = await this.prisma.portfolio.findMany({
      where: { userId },
      include: { user: true },
    });

    if (data.length > 0)
      await this.redisClient.set(
        cacheKey,
        JSON.stringify(data),
        "EX",
        3600 // 1 hour (in seconds)
      );
    console.log(`Cache miss`);

    return data;
  }

  async clearCacheByUserId(userId: string): Promise<void> {
    const cacheKey = `userDrafts:${userId}`;
    const result = await this.redisClient.del(cacheKey);
    if (result) {
      console.log(`Cache cleared for key: ${cacheKey}`);
    } else {
      console.log(`No cache found for key: ${cacheKey}`);
    }
  }

  async clearCacheByUserName(name: string): Promise<void> {
    const cacheKey = `user:${name}`;
    const result = await this.redisClient.del(cacheKey);
    if (result) {
      console.log(`Cache cleared for key: ${cacheKey}`);
    } else {
      console.log(`No cache found for key: ${cacheKey}`);
    }
  }

  async findByUserName(name: string) {
    try {
      const cacheKey = `user:${name}`;

      const cachedData = await this.redisClient.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const user = await this.prisma.user.findUnique({
        where: { username: name },
        include: {
          portfolios: true,
        },
      });

      if (!user || user.portfolios.length === 0) {
        throw new Error("User or portfolio not found");
      }

      const portfolio = user.portfolios.find(
        (portfolio) => portfolio.published
      );

      await this.redisClient.set(
        cacheKey,
        JSON.stringify(portfolio),
        "EX",
        3600 // 1 hour (in seconds)
      );

      return portfolio;
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      return null;
    }
  }

  async update(id: string, updatePortfolioDto: UpdatePortfolioDto) {
    const portfolio = await this.prisma.portfolio.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!portfolio) {
      throw new NotFoundException(`89 Portfolio with ID ${id} not found`);
    }

    const updatedPortfolio = await this.prisma.portfolio.update({
      where: { id },
      data: updatePortfolioDto,
      include: { user: true },
    });

    // Clear related caches after update
    if (portfolio.user) {
      await this.clearCacheByUserId(portfolio.user.id);
      if (portfolio.user.username) {
        await this.clearCacheByUserName(portfolio.user.username);
      }
    }

    return updatedPortfolio;
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
      include: { user: true },
    });

    if (!portfolio) {
      throw new NotFoundException(`118 Portfolio with ID ${id} not found`);
    }

    // First, unpublish any other published portfolios for this user
    await this.prisma.portfolio.updateMany({
      where: {
        userId: portfolio.userId,
        published: true,
        id: { not: id }, // Don't unpublish the current one if it's already published
      },
      data: { published: false },
    });

    const publishedPortfolio = await this.prisma.portfolio.update({
      where: { id },
      data: { published: true },
      include: {
        user: true,
      },
    });

    // Clear related caches after publishing
    if (portfolio.user) {
      await this.clearCacheByUserId(portfolio.user.id);
      if (portfolio.user.username) {
        await this.clearCacheByUserName(portfolio.user.username);
      }
    }

    return publishedPortfolio;
  }
}
