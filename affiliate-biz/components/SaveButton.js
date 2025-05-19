// components/SaveButton.js
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { supabase } from "../supabaseClient";

export default function SaveButton({ itemId }) {
  const { session } = useSessionContext();
  const router = useRouter();

  const handleSave = async () => {
    if (!session) {
      const currentPath = router.asPath;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}&intent=save&itemId=${itemId}`);
      return;
    }

    const { error } = await supabase.from("saves").insert([{ product_id: itemId }]);
    if (error) console.error(error);
    else alert("Saved!");
  };

  return <button onClick={handleSave}>💾 Save</button>;
}
