import { useCart } from "./cartState";
import { createPayPalOrder, getPrintifyQuote } from "./cart";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    incrementQty,
    decrementQty,
    cartSubtotal,
    shipping,
    tax,
    cartTotal,
    currency,
    open,
    setOpen,
  } = useCart();

  async function checkout() {
    if (!items.length) return;

    const cart = {
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        unitPrice: i.unitPrice,
        qty: i.qty,
      })),
      country: "US",
      zip: "10001", // TEMP — later ask customer
    };

    try {
      // 🔹 STEP 1: Get Printify shipping + tax
      const quote = await getPrintifyQuote(cart);

      const subtotal = items.reduce(
        (s, i) => s + i.unitPrice * i.qty,
        0
      );

      const totals = {
        subtotal: subtotal.toFixed(2),
        shipping: quote.shipping.toFixed(2),
        tax: quote.tax.toFixed(2),
        total: (
          subtotal +
          quote.shipping +
          quote.tax
        ).toFixed(2),
        currency: quote.currency || "USD",
      };

      // 🔹 STEP 2: Send final totals to PayPal
      await createPayPalOrder({ ...cart, totals });

    } catch (err) {
      console.error(err);
      alert("Checkout failed.");
    }
  }

  return (
    <>
      {open && <div className="cart-overlay" onClick={() => setOpen(false)} />}

      <aside className={`cart-drawer ${open ? "open" : ""}`}>
        <header className="cartHeader">
          <h3>Your Cart</h3>
          <button className="cart-close" onClick={() => setOpen(false)}>
            ×
          </button>
        </header>

        <div className="cartItems">
          {!items.length && <p>Your cart is empty</p>}

          {items.map((item) => (
            <div key={item.variantId} className="cart-item">
              <img
                src={item.image}
                alt={item.title}
                className="cart-thumb"
              />

              <div>
                <strong>{item.title}</strong>
                <div>{item.variantTitle}</div>
                <div>
                  {(item.unitPrice * item.qty).toFixed(2)} {currency}
                </div>
              </div>

              <div className="qty">
                <button onClick={() => decrementQty(item.variantId)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => incrementQty(item.variantId)}>+</button>
              </div>

              <button onClick={() => removeItem(item.variantId)}>×</button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="cart-summary">
            <div>Subtotal: {cartSubtotal.toFixed(2)}</div>
            <div>Shipping: {shipping.toFixed(2)}</div>
            <div>Tax: {tax.toFixed(2)}</div>
            <strong>Total: {cartTotal.toFixed(2)}</strong>
          </div>
        )}

        <button className="btn primary" disabled={!items.length} onClick={checkout}>
          Checkout
        </button>
      </aside>
    </>
  );
}
