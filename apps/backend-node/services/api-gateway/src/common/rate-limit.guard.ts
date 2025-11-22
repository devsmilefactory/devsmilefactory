import {
  CanActivate,
  ExecutionContext,
  Injectable,
  TooManyRequestsException,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from '../config/clients';
import { AppConfig } from '../config/configuration';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly config: ConfigService<AppConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (!this.redis) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const windowSeconds =
      this.config.get<number>('rateLimit.windowSeconds', { infer: true }) ?? 60;
    const maxRequests =
      this.config.get<number>('rateLimit.maxRequests', { infer: true }) ?? 100;

    const identity =
      (req.headers['x-account-id'] as string) ||
      (req.headers['x-profile-id'] as string) ||
      req.ip;
    const routeKey = `${req.method}:${req.route?.path ?? req.url}`;
    const key = `rate:${identity}:${routeKey}`;

    const now = Date.now();
    const tx = this.redis.multi();
    tx.zremrangebyscore(key, 0, now - windowSeconds * 1000);
    tx.zadd(key, now, `${now}`);
    tx.zcard(key);
    tx.expire(key, windowSeconds);

    const result = await tx.exec().catch(() => null);
    if (!result) {
      return true;
    }

    const countEntry = result[2];
    const countValue = Array.isArray(countEntry) ? countEntry[1] : countEntry;

    if (typeof countValue === 'number' && countValue > maxRequests) {
      throw new TooManyRequestsException('Rate limit exceeded');
    }

    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Window', windowSeconds);
    return true;
  }
}
