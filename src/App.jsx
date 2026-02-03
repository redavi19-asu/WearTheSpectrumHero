import { BrowserRouter, Routes, Route } from "react-router-dom";
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

export default function App() {
  return (
    <BrowserRouter basename="/WearTheSpectrumHero">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}
