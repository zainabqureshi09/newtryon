
import { ShoppingCart, CreditCard, Camera } from "lucide-react";
import { motion } from "framer-motion";
import useCart, { Product } from "../../hooks/use-cart";
import { useNavigate } from "react-router-dom";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCart((state) => state.addItem); 
  const navigate = useNavigate();

  const handleBuyNow = () => {
    addItem(product);
    navigate("/checkout");
  };

  // ✅ Try On updated: product.id ke sath navigate hoga
  const handleTryOn = () => {
    navigate(`/try-on/${product.id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className="bg-white rounded-2xl shadow-md flex flex-col transition-all duration-300 hover:shadow-xl overflow-hidden"
    >
      {/* Product Image */}
      <div className="w-full aspect-square flex items-center justify-center bg-gray-50">
        {product.image ? (
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <div className="text-gray-400 text-sm">No Image</div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between p-4 text-center">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 line-clamp-2">
            {product.title}
          </h2>
          <p className="text-pink-600 font-medium text-base md:text-lg mt-1">
            ${product.price}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 mt-4 justify-center">
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-xl shadow-md hover:bg-pink-500 transition text-sm md:text-base w-full sm:w-auto sm:min-w-[140px]"
            onClick={() => addItem(product)}
          >
            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
            Add to Cart
          </button>

          <button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-xl shadow-md hover:bg-sky-400 transition text-sm md:text-base w-full sm:w-auto sm:min-w-[140px]"
            onClick={handleBuyNow}
          >
            <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
            Buy Now
          </button>

          {/* ✅ Try On Button updated */}
          <button
            className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl shadow-md hover:bg-purple-500 transition text-sm md:text-base w-full sm:w-auto sm:min-w-[140px]"
            onClick={handleTryOn}
          >
            <Camera className="w-4 h-4 md:w-5 md:h-5" />
            Try On
          </button>
        </div>
      </div>
    </motion.div>
  );
}
