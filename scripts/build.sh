#!/bin/bash
# Copyright (c) Velocity BPA, LLC
# Licensed under the Business Source License 1.1

set -e

echo "🏗️ Building n8n-nodes-ripple-prime..."

# Clean previous build
rm -rf dist/

# Install dependencies
npm install

# Run build
npm run build

echo ""
echo "✅ Build complete!"
echo "Output directory: ./dist"
ls -la dist/
