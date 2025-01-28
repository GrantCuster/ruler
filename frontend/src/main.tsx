import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Landing from "./routes/Landing.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import { Calendar } from "./routes/Calendar.tsx";
import { Focus } from "./routes/Focus.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="h-[100dvh] w-full flex overflow-hidden">
      <BrowserRouter>
        <Routes>
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/:option" element={<Focus />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </div>
  </StrictMode>,
);
