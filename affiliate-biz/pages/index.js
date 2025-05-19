// pages/index.js
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../supabaseClient";
import LikeButton from "../components/LikeButton";
import SaveButton from "../components/SaveButton";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          title,
          product_image,
          video_id
        `)
        .order("created_at", { ascending: false });

      if (error) console.error("Error loading products:", error);
      else setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="container">
      <h1 className="title">🌟 Shop Influencer Picks</h1>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <Link href={`/product/${product.id}`}>
              <img
                src={product.product_image}
                alt={product.title}
                className="product-image"
              />
            </Link>
            <div className="product-info">
              <p className="product-title">{product.title}</p>
              <div className="product-actions">
                <LikeButton itemId={product.id} />
                <SaveButton itemId={product.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
