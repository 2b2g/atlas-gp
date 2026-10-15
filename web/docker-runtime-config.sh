#!/bin/sh
# Generates runtime config for the SPA from environment variables.
# Runs automatically at container start (nginx docker-entrypoint.d).
set -e

if [ -n "${ATLAS_GP_API_URL:-}" ]; then
  echo "window.__ATLAS_GP_CONFIG__ = { apiUrl: \"${ATLAS_GP_API_URL}\" };" > /usr/share/nginx/html/config.js
  echo "ATLAS GP runtime config: apiUrl=${ATLAS_GP_API_URL}"
fi
