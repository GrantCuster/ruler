import { useParams } from "react-router";
import { Progress } from "./Progress";
import { Debug } from "./Debug";
import { useEffect, useState } from "react";
import { EntryType } from "../types";
import { Circle } from "./Circle";

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

      // Access nested properties
      if (event.data.type === "DATA") {
        setEntry(event.data.payload.activeEntry);
        setCurrentSeconds(event.data.payload.currentSeconds);
      }
    });
  }, []);

  if (currentSeconds === 0) {
    return (
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  } else if (params.visual === "progress") {
    return <Progress entry={entry} currentSeconds={currentSeconds} />;
  } else if (params.visual === "debug") {
    return <Debug entry={entry} currentSeconds={currentSeconds} />;
  } else if (params.visual === "circle") {
    return <Circle entry={entry} currentSeconds={currentSeconds} />;
  }
}
