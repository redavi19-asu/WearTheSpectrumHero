import { useEffect } from "react";
import { API_BASE } from "./api";

export default function Capture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split("?")[1]);
    const orderId = params.get("token");

    if (!orderId) return;

    const token = localStorage.getItem("cartToken");

    fetch(`${API_BASE}/paypal/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId }),
    })
      .then(() => {
        sessionStorage.setItem("orderSuccess", "1");
        window.location.replace("#/success");
      })
      .catch(() => {
        window.location.hash = "#/error";
      });
  }, []);

  return (
    <div className="page center">
      <h1>Finalizing your order…</h1>
    </div>
  );
}
