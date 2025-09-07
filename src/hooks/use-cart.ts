// src/hooks/use-cart.ts
import { create } from "zustand";

export interface Product {
  overlay: any;
  id: string;
  title: string;
  price: number;
  image?: string;
  quantity?: number;
}

interface CartState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const useCart = create<CartState>((set, get) => ({
  items: [],
  addItem: (product) => {
    const items = get().items;
    const exists = items.find((i) => i.id === product.id);

    if (exists) {
      set({
        items: items.map((i) =>
          i.id === product.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        ),
      });
    } else {
      set({ items: [...items, { ...product, quantity: 1 }] });
    }
  },
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  clearCart: () => set({ items: [] }),
  get totalItems() {
    return get().items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  },
  get totalPrice() {
    return get().items.reduce(
      (acc, item) => acc + item.price * (item.quantity || 1),
      0
    );
  },
}));

export default useCart;
