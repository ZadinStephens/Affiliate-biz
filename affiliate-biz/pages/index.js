// pages/index.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import ProductCard from "../components/ProductCard";
import VideoEmbed from "../components/VideoEmbed";
import LikeButton from "../components/LikeButton";
import SaveButton from "../components/SaveButton";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          title,
          description,
          product_image,
          affiliate_url,
          video_id,
          videos (
            embed_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading products:", error.message);
      } else {
        setProducts(data);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="grid gap-10 max-w-4xl mx-auto px-4 py-8">
      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products posted yet.</p>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-lg shadow p-4 flex flex-col gap-4"
          >
            {product.videos?.embed_url && (
              <VideoEmbed url={product.videos.embed_url} />
            )}

            <ProductCard product={product} />

            <div className="flex gap-4 mt-2">
              <LikeButton itemId={product.id} />
              <SaveButton itemId={product.id} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
