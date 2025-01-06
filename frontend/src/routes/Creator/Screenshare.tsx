import { useAtom, useSetAtom } from "jotai";
import { useNavigate, useParams } from "react-router";
import {
  cameraAtom,
  canvasContainerAtom,
  creatorCameraVideoElementAtom,
  editorCanvasAtom,
  growContainerSizeAtom,
  mediaSizeAtom,
  ScreenshareStreamAtom,
} from "../../atoms";
import useResizeObserver from "use-resize-observer";
import { getTargetDimensions } from "../../shared/utils";
import { useEffect, useRef } from "react";
import { panCamera, zoomCamera } from "../../shared/camera";
import { TargetVisualizer } from "./TargetVisualizer";
import { Button, ButtonLink } from "../../components/Button";
import { CameraIcon } from "lucide-react";

export function CreatorScreenshare() {
  const { digit } = useParams();
  const [stream, setStream] = useAtom(ScreenshareStreamAtom);
  const [camera, setCamera] = useAtom(cameraAtom);
  const [canvasContainer, setCanvasContainer] = useAtom(canvasContainerAtom);
  const [, setGrowContainer] = useAtom(growContainerSizeAtom);
  const { ref: growRef } = useResizeObserver({
    onResize: ({ width, height }) => {
      if (width && height) {
        setGrowContainer({ width, height });
      }
    },
  });
  const [mediaSize] = useAtom(mediaSizeAtom);
  const { targetWidth, targetHeight } = getTargetDimensions(digit!);
  const [cameraVideoElement] = useAtom(creatorCameraVideoElementAtom);
  const setEditCanvas = useSetAtom(editorCanvasAtom);
  const navigate = useNavigate();

  const runOnceRef = useRef(false);
  useEffect(() => {
    if (!runOnceRef.current) {
      navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        setStream(stream);
      });
      runOnceRef.current = true;
    }
    return () => { };
  }, []);

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

  return (
    <>
      <div ref={growRef} className="grow bg-black relative overflow-hidden">
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
          {stream ? <ScreenshareStream /> : null}
        </div>
        <TargetVisualizer />
        <div className="absolute left-0 top-0 w-full h-full flex flex-col gap-2 items-center justify-center"></div>
      </div>
      <div className="flex bg-neutral-700 justify-between text-xs px-3 font-mono py-1">
        <div>
          {mediaSize.width}x{mediaSize.height}
        </div>
        <div className="text-blue-400">
          {targetWidth}x{targetHeight}
        </div>
        <div>
          {Math.round(camera.x)} {Math.round(camera.y)} {camera.z.toFixed(2)}
        </div>
      </div>
      <div className="flex h-16 gap-2 items-center py-2 bg-neutral-800 px-2 justify-center">
        <Button
          onClick={() => {
            const canvas = document.createElement("canvas");
            canvas.width = cameraVideoElement!.videoWidth;
            canvas.height = cameraVideoElement!.videoHeight;
            const context = canvas.getContext("2d")!;
            context.drawImage(cameraVideoElement!, 0, 0);
            setEditCanvas(canvas);
            navigate(`/creator/${digit}/editor`);
          }}
        >
          <CameraIcon size={16} />
          Capture
        </Button>
        <ButtonLink to={`/creator/${digit}`} transparent={true}>
          Cancel
        </ButtonLink>
      </div>
    </>
  );
}

export function ScreenshareStream() {
  const [stream] = useAtom(ScreenshareStreamAtom);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaSize, setMediaSize] = useAtom(mediaSizeAtom);
  const [cameraVideoElement, setCameraVideoElement] = useAtom(
    creatorCameraVideoElementAtom,
  );

  console.log(stream);
  console.log(mediaSize);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          console.log("loaded");
          setMediaSize({
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
          });
        }
      };
    }
  }, [stream]);

  return stream ? (
    <video
      className="relative"
      ref={(el) => {
        videoRef.current = el;
        if (el && !cameraVideoElement) {
          setCameraVideoElement(el);
        }
      }}
      autoPlay
      playsInline
      style={{
        width: mediaSize.width,
        height: mediaSize.height,
      }}
    />
  ) : null;
}
