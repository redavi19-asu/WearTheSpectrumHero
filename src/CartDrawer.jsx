import { useCart } from "./cartState";
import { createPayPalOrder } from "./cart";

export default function CartDrawer() {
  const { items, removeFromCart, open, setOpen } = useCart();

  async function checkout() {
    if (!items.length) return;

    const total = items
      .reduce((sum, i) => sum + Number(i.price || 0) * i.qty, 0)
      .toFixed(2);

    const cart = {
      items: items.map((i) => ({
        name: i.title,
        unitPrice: (Number(i.price || 0)).toFixed(2),
        qty: i.qty,
      })),
      shipping: null,
      totals: {
        subtotal: total,
        shipping: "0.00",
        tax: "0.00",
        total,
      },
      currency: "USD",
    };

    try {
      await createPayPalOrder(cart);
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Checkout failed. Try again.");
    }
  }

  return (
    <>
      {open && <div className="cart-overlay" onClick={() => setOpen(false)} />}

      <aside className={`cart-drawer ${open ? "open" : ""}`}>
        <header className="cartHeader">
          <h3>Your Cart</h3>
          <button className="cart-close" onClick={() => setOpen(false)}>✕</button>
        </header>

        <div className="cartItems">
          {items.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            items.map((item, idx) => (
              <div key={idx} className="cart-item">
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-thumb"
                />

                <div className="cart-item-info">
                  <strong>{item.title}</strong>
                  <div className="cart-variant">{item.variantTitle}</div>
                  <div className="cart-price">${(item.price * item.qty).toFixed(2)}</div>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.variantId)}
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
            <strong>
              $
              {items
                .reduce((sum, i) => sum + Number(i.price || 0) * i.qty, 0)
                .toFixed(2)}
            </strong>
          </div>
        )}

        <button
          className="btn primary checkoutBtn"
          disabled={!items.length}
          onClick={checkout}
        >
          Checkout
        </button>
      </aside>
    </>
  );
}
