#!/bin/bash
set -e # Exit on any error

echo "Building the Next.js project..."
NEXT_PUBLIC_SITE_URL="https://helden-ef55f.web.app" npm run build

echo "Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "Deployment complete! Your app is available at https://helden-ef55f.web.app" 