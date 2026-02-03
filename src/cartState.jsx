import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE } from "./api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);

  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [currency, setCurrency] = useState("USD");

  const cartSubtotal = items.reduce(
    (s, i) => s + i.unitPrice * i.qty,
    0
  );

  const cartTotal = cartSubtotal + shipping + tax;

  // 🔁 LIVE PRINTIFY QUOTE
  useEffect(() => {
    if (!items.length) {
      setShipping(0);
      setTax(0);
      return;
    }

    const token = localStorage.getItem("cartToken");
    if (!token) return;

    fetch(`${API_BASE}/printify/quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: items.map((i) => ({
          variantId: i.variantId,
          qty: i.qty,
        })),
        country: "US",
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok) return;
        setShipping(Number(d.shipping || 0));
        setTax(Number(d.tax || 0));
        setCurrency(d.currency || "USD");
      })
      .catch(() => {
        setShipping(0);
        setTax(0);
      });
  }, [items]);

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
    setShipping(0);
    setTax(0);
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
