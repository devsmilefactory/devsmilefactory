# Linear Integration for PR/MR Management

This project integrates with Linear to keep issues in sync with GitLab Merge Requests and releases.

## What it does
- On Merge Request pipelines, sets referenced Linear issues to **In Review**
- On production release (tagged deploy), sets referenced Linear issues to **Done**

## How keys are detected
- The CI script scans MR titles, branch names, and release tag messages for keys like `ENG-123`
- Recommended: Include the Linear issue key in your branch name and MR title  
  Example: `feature/ENG-123-improve-deploy` and `ENG-123: Improve deploy`

## Required CI/CD Variables
- `LINEAR_API_KEY` (masked, protected): Linear personal API key
- `LINEAR_TEAM_KEY` (optional): Restrict key detection to a team, e.g. `ENG`

## How it works
1. `.gitlab-ci.yml` adds two jobs:
   - `linear:mr_opened` (on MR pipelines) → sets issues to `In Review`
   - `linear:release_done` (after production deploy for tags) → sets issues to `Done`
2. `scripts/ci/linear-update.sh` uses Linear GraphQL API to:
   - resolve `issue.id` by `issue(key: "ENG-123")`
   - resolve `stateId` by team workflow state name
   - update the issue via `issueUpdate`

## Security
- Keep `LINEAR_API_KEY` secret in GitLab CI/CD variables
- Mark as **Masked** and **Protected**

## Developer Workflow
1. Create branch from `develop`: `feature/ENG-123-title`
2. Open MR using the Default template; paste the Linear link
3. Pipeline runs and sets issue to `In Review`
4. After production release, issue automatically moves to `Done`

