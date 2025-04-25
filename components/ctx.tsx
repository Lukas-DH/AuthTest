import { useContext, createContext, type PropsWithChildren } from "react";
import { useStorageState } from "@/components/useStorageState";
import { Link, router } from "expo-router";

const AuthContext = createContext<{
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => Promise.resolve(),
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
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
  console.log("session" + " " + session);
  return (
    <AuthContext.Provider
      value={{
        signIn: async (identifier, password) => {
          try {
            // Replace with your Strapi URL
            const response = await fetch(
              `${process.env.EXPO_PUBLIC_API_URL}/api/auth/local`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  identifier, // This can be username or email
                  password,
                }),
              }
            );

            const data = await response.json();

            if (!response.ok) {
              const errorMessage =
                data?.error?.message ||
                data?.message ||
                "Authentication failed. Please try again.";
              throw new Error(errorMessage);
            }

            if (data.jwt) {
              // const { jwt, user } = data;
              // setSession(JSON.stringify(data));
              setSession(JSON.stringify(data));
              router.replace("/");
            } else {
              // Handle authentication error
              throw new Error(data.error?.message || "Authentication failed");
            }
          } catch (error) {
            console.error("Sign-in error:", error);
            throw error;
          }
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
