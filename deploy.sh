#!/bin/bash
set -e # Exit on any error

# Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"

# Build the project
echo "Building the Next.js project..."
NEXT_PUBLIC_SITE_URL="https://helden-ef55f.web.app" npm run build

# Deploy Firebase components separately for better error handling
echo "Deploying Firebase components..."

# First deploy Firestore rules and indexes
echo "Deploying Firestore..."
firebase deploy --only firestore --non-interactive || echo "Firestore deployment skipped. Will continue with other components."

# Then deploy storage rules
echo "Deploying Storage..."
firebase deploy --only storage --non-interactive || echo "Storage deployment skipped. Will continue with other components."

# Deploy hosting
echo "Deploying Hosting..."
firebase deploy --only hosting --non-interactive

# Deploy functions last since they had linting errors
echo "Deploying Functions..."
firebase deploy --only functions --non-interactive || echo "Functions deployment failed. Please check your functions code."

echo "Deployment complete! Your app is available at https://helden-ef55f.web.app"
echo "If any component failed to deploy, check the logs above and fix the specific issues." 