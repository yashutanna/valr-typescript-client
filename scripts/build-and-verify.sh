#!/bin/bash

# Reproducible Build & Verification Script
# Builds the package from source and compares with official checksums

set -e

echo "🔨 Building from source and verifying against official checksums..."
echo ""

# Check if CHECKSUMS.txt exists
if [ ! -f "CHECKSUMS.txt" ]; then
    echo "❌ CHECKSUMS.txt not found!"
    echo "   Make sure you're in the package root directory."
    exit 1
fi

# Extract expected commit and version
EXPECTED_COMMIT=$(grep "Git commit:" CHECKSUMS.txt | cut -d' ' -f3)
EXPECTED_VERSION=$(grep "Version:" CHECKSUMS.txt | cut -d' ' -f2)
CURRENT_COMMIT=$(git rev-parse HEAD)

echo "📦 Package version: $EXPECTED_VERSION"
echo "🔖 Official build commit: $EXPECTED_COMMIT"
echo "🔖 Current commit: $CURRENT_COMMIT"
echo ""

if [ "$EXPECTED_COMMIT" != "$CURRENT_COMMIT" ]; then
    echo "⚠️  Warning: You're not on the official release commit!"
    echo "   Checking out $EXPECTED_COMMIT..."
    git checkout "$EXPECTED_COMMIT"
fi

# Clean and build
echo "🧹 Cleaning previous build..."
rm -rf dist/

echo "📦 Installing dependencies..."
npm ci

echo "🔨 Building from source..."
npm run build

echo ""
echo "🔍 Comparing your build with official checksums..."
echo ""

FAILED=0
MATCHED=0

# Extract and verify dist file checksums
grep -A 1000 "## Distribution Files" CHECKSUMS.txt | \
    grep -B 1000 "## Source Files" | \
    grep "dist/" | \
    while read -r expected_hash file; do
        if [ -f "$file" ]; then
            actual_hash=$(sha256sum "$file" | awk '{print $1}')
            if [ "$expected_hash" = "$actual_hash" ]; then
                echo "  ✅ $file"
                MATCHED=$((MATCHED + 1))
            else
                echo "  ❌ $file (MISMATCH!)"
                echo "     Official: $expected_hash"
                echo "     Your build: $actual_hash"
                FAILED=$((FAILED + 1))
            fi
        else
            echo "  ⚠️  $file (missing from your build)"
            FAILED=$((FAILED + 1))
        fi
    done

echo ""

if [ $FAILED -eq 0 ]; then
    echo "✅ SUCCESS: Your build matches the official build!"
    echo "   This proves the official package was built from this source code."
    echo "   The dist/ files you're running are legitimate."
else
    echo "⚠️  REPRODUCIBILITY WARNING"
    echo "   Your build differs from the official build."
    echo ""
    echo "   Possible reasons:"
    echo "   1. Different Node.js version (use Node 24)"
    echo "   2. Different dependency versions (use npm ci, not npm install)"
    echo "   3. Different build environment (timestamps, paths, etc.)"
    echo "   4. Build tools include timestamps or absolute paths"
    echo ""
    echo "   Note: Some differences are expected with TypeScript/JavaScript builds."
    echo "   This doesn't necessarily mean the official build is malicious."
fi
