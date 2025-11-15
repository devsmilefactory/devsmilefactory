# Troubleshooting

## CI/CD Failures
- **Lint/Test fails**: Re-run locally (`npm run lint`, `npm run test` in `backend`). Ensure snapshots and coverage directories are committed if required.
- **Docker build fails**: Verify Dockerfiles and ensure `.dockerignore` excludes large folders (add if builds are slow). Check registry login variables.
- **SSH deploy errors**: Confirm `DEPLOY_SSH_PRIVATE_KEY` matches authorized key and server allows SSH from runner IPs.

## Runtime Issues
- **Container won't start**: Run `docker compose logs <service>` on remote host; look for missing env vars or migration errors.
- **Health checks failing**: Use `curl http://service:port/health` inside the Docker network. Check Redis connectivity (`redis-cli -h redis ping`).
- **TLS / certificate issues**: Inspect Traefik logs at `/letsencrypt/acme.json`. Ensure DNS records resolve publicly and ports 80/443 are reachable.
- **Supabase authentication errors**: Confirm `SUPABASE_SERVICE_KEY` (service role) is used, not the anon key. Rotate key if compromised.

## Local Development
- **Port conflicts**: Adjust `API_GATEWAY_PORT`, `AUTH_SERVICE_PORT`, `USER_SERVICE_PORT` in `backend/env.example`.
- **Outdated dependencies**: Delete `node_modules` and `package-lock.json`, then run `npm ci`.
- **Redis data stale**: Remove volume: `docker compose down -v` (dev) or `docker volume rm smilefactory-redis_data`.

## Deployment Scripts
- `deploy.sh` returns "permission denied": Ensure script is executable (`chmod +x deployment/scripts/*.sh`) and runner shell is bash-compatible.
- `rsync` path errors: Create remote directories manually (`mkdir -p /opt/smilefactory/staging`).
- `rollback.sh` can't find tag: Provide explicit tag `./rollback.sh production v1.0.0` or retag `docker` images on the server.

## Monitoring & Logging
- Use `docker logs --follow reverse-proxy` for routing issues.
- Attach structured logging solutions (e.g., Loki, ELK) by extending the compose file.

