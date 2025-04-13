# HELDEN Store Deployment Guide

This guide provides step-by-step instructions for deploying the HELDEN Store project to Firebase.

## Prerequisites

1. Firebase CLI installed: `npm install -g firebase-tools`
2. Firebase account and project created: `helden-ef55f`
3. Node.js version 16, 18, or 20 (recommended)

## Step 1: Authentication and Setup

```bash
# Login to Firebase
firebase login

# Verify you're logged in and can access the project
firebase projects:list
```

## Step 2: Deploy Static Version (Quick Start)

For a quick deployment that doesn't require database connections:

```bash
# Deploy static landing page
./deploy-static.sh
```

This will deploy a simple static landing page to:
https://helden-ef55f.web.app

## Step 3: Database Setup

### Option A: Supabase Setup (if you have Supabase credentials)

1. Ensure your `.env.local` file has valid Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

2. Run the Supabase setup script:
   ```bash
   node supabase-setup.js
   ```

### Option B: Local Mock Data (for development without Supabase)

Generate mock data files that can be used for development:

```bash
node supabase-dummy-setup.js
```

This creates sample data in the `data` directory.

## Step 4: Deploy Full Application

Once your database is set up, you can deploy the full application:

```bash
# Deploy full application with server-side rendering
./deploy-firebase.sh
```

## Step 5: Configure Additional Firebase Services (Optional)

### Authentication

1. Go to Firebase Console > Authentication > Get Started
2. Enable the sign-in methods you want (Email/Password, Google, etc.)

### Storage Rules

1. Edit `storage.rules` to configure access rules for files
2. Deploy storage rules: `firebase deploy --only storage`

### Firestore Rules

1. Edit `firestore.rules` to configure data access rules
2. Deploy Firestore rules: `firebase deploy --only firestore`

## Troubleshooting

### 500 Server Errors

If you see a 500 error after deployment:

1. Check Firebase Functions logs in the Firebase Console
2. Verify your service account has the correct permissions
3. Ensure environment variables are correctly set

### Database Connection Issues

If you're having issues connecting to Supabase:

1. Verify your IP is allowlisted in Supabase
2. Check that your Supabase project is active
3. Ensure your service role key has the necessary permissions

### Deployment Failures

If deployment fails:

1. Check if you have conflicts with existing functions:
   ```bash
   firebase functions:delete ssrheldenef55f --force
   ```

2. Try clearing the build cache:
   ```bash
   rm -rf .next .firebase
   ```

3. Check Firebase CLI version:
   ```bash
   firebase --version
   ```
   
   Update if needed:
   ```bash
   npm install -g firebase-tools@latest
   ```

## Maintenance

### Updating the Deployment

After making changes to your code:

1. Test locally: `npm run dev`
2. Build and deploy: `./deploy-firebase.sh`

### Monitoring

1. View analytics: Firebase Console > Analytics
2. Monitor performance: Firebase Console > Performance
3. Track errors: Firebase Console > Crashlytics

## Security Considerations

1. Never commit `.env.local` or `serviceAccountKey.json` to version control
2. Regularly update your Firebase CLI and dependencies
3. Review and update your security rules regularly 