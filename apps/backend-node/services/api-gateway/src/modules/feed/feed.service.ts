import { Injectable } from '@nestjs/common';
import { FeedItemDto, FeedQueryDto } from './feed.dto';
import { VisibilityDto } from '../../dto/common';
import {
  ProfileAudience,
  filterVisibleItems,
  isEligibleForVisibility,
} from '../../common/visibility';

// Placeholder data source; replace with DB integration.
const SAMPLE_FEED: FeedItemDto[] = [
  {
    id: 'post-1',
    title: 'Welcome to SmileFactory',
    excerpt: 'Discover opportunities across the ecosystem.',
    category: 'general' as FeedItemDto['category'],
    tags: ['welcome'],
    visibility: { visibility: 'public' } as VisibilityDto,
    authorProfileId: 'profile-public',
    authorProfileType: 'base',
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'post-2',
    title: 'Internal roadmap',
    excerpt: 'Team-only roadmap sneak peek.',
    category: 'admin' as FeedItemDto['category'],
    tags: ['internal'],
    visibility: {
      visibility: 'targeted',
      includeProfileTypes: ['staff'],
    } as VisibilityDto,
    authorProfileId: 'profile-staff',
    authorProfileType: 'staff',
    publishedAt: new Date().toISOString(),
  },
];

@Injectable()
export class FeedService {
  async getPublicFeed(
    query: FeedQueryDto,
    audience: ProfileAudience,
  ): Promise<FeedItemDto[]> {
    const { categories, tags, limit = 20, page = 1 } = query;
    const filtered = filterVisibleItems(
      SAMPLE_FEED.filter((item) => {
        if (
          categories?.length &&
          !categories.includes(item.category as unknown as FeedItemDto['category'])
        ) {
          return false;
        }
        if (tags?.length && !item.tags?.some((t) => tags.includes(t))) {
          return false;
        }
        return true;
      }),
      audience,
    );

    const start = (page - 1) * limit;
    const end = start + limit;
    return filtered.slice(start, end);
  }

  async getPublicItem(id: string, audience: ProfileAudience) {
    const item = SAMPLE_FEED.find((f) => f.id === id);
    if (!item) return null;
    return isEligibleForVisibility(item.visibility, audience) ? item : null;
  }
}
