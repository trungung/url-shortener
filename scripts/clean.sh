#!/bin/bash

# Remove all pnpm-lock.yaml files
find . -type f -name "pnpm-lock.yaml" -delete

# Remove all package-lock.json files
find . -type f -name "package-lock.json" -delete

# Remove all node_modules directories
find . -type d -name "node_modules" -exec rm -rf {} +

echo "Cleanup complete! Removed all pnpm-lock.yaml, package-lock.json, and node_modules directories"
