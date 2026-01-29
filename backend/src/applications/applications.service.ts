import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateApplicationDto,
  UpdateApplicationDto,
  QueryApplicationDto,
} from "./dto";
import { Prisma, JobStatus } from "@prisma/client";

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async hasApplied(userId: string, jobId: string) {
    const count = await this.prisma.application.count({
      where: {
        userId,
        jobId,
      },
    });
    return count > 0;
  }

  async create(createApplicationDto: CreateApplicationDto, userId: string) {
    const { jobId, resume, coverLetter } = createApplicationDto;

    // Check if job exists and is open
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    if (job.status !== JobStatus.open) {
      throw new ForbiddenException(
        "This job is no longer accepting applications",
      );
    }

    // Check if user already applied
    const existingApplication = await this.prisma.application.findFirst({
      where: {
        jobId,
        userId,
      },
    });

    if (existingApplication) {
      throw new ConflictException("You have already applied for this job");
    }

    try {
      return await this.prisma.application.create({
        data: {
          resume,
          coverLetter,
          jobId,
          userId,
        },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              location: true,
              salary: true,
            },
          },
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("You have already applied for this job");
      }
      throw error;
    }
  }

  /**
   * Find all applications for jobs created by this admin
   */
  async findAllForAdmin(adminId: string, query: QueryApplicationDto) {
    const { jobId, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ApplicationWhereInput = {
      job: {
        createdBy: adminId,
      },
    };

    if (jobId) {
      where.jobId = jobId;
    }

    if (status) {
      where.status = status;
    }

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              location: true,
              salary: true,
              status: true,
            },
          },
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      data: applications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByUser(userId: string, query: QueryApplicationDto) {
    const { jobId, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ApplicationWhereInput = { userId };

    if (jobId) {
      where.jobId = jobId;
    }

    if (status) {
      where.status = status;
    }

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          job: {
            select: {
              id: true,
              title: true,
              location: true,
              salary: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      data: applications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByJob(jobId: string, query: QueryApplicationDto) {
    const { status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ApplicationWhereInput = { jobId };

    if (status) {
      where.status = status;
    }

    const [applications, total] = await Promise.all([
      this.prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.application.count({ where }),
    ]);

    return {
      data: applications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const application = await this.prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            salary: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    return application;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto) {
    await this.findOne(id);

    return this.prisma.application.update({
      where: { id },
      data: updateApplicationDto,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            location: true,
            salary: true,
          },
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.application.delete({
      where: { id },
    });
  }
}
