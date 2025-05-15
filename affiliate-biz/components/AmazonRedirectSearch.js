// components/AmazonRedirectSearch.js
import { useState } from "react";

export default function AmazonRedirectSearch() {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;
    const tag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG;
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${tag}`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex max-w-xl mx-auto mb-8">
      <input
        type="text"
        className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Amazon for a product…"
      />
      <button
        onClick={handleSearch}
        className="px-6 bg-orange-600 text-white font-semibold rounded-r-md hover:bg-orange-700 transition"
      >
        Go
      </button>
    </div>
  );
}
