import { ReactNode } from "react";

export interface Product {
  overlayImage: any;
  id: string; // ✅ keep string for Zustand
  title: string;
  price: number;
  frame?: string;
  sku?: string;
  image?: string | null;
}



export interface CartItem extends Product {
  quantity: ReactNode;
  qty: number;
}
