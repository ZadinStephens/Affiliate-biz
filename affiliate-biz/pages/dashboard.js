// pages/dashboard.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";
import AmazonRedirectSearch from "../components/AmazonRedirectSearch";

export default function Dashboard() {
  const { session, isLoading } = useSessionContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/login");
    }
  }, [session, isLoading, router]);

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;

  if (!session) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Add a Product</h1>

      <AmazonRedirectSearch />

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Or paste an Amazon link</h2>
        <input
          type="url"
          placeholder="https://www.amazon.com/…&tag=yourtag-20"
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
          onKeyDown={async (e) => {
            if (e.key !== "Enter") return;
            const url = e.currentTarget.value.trim();
            if (!url) return;

            await fetch("/api/products", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                video_id: null,
                title: "",
                product_image: "",
                affiliate_url: url,
              }),
            });

            router.push("/");
          }}
        />
        <p className="text-sm text-gray-500 mt-1">Press Enter to save this link.</p>
      </div>
    </div>
  );
}
