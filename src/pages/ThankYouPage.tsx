import { Link } from "react-router-dom";

export default function ThankYouPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-3xl font-bold text-green-600 mb-4">🎉 Thank You!</h1>
      <p className="text-gray-700 mb-6">Your order has been placed successfully.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-pink-600 text-white rounded-lg shadow hover:bg-pink-500 transition"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
