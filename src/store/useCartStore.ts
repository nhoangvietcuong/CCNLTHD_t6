import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Product } from "@/types";

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  getTotalItems: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: Product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === product.id
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingIndex];
            const newQuantity = existingItem.quantity + quantity;
            const finalQuantity = product.stock
              ? Math.min(newQuantity, product.stock)
              : newQuantity;

            updatedItems[existingIndex] = {
              ...existingItem,
              quantity: finalQuantity,
            };
            return { items: updatedItems };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                quantity: Math.min(quantity, product.stock || quantity),
                unitPrice: product.price,
                product,
              },
            ],
          };
        });
      },

      removeFromCart: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId === productId) {
              const maxStock = item.product?.stock ?? 999;
              return {
                ...item,
                quantity: Math.min(quantity, maxStock),
              };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.quantity * item.unitPrice,
          0
        );
      },
    }),
    {
      name: "bookstore_cart", // key lưu trong localStorage
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({ items: state.items }),
    }
  )
);

