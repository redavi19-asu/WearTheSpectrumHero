import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "./api.js";

export default function Capture() {
  const navigate = useNavigate();

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
      .then((data) => {
        console.log("✅ Capture success", data);

        navigate("/success");
      })
      .catch(console.error);
  }, [navigate]);

  return <h2>Finalizing your order…</h2>;
}
