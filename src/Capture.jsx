import { useEffect } from "react";
import { API_BASE } from "./api.js";
import { useNavigate } from "react-router-dom";
import { getCartToken } from "./cart.js";

export default function Capture() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🟡 Capture component mounted");

    const hash = window.location.hash;
    console.log("🟡 hash:", hash);

    const query = hash.split("?")[1] || "";
    const params = new URLSearchParams(query);
    const token = params.get("token");

    console.log("🟡 PayPal token:", token);

    if (!token) {
      console.error("❌ Missing PayPal token");
      return;
    }

    const failsafe = setTimeout(() => {
      console.warn("⚠️ Failsafe redirect fired");
      navigate("/success", { replace: true });
    }, 5000);

    (async () => {
      try {
        console.log("🟡 Sending capture request…");

        const cartToken = getCartToken();
        if (!cartToken) {
          console.error("❌ Missing cart token for capture");
          clearTimeout(failsafe);
          navigate("/success", { replace: true });
          return;
        }

        const res = await fetch(`${API_BASE}/paypal/capture`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cartToken}`,
          },
          body: JSON.stringify({ orderId: token }),
        });

        console.log("🟢 Capture response status:", res.status);

        clearTimeout(failsafe);

        console.log("🟢 Navigating to success");
        navigate("/success", { replace: true });

      } catch (err) {
        console.error("❌ Capture threw error", err);
        clearTimeout(failsafe);
        navigate("/success", { replace: true });
      }
    })();

  }, [navigate]);

  return <h2>Finalizing your order…</h2>;
}
