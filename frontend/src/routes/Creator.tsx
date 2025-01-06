import { useParams, useNavigate, Outlet } from "react-router";
import { Select } from "../components/Select";
import { labels } from "../shared/consts";
import { Button, ButtonLink } from "../components/Button";
import { UploadIcon, XIcon } from "lucide-react";
import { getTargetDimensions } from "../shared/utils";
import useResizeObserver from "use-resize-observer";
import {
  cameraAtom,
  canvasContainerAtom,
  customDigitsAtom,
  editorCanvasAtom,
  growContainerSizeAtom,
} from "../atoms";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { panCamera, zoomCamera } from "../shared/camera";
import { TargetVisualizer } from "./Creator/TargetVisualizer";

export function Creator() {
  const { digit } = useParams();
  const navigate = useNavigate();

  return (
    <div className="absolute left-0 top-0 w-full h-full flex flex-col overflow-hidden">
      <div className="flex gap-2 items-center py-2 bg-neutral-800 px-2 justify-between">
        <div className="px-2">Create</div>
        <Select
          value={digit}
          onChange={(e) => {
            navigate(`/creator/${e.target.value}`);
          }}
        >
          {labels.map((label, i) => (
            <option key={i} value={label}>
              {label}
            </option>
          ))}
        </Select>
        <div className="flex gap-2 items-center">
          <ButtonLink to="/">
            <XIcon size={16} />
          </ButtonLink>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export function CreatorEditor() {
  const [canvasContainer, setCanvasContainer] = useAtom(canvasContainerAtom);
  const [camera, setCamera] = useAtom(cameraAtom);
  const [editorCanvas] = useAtom(editorCanvasAtom);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { digit } = useParams();
  const [, setGrowContainer] = useAtom(growContainerSizeAtom);
  const { ref: growRef } = useResizeObserver({
    onResize: ({ width, height }) => {
      if (width && height) {
        setGrowContainer({ width, height });
      }
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (canvasRef.current && editorCanvas) {
      const context = canvasRef.current.getContext("2d")!;
      canvasRef.current.width = editorCanvas.width;
      canvasRef.current.height = editorCanvas.height;
      context.drawImage(editorCanvas, 0, 0);
    }
  }, [editorCanvas]);

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      if (canvasContainer) {
        event.preventDefault();

        const { clientX: x, clientY: y, deltaX, deltaY, ctrlKey } = event;

        if (ctrlKey) {
          setCamera((camera) =>
            zoomCamera(camera, { x, y }, deltaY / 400, canvasContainer),
          );
        } else {
          if (event.shiftKey) {
            setCamera((camera) => panCamera(camera, deltaY, 0));
          } else {
            setCamera((camera) => panCamera(camera, deltaX, deltaY));
          }
        }
      }
    }
    window.addEventListener("wheel", handleWheel, { passive: false });
    function handleArrows(event: KeyboardEvent) {
      if (canvasContainer) {
        const { key } = event;
        if (key === "ArrowUp") {
          setCamera((camera) => panCamera(camera, 0, -16 * camera.z));
        } else if (key === "ArrowDown") {
          setCamera((camera) => panCamera(camera, 0, 16 * camera.z));
        } else if (key === "ArrowLeft") {
          setCamera((camera) => panCamera(camera, -16 * camera.z, 0));
        } else if (key === "ArrowRight") {
          setCamera((camera) => panCamera(camera, 16 * camera.z, 0));
        }
      }
    }
    window.addEventListener("keydown", handleArrows);
    function handlePlusMinus(event: KeyboardEvent) {
      if (canvasContainer) {
        const { key } = event;
        if (key === "+") {
          setCamera((camera) =>
            zoomCamera(
              camera,
              { x: window.innerWidth / 2, y: window.innerWidth / 2 },
              0.1,
              canvasContainer,
            ),
          );
        } else if (key === "-" || key === "_") {
          setCamera((camera) =>
            zoomCamera(
              camera,
              { x: window.innerWidth / 2, y: window.innerWidth / 2 },
              -0.1,
              canvasContainer,
            ),
          );
        }
      }
    }
    window.addEventListener("keydown", handlePlusMinus);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleArrows);
      window.removeEventListener("keydown", handlePlusMinus);
    };
  }, [canvasContainer, setCanvasContainer]);

  const setCustomDigit = useSetAtom(customDigitsAtom);
  const { targetWidth, targetHeight } = getTargetDimensions(digit!);
  const [growContainerSize] = useAtom(growContainerSizeAtom);

  function handleSubmit() {
    if (canvasRef.current && editorCanvas) {
      const padding = 24;
      const targetScale = Math.min(
        Math.min(
          (growContainerSize.width - padding * 2) / targetWidth,
          (growContainerSize.height - padding * 2) / targetHeight,
        ),
        1,
      );
      const adjustedWidth = targetWidth * targetScale;
      const adjustedHeight = targetHeight * targetScale;

      const targetX =
        (editorCanvas.width / 2) * camera.z -
        adjustedWidth / 2 -
        camera.x * camera.z;
      const targetY =
        (editorCanvas.height / 2) * camera.z -
        adjustedHeight / 2 -
        camera.y * camera.z;

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(
        editorCanvas,
        targetX / camera.z,
        targetY / camera.z,
        targetWidth / camera.z,
        targetHeight / camera.z,
        0,
        0,
        targetWidth,
        targetHeight,
      );
      console.log(digit);
      console.log(canvas.toDataURL("image/jpeg"));
      setCustomDigit((prev) => {
        return {
          ...prev,
          [digit!]: canvas.toDataURL("image/jpeg"),
        };
      });
      navigate("/");
    }
  }

  return (
    <>
      <div ref={growRef} className="grow bg-black relative overflow-hidden">
        <div className="flex flex-col gap-2 items-center justify-center h-full">
          <div
            ref={(div) => {
              if (div) {
                setCanvasContainer(div);
              }
            }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: "100%",
              height: "100%",
              transformOrigin: "0 0",
              transform: `scale(${camera.z}) translate(-50%, -50%) translate(${camera.x}px, ${camera.y}px)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <canvas ref={canvasRef} />
          </div>
          <TargetVisualizer />
        </div>
      </div>
      <div className="flex h-16 gap-2 items-center py-2 bg-neutral-800 px-2 justify-center">
        <Button onClick={handleSubmit}>
          <UploadIcon size={16} />
          Submit
        </Button>
        <ButtonLink to={`/creator/${digit}`} transparent={true}>
          Cancel
        </ButtonLink>
      </div>
    </>
  );
}
