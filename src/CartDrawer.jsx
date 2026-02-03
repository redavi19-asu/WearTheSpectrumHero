import { useCart } from "./cartState";
import { createPayPalOrder } from "./cart";

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
      totals: {
        subtotal: cartSubtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: cartTotal.toFixed(2),
        currency,
      },
      country: "US",
    };

    try {
      console.log("CHECKOUT CART", cart);
      console.log("TOTALS", {
        subtotal: cartSubtotal,
        shipping,
        tax,
        total: cartTotal
      });
      await createPayPalOrder(cart);
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      alert(
        typeof err === "string"
          ? err
          : err?.message || JSON.stringify(err)
      );
    }
  }

  return (
    <>
      {open && (
        <div 
          className="cart-overlay" 
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside 
        className={`cart-drawer ${open ? "open" : ""}`}
        aria-label="Shopping cart"
        aria-hidden={!open}
      >
        <header className="cartHeader">
          <h3>Your Cart</h3>
          <button 
            className="cart-close" 
            onClick={() => setOpen(false)}
            aria-label="Close cart"
          >
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
                <button 
                  onClick={() => decrementQty(item.variantId)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span aria-label={`Quantity: ${item.qty}`}>{item.qty}</span>
                <button 
                  onClick={() => incrementQty(item.variantId)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button 
                onClick={() => removeItem(item.variantId)}
                aria-label={`Remove ${item.title} from cart`}
              >
                ×
              </button>
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
