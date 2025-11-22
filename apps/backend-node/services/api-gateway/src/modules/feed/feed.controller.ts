import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedQueryDto } from './feed.dto';
import { ProfileAudience } from '../../common/visibility';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  async getFeed(@Query() query: FeedQueryDto, @Req() req: any) {
    const audience: ProfileAudience = {
      profileId: req.profileContext?.profileId,
      profileType: req.profileContext?.profileType,
      tags: req.profileContext?.tags,
    };
    const items = await this.feedService.getPublicFeed(query, audience);
    return { items, count: items.length };
  }

  @Get(':id')
  async getFeedItem(@Param('id') id: string, @Req() req: any) {
    const audience: ProfileAudience = {
      profileId: req.profileContext?.profileId,
      profileType: req.profileContext?.profileType,
      tags: req.profileContext?.tags,
    };
    const item = await this.feedService.getPublicItem(id, audience);
    return item ?? { status: 'not_found' };
  }
}
