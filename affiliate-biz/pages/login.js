import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../supabaseClient";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function LoginPage() {
  const router = useRouter();
  const { session } = useSessionContext();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const { redirect = "/", intent, itemId, target } = router.query;

  useEffect(() => {
    if (session) {
      if (intent && itemId) {
        localStorage.setItem(
          "postLoginIntent",
          JSON.stringify({ intent, itemId, target })
        );
      }
      router.replace(redirect);
    }
  }, [session, redirect, intent, itemId, target]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let result;
    if (isSignup) {
      result = await supabase.auth.signUp({ email, password });
    } else {
      result = await supabase.auth.signInWithPassword({ email, password });
    }
    setLoading(false);
    if (result.error) alert(result.error.message);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/login" },
    });
  };

  const handleForgotPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) alert("Error sending reset link.");
    else alert("Password reset link sent.");
  };

  return (
    <div className="container auth-container">
      <div className="card auth-card">
        <h1 className="title">{isSignup ? "Sign Up" : "Log In"}</h1>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>

          <div className="form-row">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isSignup}
                onChange={() => setIsSignup(!isSignup)}
                className="checkbox"
              />
              <span>Create account</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="link"
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" disabled={loading} className="button">
            {loading
              ? isSignup
                ? "Signing up…"
                : "Signing in…"
              : isSignup
              ? "Sign Up"
              : "Sign In"}
          </button>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="button secondary"
          >
            Continue with Google
          </button>
        </form>
      </div>
    </div>
  );
}
