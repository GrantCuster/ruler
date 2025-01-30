import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Gallery from "./routes/Gallery.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import { HandleTick } from "./components/HandleTick.tsx";
import Timer from "./routes/Timer.tsx";
import Fullscreen from "./routes/Fullscreen.tsx";

// Calendar could go back in

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="h-[100dvh] w-full flex overflow-hidden">
      <HandleTick />
      <BrowserRouter>
        <Routes>
          <Route path="/fullscreen/:encodedURL" element={<Fullscreen />} />
          <Route path="/skin/:encodedURL" element={<Timer />} />
          <Route path="/skins" element={<Gallery />} />
          <Route path="/" element={<Gallery />} />
        </Routes>
      </BrowserRouter>
    </div>
  </StrictMode>,
);
