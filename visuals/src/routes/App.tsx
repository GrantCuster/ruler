import { useParams } from "react-router";
import { Progress } from "./Progress";
import { useEffect, useState } from "react";
import { Circle } from "./Circle";
import { Arc } from "./Arc";
import { Api } from "./Api";
import { DataType } from "../types";

export function App() {
  const params = useParams();
  const [data, setData] = useState<DataType>({
    currentSeconds: 0,
    startTime: 0,
    duration: 0,
    label: "",
  });

  useEffect(() => {
    window.addEventListener("message", (event) => {
      // Validate the origin
      if (event.origin !== "http://localhost:4000") {
        console.warn("Origin not allowed:", event.origin);
        return;
      }

      // Access nested properties
      if (event.data.type === "DATA") {
        if (event.data.payload) {
          setData(event.data.payload);
        }
      }
    });
  }, []);

  if (data.currentSeconds === 0) {
    return (
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  } else if (params.visual === "progress") {
    return <Progress data={data} />;
  } else if (params.visual === "circle") {
    return <Circle data={data} />;
  } else if (params.visual === "arc") {
    return <Arc data={data} />;
  } else if (params.visual === "example-api") {
    return <Api data={data} />;
  }
}
