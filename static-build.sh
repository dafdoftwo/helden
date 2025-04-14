#!/bin/bash
set -e # Exit on any error

# 1. Make scripts executable
chmod +x disable-api-routes.sh restore-api-routes.sh

# 2. Disable API routes temporarily
./disable-api-routes.sh

# 3. Build the Next.js app with static export
echo "Building Next.js app with static export..."
NEXT_PUBLIC_SITE_URL="https://helden-ef55f.web.app" npm run build

# 4. Restore API routes
./restore-api-routes.sh

# 5. Deploy to Firebase Hosting
echo "Deploying to Firebase Hosting..."
firebase deploy --only hosting

echo "Static build and deployment complete! Your app is available at https://helden-ef55f.web.app" 