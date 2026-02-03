import { useEffect, useState } from "react";
import { API_BASE } from "./api";
import { useCart } from "./cartState";

export default function Capture() {
  const [orderId, setOrderId] = useState(null);
  const { clearCart } = useCart();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("token"); // PayPal sends ?token=

    if (!orderId) return;

    fetch(`${API_BASE}/paypal/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .then((res) => res.json())
      .then(() => {
        clearCart();
        setOrderId(orderId);
      });
  }, [clearCart]);

  return (
    <div className="page successPage">
      <h1>Thank you for your order 🎉</h1>

      {orderId && (
        <p className="p subtle">
          Order ID: <strong>{orderId}</strong>
        </p>
      )}

      <button
        className="btn primary"
        onClick={() => (window.location.href = "/#/merch")}
      >
        Continue shopping
      </button>
    </div>
  );
}
