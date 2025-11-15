#!/usr/bin/env bash

set -euo pipefail

ENVIRONMENT="${1:-}"
ROLE="${2:-}"
TARGET_TAG="${3:-previous}"

if [[ -z "${ENVIRONMENT}" || -z "${ROLE}" ]]; then
  echo "Usage: $0 <staging|production> <frontend|backend> [image-tag]" >&2
  exit 1
fi

if [[ "${ROLE}" != "frontend" && "${ROLE}" != "backend" ]]; then
  echo "Unsupported role: ${ROLE}" >&2
  exit 1
fi

require_var() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Missing required environment variable: ${name}" >&2
    exit 1
  fi
}

require_var "CI_REGISTRY_IMAGE"
require_var "DEPLOY_SSH_PRIVATE_KEY"

case "${ENVIRONMENT}" in
  staging)
    VAR_PREFIX="DEPLOY_${ROLE^^}_STAGING"
    ;;
  production)
    VAR_PREFIX="DEPLOY_${ROLE^^}_PRODUCTION"
    ;;
  *)
    echo "Unsupported environment: ${ENVIRONMENT}" >&2
    exit 1
    ;;
esac

HOST_VAR="${VAR_PREFIX}_HOST"
USER_VAR="${VAR_PREFIX}_USER"
PATH_VAR="${VAR_PREFIX}_PATH"
ENV_FILE_VAR="${VAR_PREFIX}_ENV_FILE"

require_var "${HOST_VAR}"
require_var "${USER_VAR}"

HOST="${!HOST_VAR}"
USER="${!USER_VAR}"
REMOTE_PATH="${!PATH_VAR-}"
if [[ -z "${REMOTE_PATH}" ]]; then
  REMOTE_PATH="/opt/smilefactory/${ENVIRONMENT}/${ROLE}"
fi

ENV_FILE="${!ENV_FILE_VAR-}"
if [[ -z "${ENV_FILE}" ]]; then
  ENV_FILE="${REMOTE_PATH}/.env"
fi

COMPOSE_FILE="docker-compose.yml"

REGISTRY="${CI_REGISTRY_IMAGE}"

echo ">> Preparing SSH agent"
mkdir -p ~/.ssh
chmod 700 ~/.ssh
eval "$(ssh-agent -s)"
echo "${DEPLOY_SSH_PRIVATE_KEY}" | tr -d '\r' | ssh-add -
ssh-keyscan -H "${HOST}" >> ~/.ssh/known_hosts

echo ">> Rolling back ${ENVIRONMENT} to image tag ${TARGET_TAG}"
ssh "${USER}@${HOST}" bash <<EOF
set -euo pipefail
cd "${REMOTE_PATH}"
IMAGE_TAG="${TARGET_TAG}" \
CONTAINER_REGISTRY="${REGISTRY}" \
docker compose -f ${COMPOSE_FILE} --env-file "${ENV_FILE}" pull
IMAGE_TAG="${TARGET_TAG}" \
CONTAINER_REGISTRY="${REGISTRY}" \
docker compose -f ${COMPOSE_FILE} --env-file "${ENV_FILE}" up -d --remove-orphans
EOF

echo "Rollback to tag ${TARGET_TAG} completed."

