import { useCart } from "./cartState";
import { createPayPalOrder } from "./cart";

export default function CartDrawer() {
  const { items, removeItem, open, setOpen } = useCart();

  async function checkout() {
    if (!items.length) return;

    const cart = {
      items: items.map((i) => ({
        name: i.name,
        unitPrice: i.unitPrice,
        qty: i.qty,
      })),
    };

    const shipping = null;

    const total = items
      .reduce((sum, i) => sum + parseFloat(i.unitPrice) * i.qty, 0)
      .toFixed(2);

    const totals = {
      subtotal: total,
      shipping: "0.00",
      tax: "0.00",
      total,
    };

    try {
      await createPayPalOrder(cart, shipping, totals);
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
          {items.length === 0 && <p className="empty">Cart is empty</p>}

          {items.map((item) => (
            <div key={item.id} className="cartItem">
              <span>{item.name} × {item.qty}</span>
              <button onClick={() => removeItem(item.id)}>✕</button>
            </div>
          ))}
        </div>

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
