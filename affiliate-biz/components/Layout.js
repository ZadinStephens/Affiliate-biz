// components/Layout.js
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-blue-600">
            🛍️ ShopStream
          </Link>
          <nav className="space-x-4">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <Link href="/dashboard" className="hover:text-blue-600">
              Dashboard
            </Link>
            <Link href="/login" className="hover:text-blue-600">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-4 py-8">{children}</main>

      <footer className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-4 text-sm text-gray-500">
          © {new Date().getFullYear()} ShopStream. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
