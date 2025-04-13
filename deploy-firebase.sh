#!/bin/bash
set -e # Exit on any error

# Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"

# First, delete any existing cloud functions to fix name conflict issues
echo "Deleting existing Cloud Functions (if any)..."
firebase functions:delete ssrheldenef55f --force --token "$FIREBASE_TOKEN" || echo "No functions to delete"

# Clean build directories
echo "Cleaning build directories..."
rm -rf .next .firebase

# Build the Next.js app with proper environment variables
echo "Building the Next.js project..."
NEXT_PUBLIC_SITE_URL="https://helden-ef55f.web.app" npm run build

# Deploy to Firebase Hosting with the Frameworks adapter
echo "Deploying to Firebase Hosting with Next.js adapter..."
firebase deploy --only hosting:app

echo "Deployment complete! Your app is available at https://helden-ef55f.web.app" 