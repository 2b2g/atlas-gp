#!/bin/bash

# This script builds the docker image for the atlasgp-ce-webapp

VERSION=$1

pnpm build

docker buildx build --platform=linux/amd64,linux/arm64 -t gimanhead/atlasgp-ce-webapp:$VERSION -t gimanhead/atlasgp-ce-webapp:latest . --load