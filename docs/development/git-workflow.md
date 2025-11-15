# Git Workflow Guide

This document outlines the Git workflow and best practices for the SmileFactory project.

## Branching Strategy

We use a simplified Git Flow branching model:

```
main (production)
  ↑
develop (integration)
  ↑
feature/* (new features)
bugfix/* (bug fixes)
hotfix/* (urgent production fixes)
```

### Branch Types

#### `main`
- **Purpose**: Production-ready code
- **Protected**: Yes
- **Deployment**: Automatically deployed to production
- **Merges from**: `develop`, `hotfix/*`

#### `develop`
- **Purpose**: Integration branch for features
- **Protected**: Yes
- **Deployment**: Automatically deployed to staging
- **Merges from**: `feature/*`, `bugfix/*`

#### `feature/*`
- **Purpose**: New features and enhancements
- **Naming**: `feature/short-description`
- **Created from**: `develop`
- **Merges to**: `develop`
- **Examples**:
  - `feature/user-authentication`
  - `feature/profile-page`
  - `feature/api-integration`

#### `bugfix/*`
- **Purpose**: Bug fixes for develop branch
- **Naming**: `bugfix/short-description`
- **Created from**: `develop`
- **Merges to**: `develop`
- **Examples**:
  - `bugfix/login-validation`
  - `bugfix/api-timeout`

#### `hotfix/*`
- **Purpose**: Urgent fixes for production
- **Naming**: `hotfix/short-description`
- **Created from**: `main`
- **Merges to**: `main` and `develop`
- **Examples**:
  - `hotfix/security-patch`
  - `hotfix/critical-bug`

## Workflow Steps

### Starting a New Feature

```bash
# 1. Update develop branch
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/my-new-feature

# 3. Make changes and commit
git add .
git commit -m "feat(scope): add new feature"

# 4. Push to remote
git push origin feature/my-new-feature

# 5. Create Pull Request on GitHub
```

### Working on a Feature

```bash
# Make changes
git add .
git commit -m "feat(scope): implement feature logic"

# Keep branch updated with develop
git fetch origin
git rebase origin/develop

# Push changes
git push origin feature/my-new-feature
```

### Completing a Feature

```bash
# 1. Update with latest develop
git checkout develop
git pull origin develop
git checkout feature/my-new-feature
git rebase develop

# 2. Push final changes
git push origin feature/my-new-feature

# 3. Create Pull Request
# 4. Wait for code review
# 5. Address review comments
# 6. Merge to develop (via PR)
# 7. Delete feature branch
git checkout develop
git pull origin develop
git branch -d feature/my-new-feature
git push origin --delete feature/my-new-feature
```

### Creating a Hotfix

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-issue

# 2. Fix the issue
git add .
git commit -m "fix: resolve critical issue"

# 3. Push and create PR to main
git push origin hotfix/critical-issue

# 4. After merging to main, merge to develop
git checkout develop
git pull origin develop
git merge hotfix/critical-issue
git push origin develop

# 5. Delete hotfix branch
git branch -d hotfix/critical-issue
git push origin --delete hotfix/critical-issue
```

## Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

Must be one of:

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI/CD configuration
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope

Optional. Indicates the area of the codebase:

- `frontend`: Frontend changes
- `backend`: Backend changes
- `api`: API changes
- `auth`: Authentication changes
- `db`: Database changes
- `docker`: Docker configuration
- `deployment`: Deployment configuration

### Subject

- Use imperative, present tense: "add" not "added" nor "adds"
- Don't capitalize first letter
- No period (.) at the end
- Maximum 50 characters

### Body

Optional. Provides additional context:

- Use imperative, present tense
- Explain what and why, not how
- Wrap at 72 characters

### Footer

Optional. References issues or breaking changes:

- `Closes #123` - Closes issue #123
- `BREAKING CHANGE:` - Indicates breaking changes

### Examples

#### Simple Commit

```bash
git commit -m "feat(frontend): add user profile page"
```

#### Commit with Body

```bash
git commit -m "fix(auth): resolve token expiration issue

The JWT token was expiring too quickly due to incorrect
configuration. Updated the expiration time to 24 hours.

Closes #456"
```

#### Breaking Change

```bash
git commit -m "feat(api): change user endpoint response format

BREAKING CHANGE: The /api/users endpoint now returns an array
of user objects instead of a paginated response. Update all
clients to handle the new format."
```

## Pull Request Process

### Creating a Pull Request

1. **Push your branch** to GitHub
2. **Navigate** to the repository on GitHub
3. **Click** "New Pull Request"
4. **Select** base branch (usually `develop`)
5. **Select** compare branch (your feature branch)
6. **Fill in** PR template:
   - Title (following commit convention)
   - Description
   - Related issues
   - Testing steps
   - Screenshots (if UI changes)
7. **Assign** reviewers
8. **Add** labels
9. **Create** pull request

### PR Title Format

Follow the same convention as commit messages:

```
feat(frontend): add user profile page
fix(backend): resolve authentication bug
docs: update deployment guide
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Related Issues
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Steps to test the changes:
1. Step 1
2. Step 2
3. Step 3

## Screenshots (if applicable)
[Add screenshots here]

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] No merge conflicts
```

### Code Review Process

#### For Authors

1. **Ensure** all checks pass (CI/CD, tests, linting)
2. **Respond** to review comments promptly
3. **Make** requested changes
4. **Push** updates to the same branch
5. **Request** re-review after changes

#### For Reviewers

1. **Review** code thoroughly
2. **Check** for:
   - Code quality and style
   - Logic errors
   - Security issues
   - Performance concerns
   - Test coverage
   - Documentation
3. **Provide** constructive feedback
4. **Approve** or request changes
5. **Merge** after approval (if authorized)

### Merging

- **Squash and merge**: For feature branches (keeps history clean)
- **Merge commit**: For release branches (preserves history)
- **Rebase and merge**: For small, clean commits

## Best Practices

### Commits

- **Commit often**: Small, logical commits
- **Atomic commits**: One logical change per commit
- **Meaningful messages**: Clear and descriptive
- **Test before commit**: Ensure code works

### Branches

- **Keep branches short-lived**: Merge within a few days
- **Update regularly**: Rebase with develop frequently
- **Delete after merge**: Clean up merged branches
- **One feature per branch**: Don't mix unrelated changes

### Code

- **Follow style guide**: Use ESLint and Prettier
- **Write tests**: Add tests for new features
- **Document changes**: Update relevant documentation
- **Review your own code**: Self-review before PR

### Collaboration

- **Communicate**: Discuss major changes before implementing
- **Be respectful**: Provide constructive feedback
- **Be responsive**: Reply to comments and reviews
- **Help others**: Review PRs from teammates

## Common Scenarios

### Updating Feature Branch with Develop

```bash
# Option 1: Rebase (preferred)
git checkout feature/my-feature
git fetch origin
git rebase origin/develop

# Resolve conflicts if any
git add .
git rebase --continue

# Force push (rebase rewrites history)
git push origin feature/my-feature --force-with-lease

# Option 2: Merge
git checkout feature/my-feature
git merge develop
git push origin feature/my-feature
```

### Resolving Merge Conflicts

```bash
# 1. Update your branch
git fetch origin
git rebase origin/develop

# 2. Git will pause at conflicts
# Edit conflicted files, resolve conflicts

# 3. Mark as resolved
git add <resolved-files>

# 4. Continue rebase
git rebase --continue

# 5. Push changes
git push origin feature/my-feature --force-with-lease
```

### Undoing Changes

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo changes to a file
git checkout -- <file>

# Revert a commit (creates new commit)
git revert <commit-hash>
```

### Stashing Changes

```bash
# Save changes temporarily
git stash

# List stashes
git stash list

# Apply latest stash
git stash apply

# Apply and remove latest stash
git stash pop

# Apply specific stash
git stash apply stash@{0}

# Clear all stashes
git stash clear
```

### Cherry-picking Commits

```bash
# Apply a specific commit to current branch
git cherry-pick <commit-hash>

# Cherry-pick multiple commits
git cherry-pick <commit1> <commit2>

# Cherry-pick without committing
git cherry-pick -n <commit-hash>
```

## Git Hooks

We use Git hooks for automated checks:

### Pre-commit Hook

Runs before each commit:
- Linting
- Formatting check
- Type checking

### Pre-push Hook

Runs before pushing:
- Run tests
- Build check

### Commit-msg Hook

Validates commit message format using commitlint.

## Troubleshooting

### Accidentally Committed to Wrong Branch

```bash
# 1. Create correct branch
git branch feature/correct-branch

# 2. Reset current branch
git reset --hard HEAD~1

# 3. Switch to correct branch
git checkout feature/correct-branch
```

### Need to Change Last Commit Message

```bash
# Change last commit message
git commit --amend -m "new message"

# If already pushed
git push origin feature/my-feature --force-with-lease
```

### Pushed Sensitive Data

```bash
# 1. Remove from history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch <file>" \
  --prune-empty --tag-name-filter cat -- --all

# 2. Force push
git push origin --force --all

# 3. Rotate any exposed credentials immediately
```

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)

## Questions?

If you have questions about the Git workflow, ask the team or refer to this guide.

Happy collaborating! 🚀
