import { useState } from "react";
import { useCart } from "./cartState";
import { createPayPalOrder } from "./cart";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    incrementQty,
    decrementQty,
    cartSubtotal,
    open,
    setOpen,
  } = useCart();

  const [loading, setLoading] = useState(false);

  async function checkout() {
    if (!items.length || loading) return;

    setLoading(true);

    const total = Number(cartSubtotal.toFixed(2));

    const cart = {
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        unitPrice: i.unitPrice,
        qty: i.qty,
      })),
      totals: {
        subtotal: total.toFixed(2),
        shipping: "0.00",
        tax: "0.00",
        total: total.toFixed(2),
        currency: "USD",
      },
      country: "US",
    };

    try {
      await createPayPalOrder(cart);
      // redirect handled inside createPayPalOrder
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Checkout failed. Try again.");
      setLoading(false);
    }
  }

  return (
    <>
      {open && <div className="cart-overlay" onClick={() => setOpen(false)} />}

      <aside className={`cart-drawer ${open ? "open" : ""}`}>
        <header className="cartHeader">
          <h3>Your Cart</h3>
          <button className="cart-close" onClick={() => setOpen(false)}>
            ✕
          </button>
        </header>

        <div className="cartItems">
          {items.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.variantId} className="cart-item">
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-thumb"
                />

                <div className="cart-item-info">
                  <strong>{item.title}</strong>
                  <div className="cart-variant">{item.variantTitle}</div>
                  <div className="cart-price">
                    ${(item.unitPrice * item.qty).toFixed(2)}
                  </div>
                </div>

                <div className="cart-qty-controls">
                  <button
                    className="qty-btn minus-btn"
                    onClick={() => decrementQty(item.variantId)}
                  >
                    −
                  </button>
                  <span className="qty-display">{item.qty}</span>
                  <button
                    className="qty-btn plus-btn"
                    onClick={() => incrementQty(item.variantId)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.variantId)}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-total">
            <span>Total</span>
            <strong>${cartSubtotal.toFixed(2)}</strong>
          </div>
        )}

        <button
          className="btn primary checkoutBtn"
          disabled={!items.length || loading}
          onClick={checkout}
        >
          {loading ? "Redirecting…" : "Checkout"}
        </button>
      </aside>
    </>
  );
}
