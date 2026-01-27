import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { QueryUserDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import {
  CurrentUser,
  CurrentUserPayload,
} from "../auth/decorators/current-user.decorator";
import { Role } from "@prisma/client";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.admin)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findApplicants(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: QueryUserDto,
  ) {
    return this.usersService.findApplicantsForAdmin(user.sub, query);
  }

  @Get("stats")
  getStats(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.getStatsForAdmin(user.sub);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @CurrentUser() user: CurrentUserPayload) {
    return this.usersService.findOne(id, user.sub);
  }
}
