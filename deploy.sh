#!/bin/bash
set -e

# Build the project
echo "Building Next.js project..."
npm run build

# Deploy to Firebase
echo "Deploying to Firebase..."
firebase deploy --only hosting

echo "Deployment complete! Your site is live at https://helden-ef55f.web.app" 