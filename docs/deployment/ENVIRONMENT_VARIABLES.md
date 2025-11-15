# Environment Variables

| Service | Variable | Required | Description | Example |
| --- | --- | --- | --- | --- |
| All | `NODE_ENV` | ✅ | Runtime mode (`development`, `staging`, `production`) | `production` |
| All | `REDIS_HOST` | ✅ | Redis hostname reachable within network | `redis` |
| All | `REDIS_PORT` | ✅ | Redis port | `6379` |
| All | `REDIS_PASSWORD` | ⛔️ | Password if Redis auth enabled | *(blank)* |
| Frontend | `VITE_API_BASE_URL` | ✅ | Base URL for API gateway | `https://api.example.com/api/v1` |
| API Gateway | `API_GATEWAY_PORT` | ✅ | Listening port | `3000` |
| API Gateway | `CORS_ORIGIN` | ✅ | Allowed frontend origin | `https://app.example.com` |
| API Gateway | `AUTH_SERVICE_URL` | ⛔️ | Internal auth service URL (future) | `http://auth-service:3001` |
| API Gateway | `USER_SERVICE_URL` | ⛔️ | Internal user service URL (future) | `http://user-service:3002` |
| Auth Service | `AUTH_SERVICE_PORT` | ✅ | Listening port | `3001` |
| Auth Service | `SUPABASE_URL` | ✅ | Supabase project URL | `https://xyz.supabase.co` |
| Auth Service | `SUPABASE_SERVICE_KEY` | ✅ | Supabase service-role key | `eyJhbGci...` |
| Auth Service | `JWT_SECRET` | ✅ | Secret for signing access/refresh tokens | `super-secret` |
| Auth Service | `SENDGRID_API_KEY` | ⛔️ | Email provider key for OTPs | `SG.xxxxxx` |
| User Service | `USER_SERVICE_PORT` | ✅ | Listening port | `3002` |
| User Service | `SUPABASE_URL` | ✅ | Supabase project URL | `https://xyz.supabase.co` |
| User Service | `SUPABASE_SERVICE_KEY` | ✅ | Supabase service-role key | `eyJhbGci...` |
| User Service | `JWT_PUBLIC_KEY` | ⛔️ | Public key to verify JWTs issued by auth | `-----BEGIN PUBLIC KEY-----` |
| Traefik (both) | `LETSENCRYPT_EMAIL` | ✅ | Email for Let's Encrypt registration | `ops@example.com` |
| Traefik (backend) | `API_DOMAIN` | ✅ | Public API domain handled by backend Traefik | `api.example.com` |
| Traefik (backend) | `TRAEFIK_DASHBOARD_DOMAIN` | ✅ | Dashboard domain for backend Traefik | `traefik-api.example.com` |
| Traefik (frontend) | `APP_DOMAIN` | ✅ | Public SPA domain handled by frontend Traefik | `app.example.com` |
| Traefik (frontend) | `TRAEFIK_DASHBOARD_DOMAIN` | ✅ | Dashboard domain for frontend Traefik | `traefik-app.example.com` |
| Traefik | `TRAEFIK_BASIC_AUTH` | ✅ | Dashboard basic auth credentials (htpasswd) | `user:$apr1$hash` |
| Compose | `CONTAINER_REGISTRY` | ✅ | Registry path for images | `registry.gitlab.com/org/smilefactory` |
| Compose | `IMAGE_TAG` | ✅ | Image tag pulled during deploy | `a1b2c3d4` |

✅ = required for normal operation  
⛔️ = optional / feature-specific

Keep sensitive values in GitLab CI variables or server-side `.env` files—never commit them to the repository.

## GitLab Deploy Variables (per environment)
- Backend server (staging): `DEPLOY_BACKEND_STAGING_HOST`, `DEPLOY_BACKEND_STAGING_USER`, `DEPLOY_BACKEND_STAGING_PATH`, `DEPLOY_BACKEND_STAGING_ENV_FILE`
- Frontend server (staging): `DEPLOY_FRONTEND_STAGING_HOST`, `DEPLOY_FRONTEND_STAGING_USER`, `DEPLOY_FRONTEND_STAGING_PATH`, `DEPLOY_FRONTEND_STAGING_ENV_FILE`
- Repeat the variables above with `_PRODUCTION_` for production servers

