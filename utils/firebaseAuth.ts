// This file is the TypeScript fallback used by the compiler for type checking.
// At runtime, Metro resolves firebaseAuth.native.ts (iOS/Android) or
// firebaseAuth.web.ts (web) automatically — this file is never executed.
export { sendSmsCode, verifySmsCode, deleteFirebaseAccount, type ConfirmationResult } from "./firebaseAuth.web";
