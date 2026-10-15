#!/bin/bash

# This script builds the docker images for ATLAS GP Community Edition
# - atlasgp-ce-api-server
# - atlasgp-ce-db-migration
# - atlasgp-ce-webapp

set -e

VERSION=$1

# If version not provided, read from package.json
if [ -z "$VERSION" ]; then
VERSION=$(node -p "require('./package.json').version")
fi

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 24
node -v

echo "Building ATLAS GP CE version: $VERSION"

# Build CE API
echo "========================================="
echo "Building CE API Server..."
echo "========================================="
cd api
bash build-docker-api.sh $VERSION
cd ..

# Build CE Web
echo "========================================="
echo "Building CE Web App..."
echo "========================================="
cd web
bash build-docker-web.sh $VERSION
cd ..

# Build CE MCP
echo "========================================="
echo "Building CE MCP Server..."
echo "========================================="
cd atlasgp-packages/atlasgp-mcp
bash build-docker-mcp.sh $VERSION gimanhead/atlasgp-ce-mcp
cd ../..

echo "========================================="
echo "Build complete!"
echo "Images built:"
echo "  - gimanhead/atlasgp-ce-api-server:$VERSION"
echo "  - gimanhead/atlasgp-ce-webapp:$VERSION"
echo "  - gimanhead/atlasgp-ce-mcp:$VERSION"
echo "========================================="
