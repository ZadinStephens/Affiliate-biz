// pages/product/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import LikeButton from "../../components/LikeButton";
import SaveButton from "../../components/SaveButton";
import VideoEmbed from "../../components/VideoEmbed";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { session } = useSessionContext();

  const [product, setProduct] = useState(null);
  const [videoProducts, setVideoProducts] = useState([]);

  // Fetch product and related products
  useEffect(() => {
    if (!id) return;

    const fetchProductAndGroup = async () => {
      const { data: currentProduct, error: prodError } = await supabase
        .from("products")
        .select(`
            *,
            videos:video_id (
                embed_url
            )
          `)
        .eq("id", id)
        .single();

      if (prodError || !currentProduct) return;

      setProduct(currentProduct);

      const { data: related, error: relError } = await supabase
        .from("products")
        .select("*")
        .eq("video_id", currentProduct.video_id);

      if (!relError) setVideoProducts(related);
    };

    fetchProductAndGroup();
  }, [id]);

  // Post-login intent execution
  useEffect(() => {
    const executePostLoginIntent = async () => {
      const stored = localStorage.getItem("postLoginIntent");
      if (!stored || !session) return;

      const { intent, itemId, target } = JSON.parse(stored);
      if (!itemId) return;

      try {
        if (intent === "like") {
          await supabase.from("likes").insert([{ item_id: itemId }]);
        }

        if (intent === "save") {
          await supabase.from("saves").insert([{ product_id: itemId }]);
        }

        if (intent === "visit" && target) {
          window.open(target, "_blank");
        }
      } catch (e) {
        console.error("Post-login action failed:", e);
      } finally {
        localStorage.removeItem("postLoginIntent");
      }
    };

    executePostLoginIntent();
  }, [session]);

  if (!product) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">{product.title}</h1>
      <VideoEmbed url={product.videos?.embed_url || product.video_url || ""} />

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {videoProducts.map((p) => (
          <div key={p.id} className="bg-white rounded-xl shadow p-4">
            <img
              src={p.product_image}
              alt={p.title}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h2 className="text-lg font-semibold text-gray-700 mb-1">{p.title}</h2>
            <p className="text-sm text-gray-500 mb-2">{p.description}</p>
            <div className="flex gap-3 mb-3">
              <LikeButton itemId={p.id} />
              <SaveButton itemId={p.id} />
            </div>
            <a
              href={p.affiliate_url}
              onClick={(e) => {
                e.preventDefault();
                if (!session) {
                  router.push(
                    `/login?redirect=/product/${p.id}&intent=visit&itemId=${p.id}&target=${encodeURIComponent(
                      p.affiliate_url
                    )}`
                  );
                } else {
                  window.open(p.affiliate_url, "_blank");
                }
              }}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Shop Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
