import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();

  // 🧮 Cart Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 200 ? 0 : 15;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // 🛒 Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
            <h1 className="font-display text-2xl font-bold mb-4">
              Your cart is empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Discover our collection of premium eyewear
            </p>
            <Link to="/catalog">
              <Button size="lg">Shop Now</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-3xl font-bold mb-8"
        >
          Shopping Cart ({items.length})
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Item Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Color: {item.colorway}
                        </p>
                        <p className="font-bold">${item.price}</p>
                      </div>

                      {/* Quantity + Remove */}
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.productId)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              item.quantity > 1
                                ? updateQuantity(item.productId, item.quantity - 1)
                                : removeItem(item.productId)
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="px-3 py-1 min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Cart Actions */}
            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
              <Link to="/catalog">
                <Button variant="ghost">Continue Shopping</Button>
              </Link>
            </div>
          </div>

          {/* Order Summary Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Total */}
                <div className="flex justify-between font-bold text-lg mb-6">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                {/* Promo Code */}
                <div className="space-y-3">
                  <Input placeholder="Promo code" />
                  <Button variant="outline" className="w-full">
                    Apply Code
                  </Button>
                </div>

                <Separator className="my-4" />

                {/* Checkout */}
                <Link to="/checkout">
                  <Button size="lg" className="w-full">
                    Proceed to Checkout
                  </Button>
                </Link>

                {/* Free shipping message */}
                {subtotal < 200 && (
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Add ${(200 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
