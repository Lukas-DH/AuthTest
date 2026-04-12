# Predict-F Frontend (AuthTest)

Fertility risk assessment mobile/web application built with React Native and Expo.

## Quick Start

### Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm start
   # or
   npx expo start
   ```

3. **Run on specific platform**
   ```bash
   npm run web          # Open in browser
   npm run ios          # Open iOS simulator
   npm run android      # Open Android emulator
   ```

## Deployment

### Current Live Deployment
**Web App:** https://predictf--hgx92ou4nq.expo.app/

### Deploy Web App

**Method 1: Export and Deploy to EAS (What you've been using):**
```bash
# Export web build
npx expo export --platform web

# Deploy to EAS
eas deploy
```

**Method 2: EAS Update (Over-the-air updates):**
```bash
# First time setup (if needed)
npm install -g eas-cli
eas login

# Deploy update
eas update --branch production --message "Your update message"
```

**Method 3: Full EAS Build:**
```bash
eas build --platform web
```

### Mobile App Deployment (Not Yet Configured)

**iOS:**
```bash
eas build --platform ios
eas submit --platform ios
```

**Android:**
```bash
eas build --platform android
eas submit --platform android
```

## Environment Setup

Make sure your `.env` file contains:
```
EXPO_PUBLIC_API_URL=https://calm-books-c61b70e3b2.strapiapp.com
```

## Project Structure

- `/app` - File-based routing (Expo Router)
- `/components` - Reusable UI components
- `/assets` - Images, fonts, icons
- `/constants` - App constants and theme

## Tech Stack

- **Framework:** Expo SDK 53 + React Native 0.79
- **Language:** TypeScript
- **Routing:** Expo Router (file-based)
- **Backend:** Strapi CMS
- **Auth:** JWT via SecureStore

## Common Commands

```bash
npm start              # Start dev server
npm run web            # Open in browser
npm run ios            # iOS simulator
npm run android        # Android emulator
npm test               # Run tests
npm run lint           # Lint code
```

## Troubleshooting

- **Clear cache:** `npx expo start -c`
- **Reset project:** `rm -rf node_modules package-lock.json && npm install`
- **Check Expo status:** https://status.expo.dev/
