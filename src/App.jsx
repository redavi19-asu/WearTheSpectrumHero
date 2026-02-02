import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Capture from "./Capture";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/capture" element={<Capture />} />
      </Routes>
    </HashRouter>
  );
}
