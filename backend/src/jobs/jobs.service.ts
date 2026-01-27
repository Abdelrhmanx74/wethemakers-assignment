import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateJobDto, UpdateJobDto, QueryJobDto } from "./dto";
import { JobStatus, Prisma } from "@prisma/client";

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto, userId: string) {
    const data = {
      title: createJobDto.title,
      description: createJobDto.description,
      location: createJobDto.location,
      salary: createJobDto.salary ?? null,
      status: createJobDto.status ?? ("open" as const),
      creator: { connect: { id: userId } },
    } satisfies Prisma.JobCreateInput;

    return this.prisma.job.create({
      data,
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Find all jobs created by this admin
   */
  async findAllForAdmin(adminId: string, query: QueryJobDto) {
    const { search, location, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = {
      createdBy: adminId,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (status) {
      where.status = status;
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          creator: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data: jobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Find all jobs (public, for browsing)
   */
  async findAll(query: QueryJobDto) {
    const { search, location, status, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.JobWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (location) {
      where.location = { contains: location, mode: "insensitive" };
    }

    if (status) {
      where.status = status;
    }

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          creator: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          _count: {
            select: { applications: true },
          },
        },
      }),
      this.prisma.job.count({ where }),
    ]);

    return {
      data: jobs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findAllOpen(query: QueryJobDto) {
    return this.findAll({ ...query, status: JobStatus.open });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    await this.findOne(id); // Check if job exists

    return this.prisma.job.update({
      where: { id },
      data: updateJobDto,
      include: {
        creator: {
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
    await this.findOne(id); // Check if job exists

    return this.prisma.job.delete({
      where: { id },
    });
  }

  async getLocations() {
    const locations = await this.prisma.job.findMany({
      select: { location: true },
      distinct: ["location"],
      orderBy: { location: "asc" },
    });

    return locations.map((l) => l.location);
  }
}
