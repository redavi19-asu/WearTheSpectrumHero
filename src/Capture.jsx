import { useEffect } from "react";
import { API_BASE } from "./api.js";
import { useNavigate } from "react-router-dom";

export default function Capture() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔥 HASH ROUTER FIX
    const hash = window.location.hash;
    const queryString = hash.split("?")[1] || "";
    const params = new URLSearchParams(queryString);

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
      .then((data) => {
        console.log("✅ Capture success", data);
        navigate("/success");
      })
      .catch(console.error);
  }, []);

  return <h2>Finalizing your order…</h2>;
}
