import {
  Controller,
  Put,
  Body,
  Req,
  UseGuards,
  Delete,
  Get,
} from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";

import { UpdateUserDto } from "./dto/updateUser.dto";
import { UserService } from "./user.service";
import { JwtGuard } from "../auth/jwt/jwt.guard";

@Controller("user")
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Put()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  update(@Body() updateUser: UpdateUserDto) {
    return this.UserService.updateUser(updateUser);
  }

  @Delete()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  remove(@Req() req) {
    return this.UserService.removeUser(req.user.id);
  }

  @Get()
  findAll() {
    return this.UserService.findAllPublishedSiteUsers();
  }
}
