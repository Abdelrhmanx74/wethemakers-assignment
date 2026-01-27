import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  jobId: string;

  @IsString()
  @IsOptional()
  resumeUrl?: string;

  @IsString()
  @IsOptional()
  resumeName?: string;

  @IsString()
  @IsNotEmpty()
  coverLetter: string;
}
