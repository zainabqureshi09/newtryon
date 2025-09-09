import { useEffect, useState } from "react";
import useCart from "@/hooks/use-cart";
import { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

export default function BlueLightCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTryOn, setActiveTryOn] = useState<string | null>(null); // ✅ for try-on
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

        const mapped: Product[] =
          json?.data?.map((p: any) => {
            const attr = p.attributes || p;

            // ✅ Safe image handling
            let imageUrl: string | null = null;
            if (attr.image?.data) {
              imageUrl = attr.image.data.attributes?.url;
            } else if (attr.images?.data?.length > 0) {
              imageUrl = attr.images.data[0].attributes?.url;
            } else if (attr.image?.url) {
              imageUrl = attr.image.url;
            }

            let overlayUrl: string | null = null;
            if (attr.overlayImage?.data) {
              overlayUrl = attr.overlayImage.data.attributes?.url;
            } else if (attr.overlayImage?.url) {
              overlayUrl = attr.overlayImage.url;
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
              overlayImage: overlayUrl
                ? `${import.meta.env.VITE_STRAPI_URL}${overlayUrl}`
                : null,
            };
          }) ?? [];

        setProducts(mapped);
      } catch (err) {
        console.error("Error fetching blue light products:", err);
      }
    };

    fetchBlueLightProducts();
  }, []);

  return (
    <section className="px-4 sm:px-6 lg:px-12 py-10 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          💻 Blue Light Collection
        </h2>
        <p className="mt-3 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          Reduce eye strain and protect your vision with our Blue Light
          Glasses Collection — stylish & effective.
        </p>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">
          No products found in Blue Light Collection.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {products.map((p) => (
            <div
              key={p.id}
              className="product-item border p-4 rounded-xl shadow-md bg-white"
            >
              <ProductCard product={p} addItem={addItem} />

              {p.overlayImage && (
                <>
                  <button
                    className="mt-3 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500 transition"
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
      )}
    </section>
  );
}

// ✅ TryOn component
function TryOn({
  glassesUrl,
  productId,
}: {
  glassesUrl: string;
  productId: string;
}) {
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

    // ✅ Cleanup
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
