import { IsString, IsNotEmpty } from "class-validator";

export class CreateApplicationDto {
  @IsString()
  @IsNotEmpty()
  jobId: string;

  @IsString()
  @IsNotEmpty()
  resume: string;

  @IsString()
  @IsNotEmpty()
  coverLetter: string;
}
