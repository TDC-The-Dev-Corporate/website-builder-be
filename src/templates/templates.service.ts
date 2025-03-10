import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplatesService {
  constructor(private prisma: PrismaService) {}

  create(createTemplateDto: CreateTemplateDto) {
    return this.prisma.template.create({
      data: createTemplateDto,
    });
  }

  findAll() {
    return this.prisma.template.findMany();
  }

  async findOne(id: string) {
    const template = await this.prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return template;
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto) {
    const template = await this.prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return this.prisma.template.update({
      where: { id },
      data: updateTemplateDto,
    });
  }

  async remove(id: string) {
    const template = await this.prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return this.prisma.template.delete({
      where: { id },
    });
  }
}