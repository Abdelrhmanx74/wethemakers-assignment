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
import { ApplicationsService } from "./applications.service";
import {
  CreateApplicationDto,
  UpdateApplicationDto,
  QueryApplicationDto,
} from "./dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import {
  CurrentUser,
  CurrentUserPayload,
} from "../auth/decorators/current-user.decorator";
import { Role } from "@prisma/client";

@Controller("applications")
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.jobseeker)
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.applicationsService.create(createApplicationDto, user.sub);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  findAll(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: QueryApplicationDto,
  ) {
    return this.applicationsService.findAllForAdmin(user.sub, query);
  }

  @Get("my")
  @UseGuards(RolesGuard)
  @Roles(Role.jobseeker)
  findMyApplications(
    @CurrentUser() user: CurrentUserPayload,
    @Query() query: QueryApplicationDto,
  ) {
    return this.applicationsService.findByUser(user.sub, query);
  }

  @Get("my/exists/:jobId")
  @UseGuards(RolesGuard)
  @Roles(Role.jobseeker)
  async hasApplied(
    @CurrentUser() user: CurrentUserPayload,
    @Param("jobId") jobId: string,
  ) {
    const applied = await this.applicationsService.hasApplied(user.sub, jobId);
    return { applied };
  }

  @Get("job/:jobId")
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  findByJob(
    @Param("jobId") jobId: string,
    @Query() query: QueryApplicationDto,
  ) {
    return this.applicationsService.findByJob(jobId, query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  update(
    @Param("id") id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(Role.admin)
  remove(@Param("id") id: string) {
    return this.applicationsService.remove(id);
  }
}
