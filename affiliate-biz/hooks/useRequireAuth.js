// hooks/useRequireAuth.js
import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function useRequireAuth() {
  const { session } = useSessionContext();
  const router = useRouter();

  return () => {
    if (!session?.user) {
      router.push("/login");
      return false;
    }
    return true;
  };
}
