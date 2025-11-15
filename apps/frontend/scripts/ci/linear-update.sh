#!/usr/bin/env bash

set -euo pipefail

# Usage:
#   linear-update.sh <action> "<text-to-scan-for-keys>" [teamKey(optional)]
# Actions:
#   review  -> set issue state to "In Review"
#   done    -> set issue state to "Done"
#
# Key detection:
#   - Extracts keys like ABC-123 from input text (MR title, branch name, commit message)

ACTION="${1:-}"
SCAN_TEXT="${2:-}"
TEAM_KEY="${3:-}"  # Optional Linear team key prefix, e.g., "ENG"

if [[ -z "${ACTION}" || -z "${SCAN_TEXT}" ]]; then
  echo "Usage: $0 <review|done> \"<text>\" [teamKey]" >&2
  exit 1
fi

if [[ -z "${LINEAR_API_KEY:-}" ]]; then
  echo "Missing LINEAR_API_KEY environment variable" >&2
  exit 1
fi

# Extract potential keys (e.g., ENG-123)
if [[ -n "${TEAM_KEY}" ]]; then
  KEY_REGEX="\\b${TEAM_KEY}-[0-9]+\\b"
else
  KEY_REGEX="\\b[A-Z]{2,}-[0-9]+\\b"
fi

mapfile -t ISSUE_KEYS < <(echo "${SCAN_TEXT}" | grep -oE "${KEY_REGEX}" | sort -u || true)

if [[ "${#ISSUE_KEYS[@]}" -eq 0 ]]; then
  echo "No Linear issue keys found in text."
  exit 0
fi

linear_query() {
  local query="$1"
  curl --silent --fail --show-error \
    -H "Content-Type: application/json" \
    -H "Authorization: ${LINEAR_API_KEY}" \
    -X POST https://api.linear.app/graphql \
    -d "{\"query\":$(jq -Rs . <<< "${query}")}"
}

# Resolve stateId by name on the issue's team (fetch per issue)
get_issue_id() {
  local key="$1"
  linear_query "query { issue(key: \"${key}\") { id team { id } } }"
}

get_state_id_by_name() {
  local teamId="$1"
  local stateName="$2"
  linear_query "query { workflowStates(filter: {team: {id: {eq: \"${teamId}\"}}}) { nodes { id name team { id } } } }" \
    | jq -r ".data.workflowStates.nodes[] | select(.name==\"${stateName}\" and .team.id==\"${teamId}\") | .id"
}

update_issue_state() {
  local issueId="$1"
  local stateId="$2"
  linear_query "mutation { issueUpdate(id: \"${issueId}\", input: {stateId: \"${stateId}\"}) { success } }" > /dev/null
}

STATE_NAME=""
case "${ACTION}" in
  review) STATE_NAME="In Review" ;;
  done)   STATE_NAME="Done" ;;
  *) echo "Unsupported action: ${ACTION}"; exit 1 ;;
esac

echo "Detected Linear issues: ${ISSUE_KEYS[*]}"

for key in "${ISSUE_KEYS[@]}"; do
  echo "Processing ${key} → ${STATE_NAME}"
  ISSUE_JSON="$(get_issue_id "${key}")"
  ISSUE_ID="$(echo "${ISSUE_JSON}" | jq -r '.data.issue.id')"
  TEAM_ID="$(echo "${ISSUE_JSON}" | jq -r '.data.issue.team.id')"

  if [[ "${ISSUE_ID}" == "null" || -z "${ISSUE_ID}" ]]; then
    echo "Could not resolve Linear issue for key ${key}, skipping."
    continue
  fi

  STATE_ID="$(get_state_id_by_name "${TEAM_ID}" "${STATE_NAME}")"
  if [[ -z "${STATE_ID}" ]]; then
    echo "Could not find state \"${STATE_NAME}\" for team ${TEAM_ID}, skipping ${key}."
    continue
  fi

  update_issue_state "${ISSUE_ID}" "${STATE_ID}"
  echo "Updated ${key} → ${STATE_NAME}"
done

echo "Linear update complete."


