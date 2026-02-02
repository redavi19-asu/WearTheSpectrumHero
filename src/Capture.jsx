import { useEffect } from "react";
import { API_BASE } from "./api.js";
import { useNavigate } from "react-router-dom";

export default function Capture() {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ HASH ROUTER QUERY FIX
    const hash = window.location.hash;
    const query = hash.split("?")[1] || "";
    const params = new URLSearchParams(query);
    const token = params.get("token");

    if (!token) {
      console.error("❌ Missing PayPal token");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/paypal/capture`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("cartToken")}`,
          },
          body: JSON.stringify({ orderId: token }),
        });

        if (!res.ok) {
          throw new Error("Capture failed");
        }

        console.log("✅ Capture complete");

        localStorage.removeItem("cartToken");

        navigate("/success", { replace: true });
      } catch (err) {
        console.error("❌ Capture error", err);
      }
    })();
  }, [navigate]);

  return <h2>Finalizing your order…</h2>;
}
