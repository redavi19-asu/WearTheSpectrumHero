import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const [currency] = useState("USD");

  const SHIPPING_FLAT = 6.99;

  const cartSubtotal = items.reduce(
    (s, i) => s + i.unitPrice * i.qty,
    0
  );

  const shipping = cartSubtotal > 0 ? SHIPPING_FLAT : 0;
  const tax = 0;
  const cartTotal = cartSubtotal + shipping + tax;

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setOpen(true);
  };

  const incrementQty = (variantId) =>
    setItems((prev) =>
      prev.map((i) =>
        i.variantId === variantId ? { ...i, qty: i.qty + 1 } : i
      )
    );

  const decrementQty = (variantId) =>
    setItems((prev) =>
      prev.map((i) =>
        i.variantId === variantId
          ? { ...i, qty: Math.max(1, i.qty - 1) }
          : i
      )
    );

  const removeItem = (variantId) =>
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        incrementQty,
        decrementQty,
        removeItem,
        clearCart,
        open,
        setOpen,
        cartSubtotal,
        shipping,
        tax,
        cartTotal,
        currency,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
