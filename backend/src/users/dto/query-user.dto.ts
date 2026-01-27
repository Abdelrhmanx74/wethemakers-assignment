import { IsOptional, IsEnum, IsInt, Min } from "class-validator";
import { Type } from "class-transformer";
import { Role } from "@prisma/client";

export class QueryUserDto {
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
