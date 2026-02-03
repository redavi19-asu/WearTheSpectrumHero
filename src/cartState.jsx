import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  /**
   * item shape (LOCKED):
   * {
   *   productId,
   *   variantId,
   *   title,
   *   variantTitle,
   *   unitPrice, // NUMBER (USD, dollars)
   *   qty,       // INTEGER >= 1
   *   image
   * }
   */
  const addItem = (item) => {
    const {
      productId,
      variantId,
      title,
      variantTitle,
      unitPrice,
      qty = 1,
      image,
    } = item;

    if (!productId || !variantId) return;

    const cleanQty = Math.max(1, Number(qty) || 1);
    const cleanPrice = Number(unitPrice) || 0;

    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === variantId);

      if (existing) {
        return prev.map((i) =>
          i.variantId === variantId
            ? { ...i, qty: i.qty + cleanQty }
            : i
        );
      }

      return [
        ...prev,
        {
          productId,
          variantId,
          title,
          variantTitle,
          unitPrice: cleanPrice,
          qty: cleanQty,
          image,
        },
      ];
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

  const clearCart = () => setItems([]);

  const cartSubtotal = items.reduce(
    (sum, i) => sum + i.unitPrice * i.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        incrementQty,
        decrementQty,
        removeItem,
        clearCart,
        cartSubtotal,
        open,
        setOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
