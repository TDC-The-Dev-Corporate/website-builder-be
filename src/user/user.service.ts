import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateUser(updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id: updateUserDto.id },
    });

    if (!existingUser) {
      throw new NotFoundException("User not found");
    }

    return this.prisma.user.update({
      where: { id: updateUserDto.id },
      data: { ...updateUserDto },
    });
  }
}
