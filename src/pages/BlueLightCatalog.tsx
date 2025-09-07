import { useEffect, useState } from "react";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import ProductCard from "./ProductHome";

export default function BlueLightCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchBlueLightProducts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_STRAPI_URL}/api/products?filters[category][$eq]=blue-light&populate=*`,
          {
            headers: {
              Authorization: `bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
            },
          }
        );

        const json = await res.json();
        console.log("Blue Light Products Response:", json);

        const mapped = json?.data?.map((p: any) => ({
          id: p.id,
          title: p.title || "Untitled",
          price: p.price || 0,
          frame: p.frame || "",
          sku: p.sku || "",
          image: p.image?.url
            ? `${import.meta.env.VITE_STRAPI_URL}${p.image.url}`
            : null,
        })) ?? [];

        setProducts(mapped);
      } catch (err) {
        console.error("Error fetching blue light products:", err);
      }
    };

    fetchBlueLightProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">💻 Blue Light Collection</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found in Blue Light Collection.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} addItem={addItem} />
          ))}
        </div>
      )}
    </div>
  );
}
