import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export interface ProfileContext {
  accountId?: string;
  profileId?: string;
  profileType?: string;
}

@Injectable()
export class ProfileContextGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const profileId =
      (request.headers['x-profile-id'] as string | undefined) ??
      (request as any).user?.profileId;
    const accountId =
      (request.headers['x-account-id'] as string | undefined) ??
      (request as any).user?.accountId;

    // For now, allow anonymous requests but attach context when provided.
    (request as any).profileContext = profileId
      ? ({ accountId, profileId } as ProfileContext)
      : null;

    // Future enforcement: throw if required paths lack profile context.
    return true;
  }
}
