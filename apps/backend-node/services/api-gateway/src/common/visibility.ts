import { ForbiddenException } from '@nestjs/common';
import { VisibilityDto } from '../dto/common';

export interface ProfileAudience {
  profileId?: string;
  profileType?: string;
  tags?: string[];
}

export function isEligibleForVisibility(
  visibility: VisibilityDto,
  audience: ProfileAudience,
) {
  if (visibility.visibility === 'public') return true;
  if (visibility.visibility === 'private') {
    return Boolean(audience.profileId);
  }
  // targeted
  const typeAllowed =
    !visibility.includeProfileTypes?.length ||
    (audience.profileType &&
      visibility.includeProfileTypes.includes(audience.profileType));
  const tagAllowed =
    !visibility.includeTags?.length ||
    (audience.tags ?? []).some((t) => visibility.includeTags?.includes(t));
  return typeAllowed && tagAllowed;
}

export function assertVisibility(
  visibility: VisibilityDto,
  audience: ProfileAudience,
) {
  if (!isEligibleForVisibility(visibility, audience)) {
    throw new ForbiddenException('Not eligible to view this resource');
  }
}

export function filterVisibleItems<T extends { visibility: VisibilityDto }>(
  items: T[],
  audience: ProfileAudience,
): T[] {
  return items.filter((item) => isEligibleForVisibility(item.visibility, audience));
}
