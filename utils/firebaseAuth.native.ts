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
  await confirmation.confirm(code);
}
