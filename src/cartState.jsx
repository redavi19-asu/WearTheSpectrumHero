import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const addItem = (item) => {
    const {
      productId,
      variantId,
      title,
      variantTitle,
      price,
      qty = 1,
      image,
    } = item;

    if (variantId == null || productId == null) return items;

    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === variantId ? { ...i, qty: i.qty + qty } : i
        );
      }

      return [
        ...prev,
        {
          productId,
          variantId,
          title,
          variantTitle,
          price: Number(price) || 0,
          qty,
          image,
        },
      ];
    });

    setOpen(true);
  };

  const removeItem = (variantId) =>
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));

  const removeFromCart = removeItem;

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, removeFromCart, clearCart, open, setOpen }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
