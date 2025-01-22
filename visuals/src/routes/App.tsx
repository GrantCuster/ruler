import { useParams } from "react-router";
import { Progress } from "./Progress";
import { Debug } from "./Debug";
import { useEffect, useState } from "react";
import { EntryType } from "../types";

export function App() {
  const params = useParams();
  const [entry, setEntry] = useState<EntryType | null>(null);
  const [currentSeconds, setCurrentSeconds] = useState(0);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      // Validate the origin
      if (event.origin !== "http://localhost:4000") {
        console.warn("Origin not allowed:", event.origin);
        return;
      }

      console.log("Message received:", event.data);

      // Access nested properties
      if (event.data.type === "DATA") {
        setEntry(event.data.payload.activeEntry);
        setCurrentSeconds(event.data.payload.currentSeconds);
      }
    });
  }, []);

  if (params.visual === "progress") {
    return <Progress entry={null} currentSeconds={0} />;
  } else if (params.visual === "debug") {
    return <Debug entry={null} currentSeconds={0} />;
  }
}
