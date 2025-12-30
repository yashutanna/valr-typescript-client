#!/bin/bash

# Checksum Verification Script
# Verifies the integrity of the installed package against CHECKSUMS.txt

set -e

CHECKSUM_FILE="CHECKSUMS.txt"
VERIFIED=0
FAILED=0
MISSING=0

if [ ! -f "$CHECKSUM_FILE" ]; then
    echo "❌ CHECKSUMS.txt not found!"
    echo "   This package may not have been built with checksum verification."
    exit 1
fi

echo "🔍 Verifying package checksums..."
echo ""

# Extract git commit from checksums file
EXPECTED_COMMIT=$(grep "Git commit:" "$CHECKSUM_FILE" | cut -d' ' -f3)
PACKAGE_VERSION=$(grep "Version:" "$CHECKSUM_FILE" | cut -d' ' -f2)

echo "📦 Package version: $PACKAGE_VERSION"
echo "🔖 Git commit: $EXPECTED_COMMIT"
echo ""

# Verify distribution files
echo "Verifying distribution files..."

# Extract dist file checksums and verify
while IFS= read -r line; do
    expected_hash=$(echo "$line" | awk '{print $1}')
    file=$(echo "$line" | awk '{$1=""; print $0}' | sed 's/^ //')

    if [ -f "$file" ]; then
        actual_hash=$(sha256sum "$file" | awk '{print $1}')
        if [ "$expected_hash" = "$actual_hash" ]; then
            echo "  ✅ $file"
            VERIFIED=$((VERIFIED + 1))
        else
            echo "  ❌ $file (checksum mismatch!)"
            echo "     Expected: $expected_hash"
            echo "     Got:      $actual_hash"
            FAILED=$((FAILED + 1))
        fi
    else
        echo "  ⚠️  $file (file missing)"
        MISSING=$((MISSING + 1))
    fi
done < <(grep -A 1000 "## Distribution Files" "$CHECKSUM_FILE" | grep -B 1000 "## Source Files" | grep "dist/")

echo ""

# Verify source files (if src directory exists)
if [ -d "src" ]; then
    echo "Verifying source files..."

    # Extract src file checksums and verify
    while IFS= read -r line; do
        expected_hash=$(echo "$line" | awk '{print $1}')
        file=$(echo "$line" | awk '{$1=""; print $0}' | sed 's/^ //')

        if [ -f "$file" ]; then
            actual_hash=$(sha256sum "$file" | awk '{print $1}')
            if [ "$expected_hash" = "$actual_hash" ]; then
                echo "  ✅ $file"
                VERIFIED=$((VERIFIED + 1))
            else
                echo "  ❌ $file (checksum mismatch!)"
                echo "     Expected: $expected_hash"
                echo "     Got:      $actual_hash"
                FAILED=$((FAILED + 1))
            fi
        else
            echo "  ⚠️  $file (file missing)"
            MISSING=$((MISSING + 1))
        fi
    done < <(grep -A 1000 "## Source Files" "$CHECKSUM_FILE" | grep "src/")

    echo ""
fi

echo ""

if [ $FAILED -eq 0 ] && [ $MISSING -eq 0 ]; then
    echo "✅ All checksums verified successfully!"
    echo "   $VERIFIED file(s) verified"
    echo "   This package matches the official build from commit $EXPECTED_COMMIT"
    exit 0
else
    echo "❌ Checksum verification failed!"
    if [ $FAILED -gt 0 ]; then
        echo "   $FAILED file(s) failed verification"
    fi
    if [ $MISSING -gt 0 ]; then
        echo "   $MISSING file(s) missing"
    fi
    echo "   This package may have been tampered with or corrupted."
    exit 1
fi
