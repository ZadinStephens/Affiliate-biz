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

  if (isLoading)
    return (
      <p className="container" style={{ textAlign: "center", marginTop: "80px" }}>
        Loading...
      </p>
    );

  if (!session) return null;

  return (
    <div className="container">
      <h1 className="title">Add a Product</h1>

      <AmazonRedirectSearch />

      <div className="card" style={{ marginTop: "20px" }}>
        <h2 className="subtitle">Or paste an Amazon link</h2>
        <input
          type="url"
          placeholder="https://www.amazon.com/…&tag=yourtag-20"
          className="input"
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
        <p className="small">Press Enter to save this link.</p>
      </div>
    </div>
  );
}
