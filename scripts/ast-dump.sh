#!/bin/bash

# AST Dump Helper Script
# Usage: ./scripts/ast-dump.sh <apex-file>

if [ $# -eq 0 ]; then
    echo "Usage: $0 <apex-file>"
    echo "Example: $0 tests/fixtures/negative/structure/InnerClassesCannotBeStatic.cls"
    exit 1
fi

APEX_FILE="$1"

# Validate input path to prevent path traversal attacks
if [ -z "$APEX_FILE" ]; then
    echo "Error: No file path provided"
    exit 1
fi

# Reject paths containing path traversal sequences
if [[ "$APEX_FILE" == *".."* ]]; then
    echo "Error: Invalid file path (contains path traversal): $APEX_FILE"
    exit 1
fi

# Check if file exists
if [ ! -f "$APEX_FILE" ]; then
    echo "Error: File not found: $APEX_FILE"
    exit 1
fi

# Resolve the path to get canonical path (prevents symbolic link attacks)
if command -v realpath >/dev/null 2>&1; then
    APEX_FILE=$(realpath "$APEX_FILE")
fi

# Check if PMD is available
if ! command -v pmd &> /dev/null; then
    echo "Error: PMD CLI not found. Install PMD to use this script."
    echo "Visit: https://pmd.github.io/pmd/pmd_userdocs_installation.html"
    exit 1
fi

# Run PMD AST dump
echo "Dumping AST for: $APEX_FILE"
echo "─────────────────────────────────────────────────────────"
pmd ast-dump --file="$APEX_FILE" --language=apex

# Alternative: Save to file
OUTPUT_FILE="${APEX_FILE%.cls}.ast.xml"
pmd ast-dump --file="$APEX_FILE" --language=apex --format=xml > "$OUTPUT_FILE" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "─────────────────────────────────────────────────────────"
    echo "AST XML saved to: $OUTPUT_FILE"
fi

