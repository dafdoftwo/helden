#!/bin/bash

# Build the project
echo "Building the Next.js project..."
npm run build

# Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"

# Deploy to Firebase
echo "Deploying to Firebase project helden-ef55f..."
firebase deploy

echo "Deployment complete! Your app is available at https://helden-ef55f.web.app" 