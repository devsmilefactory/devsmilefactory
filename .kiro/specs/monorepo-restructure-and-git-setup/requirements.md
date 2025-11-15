# Requirements Document

## Introduction

This document outlines the requirements for restructuring the SmileFactory codebase into a proper monorepo structure, initializing git version control, creating comprehensive .gitignore files to protect sensitive data, and preparing the repository for deployment to the /smilefactory path with separate servers according to the deployment folder structure. The system will be containerized using Docker and pushed to the GitHub repository at https://github.com/devsmilefactory/devsmilefactory.git.

## Glossary

- **Monorepo**: A single repository containing multiple distinct projects with well-defined relationships
- **SmileFactory System**: The complete application system including frontend, backend services, and deployment infrastructure
- **Git Repository**: A version control system repository for tracking code changes
- **Docker**: A containerization platform for packaging applications with their dependencies
- **Sensitive Files**: Files containing credentials, API keys, environment variables, or other confidential information
- **Deployment Path**: The target directory path (/smilefactory) where the application will be deployed
- **GitHub Remote**: The remote git repository hosted at https://github.com/devsmilefactory/devsmilefactory.git

## Requirements

### Requirement 1

**User Story:** As a developer, I want the codebase restructured into a monorepo format, so that I can manage multiple applications and shared code in a single repository with clear organization.

#### Acceptance Criteria

1. THE SmileFactory System SHALL organize code into an /apps directory containing /frontend, /backend-node, and /backend-java subdirectories
2. THE SmileFactory System SHALL create a /deployment directory containing all deployment scripts, infrastructure code, Helm charts, Docker configurations, Terraform files, and CI/CD pipelines
3. THE SmileFactory System SHALL create a /docs directory containing design documents, architecture diagrams, and onboarding guides
4. THE SmileFactory System SHALL create a /shared directory containing libraries, modules, and utilities reused across applications
5. THE SmileFactory System SHALL create a /config directory containing shared configuration files for ESLint, Prettier, commit-lint, and other development tools
6. THE SmileFactory System SHALL create a /tools directory containing developer scripts for setup, migrations, and other automation tasks
7. THE SmileFactory System SHALL create a root-level README.md file documenting the monorepo structure and setup instructions
8. THE SmileFactory System SHALL preserve all existing code and configuration files during the restructuring process

### Requirement 2

**User Story:** As a developer, I want git version control initialized with comprehensive .gitignore files, so that sensitive information and unnecessary files are never committed to the repository.

#### Acceptance Criteria

1. THE SmileFactory System SHALL initialize a git repository in the root directory
2. THE SmileFactory System SHALL create a root-level .gitignore file that excludes node_modules, build artifacts, IDE files, and OS-specific files
3. THE SmileFactory System SHALL exclude all .env files containing environment variables and credentials from version control
4. THE SmileFactory System SHALL exclude all files with API keys, database credentials, JWT secrets, and authentication tokens from version control
5. THE SmileFactory System SHALL exclude Docker volumes, logs, and temporary files from version control
6. THE SmileFactory System SHALL include .env.example template files in version control for documentation purposes
7. THE SmileFactory System SHALL create application-specific .gitignore files in /apps/frontend, /apps/backend-node, and /apps/backend-java directories
8. THE SmileFactory System SHALL document all excluded sensitive file patterns in the root README.md

### Requirement 3

**User Story:** As a DevOps engineer, I want Docker configurations organized for the /smilefactory deployment path, so that I can deploy to separate servers according to the deployment folder structure.

#### Acceptance Criteria

1. THE SmileFactory System SHALL create Dockerfile configurations for each application in the /apps directory
2. THE SmileFactory System SHALL create docker-compose files in the /deployment directory for orchestrating multi-container deployments
3. THE SmileFactory System SHALL configure all Docker paths to use /smilefactory as the base deployment directory
4. THE SmileFactory System SHALL create separate deployment configurations for frontend, backend-node, and backend-java services
5. THE SmileFactory System SHALL include health check configurations in all Docker service definitions
6. THE SmileFactory System SHALL configure Docker networks for inter-service communication
7. THE SmileFactory System SHALL create deployment scripts in /deployment/scripts for automated deployment workflows
8. THE SmileFactory System SHALL document the deployment architecture and server separation strategy in /docs/deployment

### Requirement 4

**User Story:** As a developer, I want the repository configured and pushed to GitHub, so that the team can collaborate on the codebase with proper version control.

#### Acceptance Criteria

1. THE SmileFactory System SHALL configure the git remote origin to https://github.com/devsmilefactory/devsmilefactory.git
2. THE SmileFactory System SHALL create an initial commit containing the restructured codebase
3. THE SmileFactory System SHALL create a .gitattributes file for consistent line endings across platforms
4. THE SmileFactory System SHALL include a comprehensive commit message describing the monorepo restructuring
5. THE SmileFactory System SHALL verify that no sensitive files are included in the initial commit
6. THE SmileFactory System SHALL create a main branch as the default branch
7. THE SmileFactory System SHALL provide instructions for pushing to the remote repository
8. THE SmileFactory System SHALL document the git workflow and branching strategy in the root README.md

### Requirement 5

**User Story:** As a developer, I want workspace configuration files at the root level, so that I can manage dependencies and scripts across the entire monorepo.

#### Acceptance Criteria

1. THE SmileFactory System SHALL create a root-level package.json with workspace configuration for npm/yarn workspaces
2. THE SmileFactory System SHALL define workspace paths for /apps/*, /shared/*, and /tools/* in the root package.json
3. THE SmileFactory System SHALL include scripts for building, testing, and linting all workspace packages
4. THE SmileFactory System SHALL configure shared devDependencies at the root level to avoid duplication
5. THE SmileFactory System SHALL maintain individual package.json files in each application directory
6. THE SmileFactory System SHALL create a root-level tsconfig.json for shared TypeScript configuration
7. THE SmileFactory System SHALL document the workspace structure and dependency management in the root README.md
8. THE SmileFactory System SHALL ensure all existing dependencies from frontend and backend-node are preserved
