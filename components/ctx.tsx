import { useContext, createContext, useRef, useState, type PropsWithChildren } from "react";
import { useStorageState } from "@/components/useStorageState";
import { router } from "expo-router";
import {
  sendSmsCode,
  verifySmsCode,
  type ConfirmationResult,
} from "@/utils/firebaseAuth";

const AuthContext = createContext<{
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => void;
  verifyPhone: (phoneNumber: string) => Promise<void>;
  confirmSms: (code: string) => Promise<void>;
  session?: string | null;
  isLoading: boolean;
  pendingPhone: string | null;
}>({
  signIn: () => Promise.resolve(),
  signOut: () => null,
  verifyPhone: () => Promise.resolve(),
  confirmSms: () => Promise.resolve(),
  session: null,
  isLoading: false,
  pendingPhone: null,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const pendingSession = useRef<string | null>(null);
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);

  console.log("session " + session);

  return (
    <AuthContext.Provider
      value={{
        // Step 1: Strapi email/password auth.
        // Extracts the registered phone number from the user profile and stores
        // it as pendingPhone — the user cannot supply their own number.
        signIn: async (identifier, password) => {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/api/auth/local`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ identifier, password }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              data?.error?.message ||
                data?.message ||
                "Authentication failed. Please try again."
            );
          }

          if (!data.jwt) {
            throw new Error(data.error?.message || "Authentication failed");
          }

          const phone: string | undefined = data.user?.phone;
          if (!phone) {
            throw new Error(
              "No phone number found on this account. Please contact support."
            );
          }

          pendingSession.current = JSON.stringify(data);
          setPendingPhone(phone);
          // Caller navigates to /verify-phone after this resolves.
        },

        // Step 2a: send SMS to the registered number.
        // Called from a button press — reCAPTCHA requires a user gesture on web.
        verifyPhone: async (phoneNumber) => {
          const confirmation = await sendSmsCode(phoneNumber);
          confirmationRef.current = confirmation;
        },

        // Step 2b: verify the code. Promotes pendingSession → session on success.
        confirmSms: async (code) => {
          if (!confirmationRef.current) {
            throw new Error(
              "No pending phone verification. Please request a new code."
            );
          }
          await verifySmsCode(confirmationRef.current, code);
          setSession(pendingSession.current);
          pendingSession.current = null;
          confirmationRef.current = null;
          setPendingPhone(null);
          router.replace("/");
        },

        signOut: () => {
          setSession(null);
        },

        session,
        isLoading,
        pendingPhone,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
