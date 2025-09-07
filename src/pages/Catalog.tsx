import { Link } from "react-router-dom";

export default function Catalog() {
  const categories = [
    { name: "Men", path: "/catalog/men" },
    { name: "Women", path: "/catalog/women" },
    { name: "Kids", path: "/catalog/kids" },
    { name: "Blue Light", path: "/catalog/blue-light" },
    { name: "Sunglasses", path: "/catalog/sunglasses" },
    { name: "Men & Women", path: "/catalog/both" },
  ];

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">
        🛍 Explore Our Collections
      </h1>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to={cat.path}>
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">
              {cat.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
