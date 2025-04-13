#!/bin/bash
set -e # Exit on any error

# Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"

echo "Creating firebase.json for static hosting..."
cat > firebase.json << EOL
{
  "hosting": {
    "target": "app",
    "public": "public",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
EOL

echo "Deploying static page to Firebase Hosting..."
firebase deploy --only hosting:app

echo "Deployment complete! Your app is available at https://helden-ef55f.web.app" 