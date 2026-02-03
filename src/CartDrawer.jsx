import { useState } from "react";
import { useCart } from "./cartState";
import { createPayPalOrder, estimateTotals } from "./cart";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    incrementQty,
    decrementQty,
    cartSubtotal,
    shipping: shippingCost,
    tax,
    cartTotal,
    currency,
    open,
    setOpen,
  } = useCart();

  const [shippingForm, setShippingForm] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const handleShippingChange = (field) => (event) => {
    const { value } = event.target;
    setShippingForm((prev) => ({ ...prev, [field]: value }));
  };

  async function checkout() {
    if (!items.length) return;

    const shipping = {
      name: shippingForm.name.trim(),
      phone: shippingForm.phone.trim(),
      address: {
        address_line_1: shippingForm.addressLine1.trim(),
        address_line_2: shippingForm.addressLine2.trim(),
        admin_area_2: shippingForm.city.trim(),
        admin_area_1: shippingForm.state.trim(),
        postal_code: shippingForm.zip.trim(),
        country_code: shippingForm.country.trim() || "US",
      },
    };

    const cart = {
      items: items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        unitPrice: i.unitPrice,
        qty: i.qty,
      })),
      amount: {
        value: cartTotal.toFixed(2),
        breakdown: {
          item_total: {
            value: cartSubtotal.toFixed(2),
            currency_code: "USD",
          },
          shipping: {
            value: shippingCost.toFixed(2),
            currency_code: "USD",
          },
          tax_total: {
            value: "0.00",
            currency_code: "USD",
          },
        },
      },
      totals: {
        subtotal: cartSubtotal.toFixed(2),
        shipping: shippingCost.toFixed(2),
        tax: tax.toFixed(2),
        total: cartTotal.toFixed(2),
        currency,
      },
      shipping,
      country: "US",
    };

    try {
      await estimateTotals(cart, shipping);
      console.log("CHECKOUT CART", cart);
      console.log("TOTALS", {
        subtotal: cartSubtotal,
        shipping: shippingCost,
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
          <div className="shipping-form">
            <h4>Shipping</h4>
            <label>
              Full name
              <input
                type="text"
                value={shippingForm.name}
                onChange={handleShippingChange("name")}
                autoComplete="name"
                required
              />
            </label>
            <label>
              Address line 1
              <input
                type="text"
                value={shippingForm.addressLine1}
                onChange={handleShippingChange("addressLine1")}
                autoComplete="address-line1"
                required
              />
            </label>
            <label>
              Address line 2
              <input
                type="text"
                value={shippingForm.addressLine2}
                onChange={handleShippingChange("addressLine2")}
                autoComplete="address-line2"
              />
            </label>
            <div className="shipping-grid">
              <label>
                City
                <input
                  type="text"
                  value={shippingForm.city}
                  onChange={handleShippingChange("city")}
                  autoComplete="address-level2"
                  required
                />
              </label>
              <label>
                State
                <input
                  type="text"
                  value={shippingForm.state}
                  onChange={handleShippingChange("state")}
                  autoComplete="address-level1"
                  required
                />
              </label>
            </div>
            <div className="shipping-grid">
              <label>
                ZIP
                <input
                  type="text"
                  value={shippingForm.zip}
                  onChange={handleShippingChange("zip")}
                  autoComplete="postal-code"
                  required
                />
              </label>
              <label>
                Country
                <input
                  type="text"
                  value={shippingForm.country}
                  onChange={handleShippingChange("country")}
                  autoComplete="country"
                  required
                />
              </label>
            </div>
            <label>
              Phone (optional)
              <input
                type="tel"
                value={shippingForm.phone}
                onChange={handleShippingChange("phone")}
                autoComplete="tel"
              />
            </label>
          </div>
        )}

        {items.length > 0 && (
          <div className="cart-summary">
            <div>Subtotal: ${cartSubtotal.toFixed(2)}</div>
            <div>Shipping: ${shippingCost.toFixed(2)}</div>
            <div>Tax: $0.00</div>
            <div className="total">Total: ${cartTotal.toFixed(2)}</div>
          </div>
        )}

        <button className="btn primary" disabled={!items.length} onClick={checkout}>
          Checkout
        </button>
      </aside>
    </>
  );
}
