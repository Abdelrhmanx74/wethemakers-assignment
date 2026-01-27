import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  Min,
} from "class-validator";
import { JobStatus } from "@prisma/client";

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  salary?: number;

  @IsEnum(JobStatus)
  @IsOptional()
  status?: JobStatus;
}
