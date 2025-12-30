# Security Policy

## Package Integrity Verification

Every release of `valr-typescript-client` includes cryptographic checksums to ensure package integrity and protect against supply chain attacks.

### Verifying Your Installation

After installing the package from npm or any registry, verify its integrity:

```bash
cd your-project
npm run verify
```

Or directly:

```bash
node node_modules/valr-typescript-client/scripts/verify-checksums.js
```

This will:
- ✅ Verify all distribution files match the official build
- ✅ Confirm the exact Git commit the package was built from
- ✅ Detect any tampering or corruption
- ✅ Ensure you're running trusted code

### What Gets Verified

Each published package includes checksums for:

1. **Distribution files (`dist/`)** - **The compiled JavaScript you actually execute**
   - `dist/index.js`, `dist/index.mjs` (ESM/CJS bundles)
   - `dist/index.d.ts`, `dist/index.d.mts` (TypeScript definitions)
   - `dist/*.map` (Source maps)

2. **Source files (`src/`)** - The original TypeScript source code
   - For transparency and reproducible builds
   - Allows you to inspect what the dist was built from

3. **Metadata**
   - Git commit SHA (exact source code version)
   - Build timestamp (when built)
   - Package version number

### The Security Model & Trust Chain

**What you execute:** When you `npm install`, you get the **`dist/` files** (compiled JavaScript).

**What gets verified:** The checksums prove your downloaded `dist/` files match the official build.

**The trust chain:**

```
1. Source Code (src/) on GitHub
   ├─ Publicly auditable
   └─ Anyone can inspect

2. GitHub Actions CI/CD
   ├─ Builds dist/ from src/
   ├─ Public build logs
   ├─ Trusted build environment
   └─ Generates CHECKSUMS.txt

3. Published Package (npm)
   ├─ Contains dist/ + CHECKSUMS.txt
   └─ Verified via npm's Trusted Publishing (OIDC)

4. Your Installation
   ├─ Downloads dist/ files
   ├─ Runs: npm run verify
   └─ Confirms checksums match official build
```

**Key trust point:** You're trusting GitHub Actions to build clean `dist/` files from the source code. The checksums prove your package matches that official build.

### What This Protects Against

✅ **Post-publication tampering** - Package modified after being published
✅ **Registry compromise** - npm registry serves different files than official
✅ **Mirror attacks** - Malicious mirrors serving modified packages
✅ **Man-in-the-middle attacks** - Downloaded package doesn't match official
✅ **Dependency confusion** - Verify you got the real package

### What This Doesn't Protect Against

❌ **Compromised CI/CD** - If GitHub Actions itself is compromised
❌ **Malicious build step** - If the build process injects bad code
❌ **Dependency attacks** - Malicious dependencies used during build
❌ **Malicious source code** - You still need to audit the source

**For maximum security:** Inspect the source code at the Git commit shown in CHECKSUMS.txt.

### Transparency

- All builds happen in GitHub Actions (public logs)
- Checksums are generated during CI/CD and committed to the repository
- `CHECKSUMS.txt` is attached to every GitHub Release
- Source code is publicly auditable on GitHub
- No pre-built binaries or compiled code in the repository
- Every release has a permanent audit trail in Git history

### Building from Source

For maximum trust, build from source:

```bash
git clone https://github.com/yashutanna/valr-typescript-client.git
cd valr-typescript-client
git checkout <specific-tag>  # e.g., v1.0.9
npm ci  # Use ci for reproducible dependencies
npm run build
npm test
```

### Reproducible Builds (Advanced)

To verify the official package was built from clean source, you can attempt to reproduce the build:

```bash
# 1. Clone and checkout the release commit
git clone https://github.com/yashutanna/valr-typescript-client.git
cd valr-typescript-client
git checkout v1.0.9  # Use specific version

# 2. Build from source
npm ci
npm run build

# 3. Compare your build with official checksums
bash scripts/build-and-verify.sh
```

**Note:** Perfect reproducibility is difficult with JavaScript/TypeScript builds due to:
- Timestamps in compiled output
- Absolute file paths
- Build tool variations
- Minor dependency version differences

Even if your build differs slightly, this doesn't necessarily mean the official build is malicious. The checksum verification against the official build is still the primary security mechanism.

## Reporting a Vulnerability

If you discover a security vulnerability, please follow responsible disclosure:

### DO NOT

- ❌ Open a public GitHub issue
- ❌ Discuss publicly before a patch is available
- ❌ Exploit the vulnerability

### DO

- ✅ Email the maintainer privately (see package.json for contact)
- ✅ Provide detailed steps to reproduce
- ✅ Allow reasonable time for a fix (typically 90 days)
- ✅ Coordinate public disclosure timing

### What to Report

Security issues we consider in scope:

- Authentication bypass vulnerabilities
- Cryptographic weaknesses in request signing
- Code injection or XSS vulnerabilities
- Dependency vulnerabilities (high/critical severity)
- Package integrity compromise
- Private key exposure risks

### What We Provide

For valid security reports:

- Acknowledgment within 48 hours
- Regular updates on fix progress
- Credit in security advisory (if desired)
- Notification when patch is released

## Security Best Practices

When using this library:

### API Key Security

✅ **DO**:
- Store API keys in environment variables
- Use `.env` files (never commit them!)
- Rotate keys regularly
- Use minimum required permissions
- Delete unused API keys
- Enable IP whitelisting if available

❌ **DON'T**:
- Hard-code API keys in source code
- Commit keys to version control
- Share keys via chat/email
- Use production keys in development
- Give keys excessive permissions

### Dependency Security

- Regularly run `npm audit`
- Keep dependencies updated
- Review security advisories
- Use lock files (`package-lock.json`)

### Network Security

- Always use HTTPS (API enforces this)
- Verify SSL certificates
- Don't disable certificate validation
- Be cautious with proxies

### Code Security

- Validate all user input before passing to API
- Never log sensitive data (keys, balances)
- Handle errors without exposing internals
- Use TypeScript for type safety

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | ✅ Yes             |
| < 1.0   | ❌ No              |

Only the latest minor version receives security updates.

## Security Features

This library includes:

- ✅ Automatic HMAC SHA512 request signing
- ✅ Timestamp-based replay attack prevention
- ✅ Type-safe API to prevent common errors
- ✅ Cryptographic checksum verification
- ✅ No native dependencies (pure JavaScript)
- ✅ Minimal dependency tree
- ✅ Regular security audits

## Third-Party Audits

This package has not yet undergone third-party security audits. Use at your own risk, especially for large amounts.

## License

This security policy is effective as of the release date of version 1.0.0 and applies to all subsequent versions.
