import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

/**
  * Blocks mutation HTTP methods unless a profile context is present.
  * Read-only methods (GET/HEAD/OPTIONS) pass through for public access.
  */
@Injectable()
export class MutationAuthGuard implements CanActivate {
  private readonly mutationMethods = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const method = (request.method || '').toUpperCase();

    if (!this.mutationMethods.has(method)) {
      return true;
    }

    if (request.profileContext?.profileId) {
      return true;
    }

    throw new UnauthorizedException('Authentication required for mutations');
  }
}
