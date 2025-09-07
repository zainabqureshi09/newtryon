import { ReactNode } from "react";

export interface Product {
  id: string;             // ✅ String is fine (Zustand friendly)
  title: string;
  price: number;
  frame?: string;
  sku?: string;
  image?: string | null;  // ✅ Normal product image
  overlayImage?: string | null; // ✅ Transparent PNG for try-on
}

// Agar product cart me add hota hai
export interface CartItem extends Product {
  quantity?: number;   // ✅ standard quantity
  qty?: number;        // ✅ keeping alias if needed
  children?: ReactNode; // ✅ in case you pass React components
}

// Props for ProductCard component
export interface ProductCardProps {
  product: Product;
  addItem?: (product: Product) => void; // ✅ optional add-to-cart function
}
