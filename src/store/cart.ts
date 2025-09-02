import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  colorway: string;
  image: string;
  frameSize?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  addItem: (item: Omit<CartItem, 'id'> | CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        total: 0,
        
        addItem: (item) => {
          const id = 'id' in item ? item.id : `${item.productId}-${item.colorway}-${Date.now()}`;
          const newItem = { ...item, id };
          
          set((state) => {
            const newItems = [...state.items, newItem];
            const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return { items: newItems, total: newTotal };
          });
        },
        
        removeItem: (id) => {
          set((state) => {
            const newItems = state.items.filter(item => item.id !== id);
            const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return { items: newItems, total: newTotal };
          });
        },
        
        updateQuantity: (id, quantity) => {
          if (quantity <= 0) {
            get().removeItem(id);
            return;
          }
          
          set((state) => {
            const newItems = state.items.map(item => 
              item.id === id ? { ...item, quantity } : item
            );
            const newTotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            return { items: newItems, total: newTotal };
          });
        },
        
        clearCart: () => set({ items: [], total: 0 }),
        
        getItemCount: () => {
          return get().items.reduce((sum, item) => sum + item.quantity, 0);
        },
      }),
      {
        name: 'lens-cart-storage',
      }
    ),
    {
      name: 'cart-store',
    }
  )
);