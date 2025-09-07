'use client';
import { useEffect, useState } from "react";
import { Product } from "@/types";
import { ProductCard } from "./ProductCard";
import TryOn from "@/pages/TryOn"; // 👈 naya component import

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedGlasses, setSelectedGlasses] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:1337/api/products?populate=*",
      {
        headers: {
          Authorization: "bearer YOUR_API_TOKEN"
        }
      }
    )
      .then(res => res.json())
      .then(json => {
        const mapped = json.data.map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          frame: p.frame,
          sku: p.sku,
          image: p.image?.url ? "http://localhost:1337" + p.image.url : null,
          overlayImage: p.overlayImage?.url
            ? "http://localhost:1337" + p.overlayImage.url
            : null // 👈 overlay PNG add kiya
        }));
        setProducts(mapped);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  return (
    <div className="products-page">
      <div className="products-grid">
        {products.map((p) => (
          <div key={p.id} className="product-item">
            <ProductCard product={p} addItem={() =>  {}} />

            {/* Agar product ke paas overlay image hai */}
            {p.overlayImage && (
              <button
                className="tryon-btn"
                onClick={() => setSelectedGlasses(p.overlayImage!)}
              >
                👓 Try On
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Try-On Modal / Section */}
      {selectedGlasses && (
        <div className="tryon-modal">
          <button className="close-btn" onClick={() => setSelectedGlasses(null)}>
            ❌ Close
          </button>
          <TryOn glassesUrl={selectedGlasses} />
        </div>
      )}
    </div>
  );
}
