import React, { createContext, useContext, useState } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateDiscounts: (discount: number, surcharge: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalDiscount: number;
  totalSurcharge: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [totalDiscount, setTotalDiscount] = useState<number>(0);
  const [totalSurcharge, setTotalSurcharge] = useState<number>(0);

  const addItem = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.produto.id === product.id);
      if (existing) {
        const newQty = existing.quantidade + quantity;
        const newSubtotal = (product.precoVenda - existing.desconto) * newQty;
        return prev.map((item) =>
          item.produto.id === product.id
            ? { ...item, quantidade: newQty, subtotal: newSubtotal }
            : item
        );
      }
      const newSubtotal = product.precoVenda * quantity;
      return [
        ...prev,
        {
          produto: product,
          quantidade: quantity,
          precoUnitario: product.precoVenda,
          desconto: 0,
          subtotal: newSubtotal,
        },
      ];
    });
  };

  const removeItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.produto.id !== productId));
  };

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.produto.id === productId) {
          const newSubtotal = (item.precoUnitario - item.desconto) * newQty;
          return { ...item, quantidade: newQty, subtotal: newSubtotal };
        }
        return item;
      })
    );
  };

  const updateDiscounts = (discount: number, surcharge: number) => {
    setTotalDiscount(discount);
    setTotalSurcharge(surcharge);
  };

  const clearCart = () => {
    setCart([]);
    setTotalDiscount(0);
    setTotalSurcharge(0);
  };

  const subtotal = cart.reduce((acc, item) => acc + item.subtotal, 0);
  const total = Math.max(0, subtotal - totalDiscount + totalSurcharge);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateQuantity,
        updateDiscounts,
        clearCart,
        subtotal,
        totalDiscount,
        totalSurcharge,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
