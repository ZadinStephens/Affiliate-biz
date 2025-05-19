// components/Layout.js
import Link from "next/link";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "../supabaseClient";

export default function Layout({ children }) {
  const { session } = useSessionContext();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-indigo-600">
            ShopStream
          </Link>
          <nav className="space-x-4 text-sm font-medium">
            <Link href="/dashboard" className="hover:text-indigo-600">
              Dashboard
            </Link>
            {!session ? (
              <Link
                href="/login"
                className="bg-indigo-500 text-white px-4 py-2 rounded-xl hover:bg-indigo-600"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-6 py-10">
        {children}
      </main>

      <footer className="bg-white border-t mt-10">
        <div className="max-w-6xl mx-auto px-6 py-4 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} ShopStream. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
