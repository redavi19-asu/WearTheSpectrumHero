import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./Home";
import Capture from "./Capture";

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
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/capture" element={<Capture />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter basename="/WearTheSpectrumHero">
      <AppRoutes />
    </BrowserRouter>
  );
}
