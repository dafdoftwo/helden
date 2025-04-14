#!/bin/bash

# Restore API routes from backup
echo "Restoring API routes..."
if [ -d "api-routes-backup/api" ]; then
  mkdir -p src/app
  mv api-routes-backup/api src/app/
  echo "API routes restored to src/app/api/"
else
  echo "No API routes backup found at api-routes-backup/api"
fi

# Clean up backup directory if empty
if [ -z "$(ls -A api-routes-backup)" ]; then
  rmdir api-routes-backup
  echo "Cleaned up empty backup directory"
fi

echo "API routes have been restored." 