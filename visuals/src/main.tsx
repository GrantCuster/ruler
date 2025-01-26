import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./routes/App.tsx";
import { BrowserRouter, Routes, Route } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="h-[100dvh] relative w-full flex-col flex overflow-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/:visual" element={<App />} />
          <Route path="/" element={<App />} />
       </Routes>
      </BrowserRouter>
    </div>
  </StrictMode>,
);
