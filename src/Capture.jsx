import { useEffect, useState } from "react";
import { API_BASE } from "./api";

export default function Capture() {
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
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
        if (data.ok) {
          setStatus("success");
          localStorage.removeItem("cartToken");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "processing") {
    return <h2>Finalizing your order…</h2>;
  }

  if (status === "success") {
    return (
      <div>
        <h2>✅ Order Complete</h2>
        <p>Thank you for supporting Wear the Spectrum Hero.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>❌ Something went wrong</h2>
      <p>Please contact support if you were charged.</p>
    </div>
  );
}
