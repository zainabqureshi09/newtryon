import { useEffect, useState } from "react";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

interface CatalogProps {
  category: string;
  title: string;
  description: string;
}

export default function MenCatalog({ category, title, description}: CatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${import.meta.env.VITE_STRAPI_URL}/api/products?filters[category][$eq]=${category}&populate=*`,
          {
            headers: {
              Authorization: `bearer ${import.meta.env.VITE_STRAPI_API_TOKEN}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch ${category} products`);
        }

        const json = await res.json();
        console.log(`${category} Products Response:`, json);

        const mapped: Product[] =
          json?.data?.map((p: any) => {
            const attr = p.attributes || p;

            let imageUrl: string | null = null;
            if (attr.image?.data) {
              imageUrl = attr.image.data.attributes?.url;
            } else if (attr.images?.data?.length > 0) {
              imageUrl = attr.images.data[0].attributes?.url;
            } else if (attr.image?.url) {
              imageUrl = attr.image.url;
            }

            return {
              id: String(p.id),
              title: attr.title || "Untitled",
              price: attr.price || 0,
              frame: attr.frame || "",
              sku: attr.sku || "",
              image: imageUrl
                ? `${import.meta.env.VITE_STRAPI_URL}${imageUrl}`
                : null,
            };
          }) ?? [];

        setProducts(mapped);
      } catch (err: any) {
        console.error(`Error fetching ${category} products:`, err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-10 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          {title}
        </h2>
        <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Loading / Error / Products */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading products...</p>
      ) : error ? (
        <p className="text-center text-red-500 text-lg">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">
          No products found in {title}.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {products.map((p:any) => (
            <ProductCard key={p.id} product={p} addItem={addItem} />
          ))}
        </div>
      )}
    </section>
  );
}
