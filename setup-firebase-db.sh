#!/bin/bash
set -e # Exit on any error

# Set the GOOGLE_APPLICATION_CREDENTIALS environment variable
export GOOGLE_APPLICATION_CREDENTIALS="./serviceAccountKey.json"

echo "Deploying Firestore rules..."
firebase deploy --only firestore

echo "Setting up Firestore database with sample data..."
node src/lib/firestore-setup.js

echo "Deploying the application with Firestore integration..."
./deploy-firebase.sh

echo "Setup complete! Your HELDEN store is now running with Firebase Firestore database."
echo "Your app is available at https://helden-ef55f.web.app" 