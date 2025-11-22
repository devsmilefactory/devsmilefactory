import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum Visibility {
  Public = 'public',
  Private = 'private',
  Targeted = 'targeted',
}

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 20;
}

export class VisibilityDto {
  @IsEnum(Visibility)
  visibility: Visibility = Visibility.Public;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includeProfileTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  includeTags?: string[];
}

export class ProfileContextDto {
  @IsString()
  accountId!: string;

  @IsString()
  profileId!: string;
}
