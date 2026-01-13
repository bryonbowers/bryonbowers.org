# Firebase Setup Instructions for Bryon Bowers Music Website

## Project Configuration
Your Firebase project ID: **bryonbowersorg**

## Step 1: Update Firebase Configuration

Update the file `src/firebase/config.ts` with your project's configuration:

1. Go to your Firebase Console: https://console.firebase.google.com/project/bryonbowersorg
2. Click on "Project Settings" (gear icon)
3. Scroll down to "Your apps" and click "Add app" -> Web
4. Register app with name "Bryon Bowers Music Website"
5. Copy the config object and replace the content in `src/firebase/config.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "bryonbowersorg.firebaseapp.com",
  projectId: "bryonbowersorg",
  storageBucket: "bryonbowersorg.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

## Step 2: Enable Firebase Services

In your Firebase Console, enable these services:

### Authentication
1. Go to Authentication -> Sign-in method
2. Enable "Email/Password" provider
3. Create user account for admin:
   - Email: bryon.bowers@gmail.com
   - Password: (choose a secure password)

### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Start in production mode
4. Choose your preferred location

### Storage
1. Go to Storage
2. Click "Get started"
3. Start in production mode
4. Choose same location as Firestore

### Hosting
1. Go to Hosting
2. Click "Get started"
3. Follow the setup instructions

## Step 3: Manual Installation (if npm install fails)

If npm install continues to fail, you can manually create the node_modules or use yarn:

```bash
# Try yarn instead
npm install -g yarn
yarn install

# Or use npm with different settings
npm install --registry https://registry.npmjs.org/
```

## Step 4: Deploy Firebase Rules

After successful installation, deploy the security rules:

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes  
firebase deploy --only storage
```

## Step 5: Build and Deploy

```bash
npm run build
firebase deploy --only hosting
```

## Step 6: Add Sample Content

Once deployed, login as admin (bryon.bowers@gmail.com) and add:
- Sample songs with audio files
- Poetry content
- Test the contact form

## Troubleshooting

If you encounter network issues during npm install:
1. Check your internet connection
2. Try using a different DNS (like 8.8.8.8)
3. Clear npm cache: `npm cache clean --force`
4. Try yarn instead of npm
5. Use npm with --network-timeout flag: `npm install --network-timeout 600000`

## Security Notes

- Only bryon.bowers@gmail.com has admin access
- All user data is protected by Firebase security rules
- Contact messages go directly to the admin email
- Audio files and images are publicly readable but only admin can upload

## Next Steps After Deployment

1. Upload music files to Firebase Storage
2. Add song metadata through admin interface
3. Create accompanying poems
4. Test contact form functionality
5. Share the website URL with your audience!

Your website will be available at: https://bryonbowersorg.web.app