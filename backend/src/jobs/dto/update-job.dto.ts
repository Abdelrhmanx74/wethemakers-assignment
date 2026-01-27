import { IsString, IsOptional, IsNumber, IsEnum, Min } from "class-validator";
import { JobStatus } from "@prisma/client";

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  salary?: number;

  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;
}
