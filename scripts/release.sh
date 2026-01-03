#!/bin/bash

# VALR TypeScript Client - Release Script
# Usage: npm run release [patch|minor|major]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_error() {
    echo -e "${RED}❌ Error: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_step() {
    echo -e "\n${BLUE}▶ $1${NC}"
}

# Validate argument
if [ -z "$1" ]; then
    print_error "Version type argument required"
    echo "Usage: npm run release [patch|minor|major]"
    echo ""
    echo "Examples:"
    echo "  npm run release patch   # 1.0.19 → 1.0.20"
    echo "  npm run release minor   # 1.0.19 → 1.1.0"
    echo "  npm run release major   # 1.0.19 → 2.0.0"
    exit 1
fi

VERSION_TYPE=$1

# Validate version type
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    print_error "Invalid version type: $VERSION_TYPE"
    echo "Valid options: patch, minor, major"
    exit 1
fi

print_info "VALR TypeScript Client - Release Process"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if on master branch
print_step "Checking current branch..."
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "master" ]; then
    print_error "You must be on the master branch to create a release"
    echo "Current branch: $CURRENT_BRANCH"
    echo "Run: git checkout master"
    exit 1
fi
print_success "On master branch"

# Check for uncommitted changes
print_step "Checking for uncommitted changes..."
if ! git diff-index --quiet HEAD --; then
    print_error "You have uncommitted changes"
    echo ""
    git status --short
    echo ""
    echo "Please commit or stash your changes before releasing"
    exit 1
fi
print_success "Working directory clean"

# Pull latest changes
print_step "Pulling latest changes from origin/master..."
if ! git pull origin master; then
    print_error "Failed to pull from origin/master"
    exit 1
fi
print_success "Updated from origin/master"

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_info "Current version: $CURRENT_VERSION"

# Calculate new version (dry run)
NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version --dry-run | tail -n 1 | sed 's/v//')
print_info "New version will be: $NEW_VERSION"

# Confirm with user
echo ""
print_warning "This will:"
echo "  1. Bump version from $CURRENT_VERSION → $NEW_VERSION"
echo "  2. Create git commit and tag v$NEW_VERSION"
echo "  3. Push to origin/master with tags"
echo "  4. Trigger GitHub Actions to:"
echo "     - Create GitHub Release"
echo "     - Run tests"
echo "     - Build package"
echo "     - Generate checksums"
echo "     - Publish to npm"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Release cancelled"
    exit 0
fi

# Run tests before releasing
print_step "Running tests..."
if ! npm test; then
    print_error "Tests failed. Fix the issues before releasing."
    exit 1
fi
print_success "All tests passed"

# Build to verify
print_step "Running build to verify..."
if ! npm run build; then
    print_error "Build failed. Fix the issues before releasing."
    exit 1
fi
print_success "Build successful"

# Create version bump (this creates commit and tag)
print_step "Creating version $NEW_VERSION..."
if ! npm version $VERSION_TYPE -m "%s"; then
    print_error "npm version command failed"
    exit 1
fi
print_success "Version bumped to $NEW_VERSION"
print_success "Git commit and tag created"

# Push to origin with tags
print_step "Pushing to origin/master with tags..."
if ! git push origin master --follow-tags; then
    print_error "Failed to push to origin"
    echo ""
    print_warning "The version has been bumped locally but not pushed."
    echo "You can manually push with:"
    echo "  git push origin master --follow-tags"
    echo ""
    echo "Or undo the version bump with:"
    echo "  git tag -d v$NEW_VERSION"
    echo "  git reset --hard HEAD~1"
    exit 1
fi
print_success "Pushed to origin/master with tags"

# Success message
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "Release v$NEW_VERSION initiated successfully!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_info "GitHub Actions workflow has been triggered"
echo ""
echo "Monitor the release process:"
echo "  • Workflow: https://github.com/yashutanna/valr-typescript-client/actions"
echo "  • Release:  https://github.com/yashutanna/valr-typescript-client/releases/tag/v$NEW_VERSION"
echo ""
print_info "The package will be published to npm automatically"
echo "  • Package: https://www.npmjs.com/package/valr-typescript-client"
echo ""
print_success "Done! 🎉"
