import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Home";
import Capture from "./Capture";
import { Privacy, Terms, ShippingReturns } from "./Legal";
import PrivacyControls from "./PrivacyControls";

function Success() {
  return (
    <div className="page center">
      <h1>Thank you for your order 🎉</h1>
      <button
        className="btn primary"
        onClick={() => {
          window.location.assign(import.meta.env.BASE_URL + "#/");
        }}
      >
        Continue shopping
      </button>
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("orderSuccess") === "1") {
      sessionStorage.removeItem("orderSuccess");
      navigate("/success", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/success" element={<Success />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/shipping-returns" element={<ShippingReturns />} />
      </Routes>
      <PrivacyControls />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/WearTheSpectrumHero">
      <AppRoutes />
    </BrowserRouter>
  );
}
