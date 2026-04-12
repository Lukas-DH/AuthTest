# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start               # Start Expo dev server
npm run ios             # Run on iOS simulator
npm run android         # Run on Android emulator
npm run web             # Run in browser
npm test                # Run Jest tests (jest-expo preset)
npm run lint            # Run Expo lint

# Builds & deployment
npx expo export --platform web   # Export web build
eas deploy                        # Deploy to EAS hosting
eas update --branch production --message "..."  # OTA update
eas build --platform ios|android|web
```

## Architecture Overview

**Predict-F** is a fertility risk self-assessment app (mobile + web) built on Expo SDK 54 / React Native 0.81.5 with Expo Router v6 (file-based routing, typed routes enabled). The backend is a Strapi CMS instance at `EXPO_PUBLIC_API_URL`.

### Routing (Expo Router)

```
app/
  _layout.tsx         # Root — wraps everything in SessionProvider
  hero.tsx            # Public landing page
  sign-in.tsx         # Public login
  register.tsx        # Public registration (local only, not yet Strapi-integrated)
  (app)/
    _layout.tsx       # Auth guard: redirects to /sign-in if no session
    posts/[documentId]/  # Blog post detail + WebView PDF viewer
  (tabs)/
    _layout.tsx       # 4-tab bottom navigator (requires auth)
    welcome.tsx       # Onboarding/consent
    quiz.tsx          # Main questionnaire
    results.tsx       # Risk results + personalized advice
    blog.tsx          # Blog list
```

### Auth & State

- `components/ctx.tsx` — `SessionProvider` provides `session`, `signIn()`, `signOut()`, `isLoading`.
- `useStorageState(key)` — platform abstraction: `expo-secure-store` on native, `localStorage` on web.
- Auth is JWT-based via Strapi (`POST /api/auth/local`). The full `{ jwt, user }` response is stored as JSON.
- Registration is currently **local-only** (SecureStore) and not wired to Strapi.

### Quiz System

- **Question definitions:** `data/quizData.tsx`
- **Scoring algorithm:** `utils/quizScoring.tsx` — points-based, checks field combinations (age, BMI, surgical history, etc.)
- **Advice generation:** `utils/quizAdvice.tsx` — maps score factors to blog post titles
- **Question rendering:** `components/QuestionRenderer.tsx` dispatches to type-specific components in `components/questions/`
- Supports dual gender paths (`answerMale` / `answerFemale`) stored separately in Strapi `xresponses` collection
- Quiz responses are synced to Strapi on completion; the app fetches the latest response on tab focus (pause/resume)

### API Layer

Base URL from `process.env.EXPO_PUBLIC_API_URL` (set in `.env`).

Key endpoints:
- `POST /api/auth/local` — login
- `GET /api/xresponses?filters[users_permissions_user][id][$eq]=${userId}` — user quiz state
- `GET /api/posts?populate=image` — blog posts

### Key Patterns

- Path alias `@/` maps to the repo root — use for all internal imports.
- Platform-specific styling via `Platform.select()` throughout the codebase.
- New Architecture (`newArchEnabled: true`) is enabled in app.json.
- Firebase (`google-services.json`) is present but not yet integrated in code.
- EAS project ID: `98227d43-aef7-4158-8757-7359a76098a8`
