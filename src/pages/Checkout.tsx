import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCart from "../hooks/use-cart";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    paymentMethod: "cod",
  });

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const shipping = subtotal > 200 ? 0 : 10; // free shipping if > 200
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    // Normally API call hota (backend integration)
    console.log("✅ Order Placed:", { items, formData, total });

    clearCart();
    navigate("/thank-you"); // thank you page after order
  };

  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      {/* Shipping Form */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>

        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="font-medium">Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            >
              <option value="cod">Cash on Delivery</option>
              <option value="card">Credit/Debit Card</option>
            </select>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between py-2">
              <span>{item.title}</span>
              <span>${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 text-gray-700">
          <p className="flex justify-between">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span>Shipping:</span>
            <span>{shipping === 0 ? "Free" : `$${shipping}`}</span>
          </p>
          <p className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </p>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full bg-pink-600 text-white py-3 rounded-xl font-semibold hover:bg-pink-500 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
