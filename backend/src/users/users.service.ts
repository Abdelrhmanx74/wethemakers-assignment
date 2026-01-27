import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { QueryUserDto } from "./dto";
import { Role } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find applicants who applied to jobs created by this admin
   */
  async findApplicantsForAdmin(adminId: string, query: QueryUserDto) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Get all users who applied to jobs created by this admin
    const applicants = await this.prisma.user.findMany({
      where: {
        role: Role.jobseeker,
        applications: {
          some: {
            job: {
              createdBy: adminId,
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        applications: {
          where: {
            job: {
              createdBy: adminId,
            },
          },
          select: {
            id: true,
            status: true,
            createdAt: true,
            job: {
              select: {
                id: true,
                title: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            applications: {
              where: {
                job: {
                  createdBy: adminId,
                },
              },
            },
          },
        },
      },
    });

    const total = await this.prisma.user.count({
      where: {
        role: Role.jobseeker,
        applications: {
          some: {
            job: {
              createdBy: adminId,
            },
          },
        },
      },
    });

    return {
      data: applicants,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, adminId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        applications: adminId
          ? {
              where: {
                job: {
                  createdBy: adminId,
                },
              },
              select: {
                id: true,
                status: true,
                createdAt: true,
                job: {
                  select: {
                    id: true,
                    title: true,
                    location: true,
                  },
                },
              },
              orderBy: { createdAt: "desc" },
            }
          : false,
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  /**
   * Get stats for admin's own jobs only
   */
  async getStatsForAdmin(adminId: string) {
    const [totalJobs, totalApplications, totalApplicants, openJobs] =
      await Promise.all([
        this.prisma.job.count({ where: { createdBy: adminId } }),
        this.prisma.application.count({
          where: { job: { createdBy: adminId } },
        }),
        this.prisma.user.count({
          where: {
            role: Role.jobseeker,
            applications: {
              some: {
                job: { createdBy: adminId },
              },
            },
          },
        }),
        this.prisma.job.count({
          where: { createdBy: adminId, status: "open" },
        }),
      ]);

    return {
      totalJobs,
      totalApplications,
      totalApplicants,
      openJobs,
    };
  }
}
