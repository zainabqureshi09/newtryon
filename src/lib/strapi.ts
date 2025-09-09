const API_URL = process.env.VITE_STRAPI_URL || "http://localhost:1337";

export async function fetchGlasses() {
  const res = await fetch(`${API_URL}/api/glasses?populate=glassesOverlay`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch glasses from Strapi");
  const data = await res.json();

  // Example: agar multiple glasses entries hain
  return data.data.map((item: any) => {
    const overlayUrl = item.attributes.glassesOverlay?.data?.attributes?.url;
    return {
      id: item.id,
      name: item.attributes.name,
      glassesOverlay: overlayUrl ? `${API_URL}${overlayUrl}` : null,
    };
  });
}
