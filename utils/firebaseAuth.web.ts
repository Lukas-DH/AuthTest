import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export type { ConfirmationResult };

// Kept at module scope so it can be cleared before recreating.
// Creating a new verifier without clearing the old one causes stale DOM
// references and triggers auth/too-many-requests from Firebase.
let _verifier: RecaptchaVerifier | null = null;

export async function sendSmsCode(
  phoneNumber: string
): Promise<ConfirmationResult> {
  const auth = getAuth();

  // Destroy any previous verifier so Firebase doesn't hold a reference to
  // a detached DOM node (the container div that was removed when the screen
  // was unmounted or the user navigated back).
  if (_verifier) {
    _verifier.clear();
    _verifier = null;
  }

  _verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "invisible",
  });

  // Pre-render so the widget attaches to the DOM before we call
  // signInWithPhoneNumber — avoids the null-style crash from reCAPTCHA
  // trying to access the element before it's ready.
  await _verifier.render();

  return signInWithPhoneNumber(auth, phoneNumber, _verifier);
}

export async function verifySmsCode(
  confirmation: ConfirmationResult,
  code: string
): Promise<void> {
  await confirmation.confirm(code);
}
