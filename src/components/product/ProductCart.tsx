"use client";
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTryOn, setActiveTryOn] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:1337/api/products?populate=*", {
      headers: { Authorization: "bearer YOUR_API_TOKEN" },
    })
      .then((res) => res.json())
      .then((json) => {
        const mapped: Product[] = json.data.map((p: any) => {
          const attrs = p.attributes || p; // ✅ fix for Strapi v4
          const imageUrl =
            attrs?.image?.data?.attributes?.url || attrs?.image?.url || null;
          const overlayUrl =
            attrs?.overlayImage?.data?.attributes?.url ||
            attrs?.overlayImage?.url ||
            null;

          return {
            id: String(p.id),
            title: attrs.title,
            price: attrs.price,
            frame: attrs.frame,
            sku: attrs.sku,
            image: imageUrl ? "http://localhost:1337" + imageUrl : null,
            overlayImage: overlayUrl
              ? "http://localhost:1337" + overlayUrl
              : null,
          };
        });
        setProducts(mapped);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="products-page grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((p) => (
        <div
          key={p.id}
          className="product-item border p-4 rounded-xl shadow-md bg-white"
        >
          <ProductCard product={p} />

          {p.overlayImage && (
            <>
              <button
                className="mt-3 px-4 py-2 rounded-lg bg-black text-white"
                onClick={() =>
                  setActiveTryOn(activeTryOn === p.id ? null : p.id)
                }
              >
                {activeTryOn === p.id ? "❌ Close Try-On" : "👓 Try On"}
              </button>

              {activeTryOn === p.id && (
                <TryOn productId={p.id} glassesUrl={p.overlayImage} />
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// ✅ TryOn component
function TryOn({ glassesUrl, productId }: { glassesUrl: string; productId: string }) {
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    const video = document.getElementById(
      `video-${productId}`
    ) as HTMLVideoElement;

    if (video) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            setCameraReady(true);
          };
        })
        .catch((err) => console.error("Camera error:", err));
    }

    // cleanup on unmount
    return () => {
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [productId]);

  return (
    <div className="relative w-full h-[300px] bg-black rounded-lg overflow-hidden mt-4">
      <video
        id={`video-${productId}`}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      {cameraReady && (
        <img
          src={glassesUrl}
          alt="glasses"
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-40 opacity-90 pointer-events-none"
        />
      )}
    </div>
  );
}
