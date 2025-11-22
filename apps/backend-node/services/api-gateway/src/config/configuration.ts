import { EnvironmentVariables, NodeEnv } from './env.validation';

export interface AppConfig {
  nodeEnv: NodeEnv;
  port: number;
  supabase: {
    url: string;
    serviceRoleKey: string;
  };
  database: {
    url: string;
  };
  redis: {
    url: string;
  };
  storage: {
    bucket: string;
    region: string;
  };
  auth: {
    jwtSecret: string;
    otpWindowSeconds: number;
    otpMaxAttempts: number;
  };
  rateLimit: {
    windowSeconds: number;
    maxRequests: number;
  };
}

export default (): AppConfig => {
  const env = process.env as unknown as EnvironmentVariables;
  return {
    nodeEnv: env.NODE_ENV ?? NodeEnv.Development,
    port: env.PORT ?? 3000,
    supabase: {
      url: env.SUPABASE_URL,
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
    },
    database: {
      url: env.DATABASE_URL,
    },
    redis: {
      url: env.REDIS_URL,
    },
    storage: {
      bucket: env.STORAGE_BUCKET,
      region: env.STORAGE_REGION,
    },
    auth: {
      jwtSecret: env.JWT_SECRET,
      otpWindowSeconds: Number(env.OTP_WINDOW_SECONDS ?? 300),
      otpMaxAttempts: Number(env.OTP_MAX_ATTEMPTS ?? 5),
    },
    rateLimit: {
      windowSeconds: Number(env.RATE_LIMIT_WINDOW_SECONDS ?? 60),
      maxRequests: Number(env.RATE_LIMIT_MAX_REQUESTS ?? 100),
    },
  };
};
