// Cart.tsx
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/use-cart";
import { X } from "lucide-react";

export default function Cart() {
  const { items, removeItem, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">🛒 Your Cart</h2>

      {items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 object-contain"
                />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-pink-600">
                    ${item.price} × {item.quantity}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          {/* Summary */}
          <div className="bg-white p-6 rounded-lg shadow mt-6">
            <p className="text-lg font-semibold">
              Total: <span className="text-pink-600">${totalPrice.toFixed(2)}</span>
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={clearCart}
                className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
              >
                Clear
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-500"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
