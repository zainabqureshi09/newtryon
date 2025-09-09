"use client";

import { useEffect, useState } from "react";
import { Product } from "@/types";
import useCart from "@/hooks/use-cart";
import { ProductCard } from "@/components/product/ProductCard";
import VirtualTryOnModal from "../pages/TryOn";

export default function ProductHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  const { addItem } = useCart();

  // ✅ Try-On states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showTryOn, setShowTryOn] = useState(false);

  const categories = [
    { label: "Men", value: "men" },
    { label: "Women", value: "women" },
    { label: "Kids", value: "kids" },
    { label: "Sunglasses", value: "sunglasses" },
    { label: "Blue Light", value: "blue-light" },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // ✅ category filter
        const categoryFilter =
          selectedCategory !== "all"
            ? `&filters[category][$eq]=${selectedCategory}`
            : "";

        const res = await fetch(
          `${import.meta.env.VITE_STRAPI_URL}/api/products?populate=*${categoryFilter}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
            },
          }
        );

        const json = await res.json();
        if (!json.data) {
          setProducts([]);
          return;
        }

        const mapped = json.data.map((p: any) => {
          const attributes = p.attributes || p;

          const imageUrl =
            attributes?.image?.data?.attributes?.url ||
            attributes?.image?.url ||
            null;

          const overlayUrl =
            attributes?.glassesOverlay?.data?.attributes?.url ||
            attributes?.glassesOverlay?.url ||
            null;

          return {
            id: p.id,
            title: attributes.title || "Untitled",
            price: attributes.price || 0,
            frame: attributes.frame || "",
            sku: attributes.sku || "",
            image: imageUrl
              ? `${import.meta.env.VITE_STRAPI_URL}${imageUrl}`
              : null,
            overlay: overlayUrl
              ? `${import.meta.env.VITE_STRAPI_URL}${overlayUrl}`
              : null, // 👓 overlay for try-on
          };
        });

        setProducts(mapped);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* 🔹 Filter Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
              selectedCategory === cat.value
                ? "bg-pink-600 text-white border-pink-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 🔹 Product Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              addItem={addItem}
              onTryOn={() => {
                setSelectedProduct(p);
                setShowTryOn(true);
              }}
            />
          ))}
        </div>
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No products found.
        </p>
      )}

      {/* ✅ Try-On Modal */}
      {showTryOn && selectedProduct && (
        <VirtualTryOnModal
          product={selectedProduct}
          onClose={() => setShowTryOn(false)}
        />
      )}
    </div>
  );
}
