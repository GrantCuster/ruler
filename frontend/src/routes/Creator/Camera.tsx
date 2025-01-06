import { useAtom, useSetAtom } from "jotai";
import { useNavigate, useParams } from "react-router";
import {
  cameraAtom,
  cameraFlippedAtom,
  cameraStreamAtom,
  canvasContainerAtom,
  creatorCameraVideoElementAtom,
  editorCanvasAtom,
  growContainerSizeAtom,
  mediaSizeAtom,
} from "../../atoms";
import useResizeObserver from "use-resize-observer";
import { getTargetDimensions } from "../../shared/utils";
import { useEffect, useRef } from "react";
import { panCamera, zoomCamera } from "../../shared/camera";
import { TargetVisualizer } from "./TargetVisualizer";
import { Button, ButtonLink } from "../../components/Button";
import { CameraIcon } from "lucide-react";

export function CreatorCamera() {
  const { digit } = useParams();
  const [stream] = useAtom(cameraStreamAtom);
  const [camera, setCamera] = useAtom(cameraAtom);
  const setStream = useSetAtom(cameraStreamAtom);
  const [canvasContainer, setCanvasContainer] = useAtom(canvasContainerAtom);
  const [, setGrowContainer] = useAtom(growContainerSizeAtom);
  const [cameraVideoElement] = useAtom(creatorCameraVideoElementAtom);
  const [, setEditCanvas] = useAtom(editorCanvasAtom);
  const navigate = useNavigate();
  const [cameraFlipped] = useAtom(cameraFlippedAtom);

  const { ref: growRef } = useResizeObserver({
    onResize: ({ width, height }) => {
      if (width && height) {
        setGrowContainer({ width, height });
      }
    },
  });
  const [mediaSize] = useAtom(mediaSizeAtom);
  const { targetWidth, targetHeight } = getTargetDimensions(digit!);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      setStream(stream);
    });
    return () => {
      // TODO stop stream
    };
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
    return () => window.removeEventListener("wheel", handleWheel);
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
          {stream ? <CameraStream /> : null}
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
            context.translate(
              cameraFlipped ? canvas.width : 0,
              0,
            );
            context.scale(cameraFlipped ? -1 : 1, 1);
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

export function CameraStream() {
  const [stream] = useAtom(cameraStreamAtom);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mediaSize, setMediaSize] = useAtom(mediaSizeAtom);
  const [cameraVideoElement, setCameraVideoElement] = useAtom(
    creatorCameraVideoElementAtom,
  );
  const [cameraFlipped] = useAtom(cameraFlippedAtom);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
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
        transform: cameraFlipped ? "scaleX(-1)" : "none",
        width: mediaSize.width,
        height: mediaSize.height,
      }}
    />
  ) : null;
}
