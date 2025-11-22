import { createClient, SupabaseClient } from '@supabase/supabase-js';
import Redis, { Redis as RedisClient } from 'ioredis';
import { AppConfig } from './configuration';
import { NodeEnv } from './env.validation';
import { LoggerService } from '../common/logger.service';

export interface StorageAdapter {
  upload(
    path: string,
    file: Buffer | Blob,
    options?: { contentType?: string },
  ): Promise<string>;
  remove(path: string): Promise<void>;
}

export const SUPABASE_CLIENT = Symbol('SUPABASE_CLIENT');
export const REDIS_CLIENT = Symbol('REDIS_CLIENT');
export const STORAGE_ADAPTER = Symbol('STORAGE_ADAPTER');

export function createSupabaseClient(
  config: Pick<AppConfig, 'supabase'>,
): SupabaseClient {
  return createClient(config.supabase.url, config.supabase.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'x-application-name': 'smilefactory-api-gateway',
      },
    },
  });
}

export function createProfileScopedClient(
  config: Pick<AppConfig, 'supabase'>,
  accessToken: string,
): SupabaseClient {
  // For RLS-aware operations, use the profile/session token instead of the service role.
  return createClient(config.supabase.url, accessToken, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function createRedisClient(
  config: Pick<AppConfig, 'redis'>,
  logger?: LoggerService,
): RedisClient {
  const client = new Redis(config.redis.url, {
    lazyConnect: true,
    maxRetriesPerRequest: null,
  });

  client.on('error', (err) =>
    logger?.error(`Redis error: ${err.message}`, err.stack, 'RedisClient'),
  );
  client.on('connect', () => logger?.log('Redis connected', 'RedisClient'));
  client.on('close', () => logger?.warn('Redis connection closed', 'RedisClient'));

  // Connect asynchronously; callers can await when needed.
  client.connect().catch((err) => {
    logger?.error(`Redis connect failed: ${err.message}`, err.stack, 'RedisClient');
  });

  return client;
}

export function createStorageAdapter(
  supabase: SupabaseClient,
  bucket: string,
): StorageAdapter {
  return {
    async upload(path, file, options) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: options?.contentType,
        });
      if (error) {
        throw error;
      }
      return data?.path ?? path;
    },
    async remove(path) {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) {
        throw error;
      }
    },
  };
}

export function isProduction(env: NodeEnv) {
  return env === NodeEnv.Production;
}
