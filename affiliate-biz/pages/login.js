// pages/login.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "../supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const { session, isLoading } = useSessionContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Automatically redirect if already logged in
  useEffect(() => {
    if (!isLoading && session) {
      router.replace("/dashboard");
    }
  }, [session, isLoading, router]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) alert(error.message);
    else router.push("/dashboard");
  };

  const handleGoogleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard",
      },
    });
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h1>Log In</h1>

      {/* Google login */}
      <button
        onClick={handleGoogleLogin}
        style={{
          width: "100%",
          padding: ".75rem",
          background: "#4285F4",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          marginBottom: "1rem",
          cursor: "pointer",
        }}
      >
        Continue with Google
      </button>

      <hr style={{ margin: "2rem 0" }} />

      {/* Email/password login */}
      <form onSubmit={handleEmailLogin} style={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: ".5rem" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: ".5rem" }}
        />
        <button type="submit" disabled={loading} style={{ padding: ".75rem", cursor: "pointer" }}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
