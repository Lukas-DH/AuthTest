import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/welcome"); // or "/tabs" if that's your tabs root
  }, []);
  return null;
}
