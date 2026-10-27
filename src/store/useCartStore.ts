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

function restoreItems(persisted: unknown): CartItem[] {
  if (!persisted || typeof persisted !== 'object' || !('items' in persisted) || !Array.isArray(persisted.items)) return [];
  const items = new Map<string, CartItem>();
  for (const raw of persisted.items) {
    if (!raw || typeof raw !== 'object') continue;
    const item = raw as Partial<CartItem>;
    if (typeof item.productId !== 'string' || typeof item.quantity !== 'number'
      || !Number.isSafeInteger(item.quantity) || item.quantity < 1
      || typeof item.unitPrice !== 'number' || !Number.isFinite(item.unitPrice) || item.unitPrice < 0) continue;
    // Product snapshots are optional, but malformed values must not reach renderers.
    const product = item.product;
    if (product && (typeof product !== 'object' || typeof product.stock !== 'number'
      || !Number.isSafeInteger(product.stock) || product.stock <= 0
      || typeof product.name !== 'string' || typeof product.imageUrl !== 'string' || typeof product.slug !== 'string')) continue;
    const quantity = Math.min((items.get(item.productId)?.quantity ?? 0) + item.quantity, product?.stock ?? 999, 999);
    items.set(item.productId, { productId: item.productId, quantity, unitPrice: item.unitPrice, product });
  }
  return [...items.values()];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: Product, quantity = 1) => {
        if (!Number.isSafeInteger(quantity) || quantity < 1 || !Number.isSafeInteger(product.stock) || product.stock <= 0) return;
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.productId === product.id
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingIndex];
            const newQuantity = existingItem.quantity + quantity;
            const finalQuantity = Math.min(newQuantity, product.stock, 999);

            updatedItems[existingIndex] = {
              ...existingItem,
              quantity: finalQuantity,
              unitPrice: product.price,
              product,
            };
            return { items: updatedItems };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                quantity: Math.min(quantity, product.stock, 999),
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
        if (!Number.isSafeInteger(quantity)) return;
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
                quantity: Math.min(quantity, maxStock, 999),
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
      merge: (persisted, current) => ({ ...current, items: restoreItems(persisted) }),
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

