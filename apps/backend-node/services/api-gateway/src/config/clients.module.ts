import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  STORAGE_ADAPTER,
  SUPABASE_CLIENT,
  REDIS_CLIENT,
  createRedisClient,
  createStorageAdapter,
  createSupabaseClient,
} from './clients';
import { LoggerModule } from '../common/logger.module';
import { LoggerService } from '../common/logger.service';

@Global()
@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [
    {
      provide: SUPABASE_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        createSupabaseClient({
          supabase: {
            url: config.get<string>('supabase.url', { infer: true }) ?? '',
            serviceRoleKey:
              config.get<string>('supabase.serviceRoleKey', { infer: true }) ??
              '',
          },
        }),
    },
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService, LoggerService],
      useFactory: (
        config: ConfigService,
        logger: LoggerService,
      ) =>
        createRedisClient(
          { redis: { url: config.get<string>('redis.url', { infer: true }) ?? '' } },
          logger,
        ),
    },
    {
      provide: STORAGE_ADAPTER,
      inject: [SUPABASE_CLIENT, ConfigService],
      useFactory: (supabaseClient, config: ConfigService<AppConfig>) =>
        createStorageAdapter(
          supabaseClient,
          config.get<string>('storage.bucket') as string,
        ),
    },
  ],
  exports: [SUPABASE_CLIENT, REDIS_CLIENT, STORAGE_ADAPTER],
})
export class ClientsModule {}
