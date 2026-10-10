"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product } from "@/types";

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isMounted: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "bookstore_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Đọc localStorage sau khi component đã mount trên browser (tránh Hydration mismatch của Next.js)
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Lỗi khi đọc giỏ hàng từ localStorage:", error);
      }
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 2. Tự động lưu vào localStorage mỗi khi giỏ hàng thay đổi
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.error("Lỗi khi lưu giỏ hàng vào localStorage:", error);
      }
    }
  }, [items, isMounted]);

  // Thêm sách vào giỏ
  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.productId === product.id
      );

      if (existingItemIndex > -1) {
        // Nếu sách đã có trong giỏ, tăng số lượng
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;

        // Không cho phép vượt quá số lượng tồn kho
        const finalQuantity = product.stock ? Math.min(newQuantity, product.stock) : newQuantity;

        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: finalQuantity,
        };
        return updatedItems;
      }

      // Nếu chưa có, thêm mới
      return [
        ...prevItems,
        {
          productId: product.id,
          quantity: Math.min(quantity, product.stock || quantity),
          unitPrice: product.price,
          product,
        },
      ];
    });
  };

  // Xóa sách khỏi giỏ
  const removeFromCart = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  // Cập nhật số lượng
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productId === productId) {
          const maxStock = item.product?.stock ?? 999;
          return {
            ...item,
            quantity: Math.min(quantity, maxStock),
          };
        }
        return item;
      })
    );
  };

  // Dọn sạch giỏ (dùng khi đặt hàng thành công)
  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Tính tổng số cuốn sách trong giỏ
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Tạm tính tổng tiền (client)
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isMounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook tiện ích để các component con gọi dùng
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart phải được sử dụng bên trong CartProvider");
  }
  return context;
}
