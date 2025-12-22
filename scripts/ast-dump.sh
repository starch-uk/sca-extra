#!/bin/bash

# AST Dump Helper Script
# Usage: ./scripts/ast-dump.sh <apex-file>

if [ $# -eq 0 ]; then
    echo "Usage: $0 <apex-file>"
    echo "Example: $0 tests/fixtures/negative/structure/InnerClassesCannotBeStatic.cls"
    exit 1
fi

APEX_FILE="$1"

if [ ! -f "$APEX_FILE" ]; then
    echo "Error: File not found: $APEX_FILE"
    exit 1
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
pmd ast-dump -d "$APEX_FILE" -l apex

# Alternative: Save to file
OUTPUT_FILE="${APEX_FILE%.cls}.ast.xml"
pmd ast-dump -d "$APEX_FILE" -l apex -f xml > "$OUTPUT_FILE" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "─────────────────────────────────────────────────────────"
    echo "AST XML saved to: $OUTPUT_FILE"
fi

