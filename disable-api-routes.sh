#!/bin/bash

# Create backup directory if it doesn't exist
mkdir -p api-routes-backup

# Move API routes to backup
echo "Backing up API routes..."
if [ -d "src/app/api" ]; then
  mv src/app/api api-routes-backup/
  echo "API routes backed up to api-routes-backup/"
else
  echo "No API routes directory found at src/app/api"
fi

# Let the user know what was done
echo "API routes have been temporarily disabled for static export."
echo "After building, run ./restore-api-routes.sh to restore them." 