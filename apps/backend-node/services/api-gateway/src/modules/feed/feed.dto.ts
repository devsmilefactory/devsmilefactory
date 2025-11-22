import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PaginationDto, Visibility, VisibilityDto } from '../../dto/common';

export enum FeedCategory {
  General = 'general',
  Opportunity = 'opportunity',
  Update = 'update',
  Blog = 'blog',
  Event = 'event',
  Marketplace = 'marketplace',
  Admin = 'admin',
}

export class FeedQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(FeedCategory, { each: true })
  categories?: FeedCategory[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class FeedItemVisibilityDto extends VisibilityDto {}

export class FeedItemDto {
  @IsString()
  id!: string;

  @IsString()
  title!: string;

  @IsString()
  @MaxLength(280)
  excerpt!: string;

  @IsEnum(FeedCategory)
  category!: FeedCategory;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @Type(() => FeedItemVisibilityDto)
  visibility!: FeedItemVisibilityDto;

  @IsString()
  authorProfileId!: string;

  @IsString()
  authorProfileType!: string;

  @IsString()
  publishedAt!: string;
}
