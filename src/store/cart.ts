import { create } from "zustand";

export interface CartItem {
  id: string | number;
  title: string;
  price: number;
  image?: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: CartItem) => void;
  increase: (id: string | number) => void;
  decrease: (id: string | number) => void;
  removeItem: (id: string | number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  total: 0,

  addItem: (item) =>
    set((state) => {
      const exists = state.items.find((i) => i.id === item.id);
      let newItems;
      if (exists) {
        newItems = state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        newItems = [...state.items, { ...item, quantity: 1 }];
      }
      return {
        items: newItems,
        total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      };
    }),

  increase: (id) =>
    set((state) => {
      const newItems = state.items.map((i) =>
        i.id === id ? { ...i, quantity: i.quantity + 1 } : i
      );
      return {
        items: newItems,
        total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      };
    }),

  decrease: (id) =>
    set((state) => {
      const newItems = state.items
        .map((i) =>
          i.id === id ? { ...i, quantity: Math.max(i.quantity - 1, 1) } : i
        )
        .filter((i) => i.quantity > 0);
      return {
        items: newItems,
        total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      };
    }),

  removeItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((i) => i.id !== id);
      return {
        items: newItems,
        total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
      };
    }),

  clear: () => set({ items: [], total: 0 }),
}));
