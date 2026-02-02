import { useEffect } from "react";
import { API_BASE } from "./api.js";

export default function Capture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      console.error("Missing PayPal token");
      return;
    }

    fetch(`${API_BASE}/paypal/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("cartToken")}`,
      },
      body: JSON.stringify({ orderId: token }),
    })
      .then((r) => r.json())
      .then(console.log)
      .catch(console.error);
  }, []);

  return <h2>Finalizing your order…</h2>;
}
