#!/usr/bin/env bash

set -euo pipefail

BASE_URL="${1:-}"
FRONTEND_URL="${2:-}"
EXTRA_ENDPOINTS="${SMOKE_EXTRA_ENDPOINTS:-}"

if [[ -z "${BASE_URL}" ]]; then
  echo "Usage: $0 <api-base-url> [frontend-url]" >&2
  exit 1
fi

echo ">> Smoke test: API gateway health"
curl --fail --silent --show-error "${BASE_URL}/health"

if [[ -n "${EXTRA_ENDPOINTS}" ]]; then
  for endpoint in ${EXTRA_ENDPOINTS}; do
    echo ">> Smoke test: ${endpoint}"
    curl --fail --silent --show-error "${BASE_URL}${endpoint}"
  done
fi

if [[ -n "${FRONTEND_URL}" ]]; then
  echo ">> Smoke test: Frontend availability"
  curl --fail --silent --show-error "${FRONTEND_URL}"
fi

echo "Smoke tests passed."

