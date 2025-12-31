# Release Process

This document describes how to create a new release of the `valr-typescript-client` package.

## Automated Release Workflow

The release process is fully automated via GitHub Actions:

### 1. Create a new version locally

```bash
# Patch version (1.0.10 → 1.0.11)
npm version patch

# Minor version (1.0.11 → 1.1.0)
npm version minor

# Major version (1.1.0 → 2.0.0)
npm version major
```

This command will:
- Bump the version in `package.json`
- Create a git commit with message "1.0.11" (or whatever version)
- Create a git tag `v1.0.11`

### 2. Push the tag to GitHub

```bash
git push --follow-tags
```

Or separately:
```bash
git push origin master
git push origin v1.0.11  # Replace with your version
```

### 3. Automated workflow takes over

Once the tag is pushed, GitHub Actions automatically:

1. **Create Release** (`.github/workflows/create-release.yml`):
   - Detects the new tag (e.g., `v1.0.11`)
   - Generates release notes from commits since last tag
   - Creates a GitHub Release

2. **Build & Publish** (`.github/workflows/npm-publish.yml`):
   - Triggered by the release creation
   - Runs tests
   - Builds the package
   - Generates checksums (CHECKSUMS.txt)
   - Commits checksums back to the repository
   - Attaches checksums to the GitHub Release
   - Publishes to npm with provenance attestation

## Manual Release (Not Recommended)

If you need to create a release manually:

```bash
# Create tag manually
git tag v1.0.11
git push origin v1.0.11

# Then manually create a GitHub Release from the GitHub UI
# This will trigger the build & publish workflow
```

## What Gets Published

The published package includes:
- `dist/` - Compiled JavaScript (CJS and ESM)
- `CHECKSUMS.txt` - SHA256 checksums of all files
- `scripts/verify-checksums.js` - Verification script
- `scripts/verify-checksums.sh` - Unix verification script
- `scripts/build-and-verify.sh` - Reproducible build script
- `package.json`, `README.md`, `LICENSE`, etc.

## Requirements

### GitHub Secrets

The following secret must be configured in your GitHub repository:

- `NPM_TOKEN` - npm authentication token with publish permissions

To set this up:
1. Go to https://www.npmjs.com/settings/your-username/tokens
2. Create a new "Automation" token
3. Add it to GitHub: Settings → Secrets → Actions → New repository secret
4. Name: `NPM_TOKEN`, Value: your token

### npm Trusted Publishing (Optional but Recommended)

The workflow uses npm's provenance feature which provides cryptographic proof that the package was built from your GitHub repository.

This requires:
1. `publishConfig.provenance: true` in package.json ✅ (already configured)
2. `--provenance` flag in npm publish ✅ (already configured)
3. GitHub Actions with `id-token: write` permission ✅ (already configured)

## Troubleshooting

### Tag already exists
```bash
# Delete local tag
git tag -d v1.0.11

# Delete remote tag
git push origin :refs/tags/v1.0.11

# Create new tag
npm version patch
git push --follow-tags
```

### Workflow fails on npm publish

Check that:
1. `NPM_TOKEN` secret is set correctly in GitHub
2. The npm token has publish permissions
3. The package name is not already taken
4. You have publish access to the package on npm

### Checksums commit fails

This usually means:
1. The workflow doesn't have write permissions
2. Branch protection rules are blocking the commit

Make sure:
- Workflow has `contents: write` permission ✅ (already configured)
- Branch protection allows GitHub Actions bot to push

## Verification

After release, verify the package:

```bash
# Install the new version
npm install valr-typescript-client@1.0.11

# Verify checksums
cd node_modules/valr-typescript-client
npm run verify
```

You should see:
```
✅ All checksums verified successfully!
   39 file(s) verified
   This package matches the official build from commit <sha>
```
