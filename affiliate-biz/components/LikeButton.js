// components/LikeButton.js
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { supabase } from "../supabaseClient";

export default function LikeButton({ itemId }) {
  const { session } = useSessionContext();
  const router = useRouter();

  const handleLike = async () => {
    if (!session) {
      const currentPath = router.asPath;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}&intent=like&itemId=${itemId}`);
      return;
    }

    const { error } = await supabase.from("likes").insert([{ item_id: itemId }]);
    if (error) console.error(error);
    else alert("Liked!");
  };

  return <button onClick={handleLike}>♥ Like</button>;
}
