import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { CreateJobDto, UpdateJobDto, QueryJobDto } from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import {
  CurrentUser,
  CurrentUserPayload,
} from "../auth/decorators/current-user.decorator";
import { Role } from "@prisma/client";

@Controller("jobs")
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  create(
    @Body() createJobDto: CreateJobDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.jobsService.create(createJobDto, user.sub);
  }

  @Get()
  findAll(@Query() query: QueryJobDto) {
    return this.jobsService.findAll(query);
  }

  @Get("my")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  findMyJobs(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: QueryJobDto,
  ) {
    return this.jobsService.findAllForAdmin(user.sub, query);
  }

  @Get("open")
  findAllOpen(@Query() query: QueryJobDto) {
    return this.jobsService.findAllOpen(query);
  }

  @Get("locations")
  getLocations() {
    return this.jobsService.getLocations();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  update(@Param("id") id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  remove(@Param("id") id: string) {
    return this.jobsService.remove(id);
  }
}
