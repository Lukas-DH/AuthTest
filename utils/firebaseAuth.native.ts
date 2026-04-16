import auth from "@react-native-firebase/auth";

export type ConfirmationResult = Awaited<
  ReturnType<ReturnType<typeof auth>["signInWithPhoneNumber"]>
>;

export async function sendSmsCode(
  phoneNumber: string
): Promise<ConfirmationResult> {
  return auth().signInWithPhoneNumber(phoneNumber);
}

export async function verifySmsCode(
  confirmation: ConfirmationResult,
  code: string
): Promise<void> {
  try {
    await confirmation.confirm(code);
  } catch (error: any) {
    // On Android, auto-retrieval may have already consumed the session.
    // If Firebase already signed the user in automatically, treat it as success.
    if (error?.code === "auth/session-expired" && auth().currentUser) {
      return;
    }
    throw error;
  }
}

export async function deleteFirebaseAccount(): Promise<void> {
  const user = auth().currentUser;
  if (user) await user.delete();
}
