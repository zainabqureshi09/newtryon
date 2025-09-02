import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";

export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    paymentMethod: "cod", // default: Cash on Delivery
  });

  const [orderPlaced, setOrderPlaced] = useState(false);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle checkout
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.address) {
      alert("Please fill all required fields.");
      return;
    }

    // Simulate order placement
    console.log("Order placed:", {
      customer: formData,
      items,
      total,
    });

    clearCart();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">🎉 Thank you for your order!</h1>
        <p className="text-muted-foreground">We’ll send a confirmation email shortly.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
      {/* Cart Summary */}
      <div className="md:col-span-1 bg-muted/20 p-6 rounded-xl border">
        <h2 className="text-lg font-semibold mb-4">Your Order</h2>
        {items.length === 0 ? (
          <p className="text-muted-foreground">Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span className="font-semibold">${item.price * item.quantity}</span>
              </li>
            ))}
            <li className="flex justify-between border-t pt-4 font-bold">
              <span>Total</span>
              <span>${total}</span>
            </li>
          </ul>
        )}
      </div>

      {/* Checkout Form */}
      <form
        onSubmit={handleCheckout}
        className="md:col-span-2 bg-card p-6 rounded-xl shadow-lg border space-y-6"
      >
        <h2 className="text-xl font-semibold">Checkout Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border w-full"
          />
          <input
            type="text"
            name="address"
            placeholder="Street Address"
            value={formData.address}
            onChange={handleChange}
            required
            className="p-3 rounded-lg border w-full md:col-span-2"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="p-3 rounded-lg border w-full"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="p-3 rounded-lg border w-full"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={formData.postalCode}
            onChange={handleChange}
            className="p-3 rounded-lg border w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Payment Method</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="p-3 rounded-lg border w-full"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card">Credit / Debit Card</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        <Button type="submit" className="w-full text-lg py-6">
          Place Order
        </Button>
      </form>
    </div>
  );
}
