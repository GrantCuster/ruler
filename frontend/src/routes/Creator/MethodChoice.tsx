import { useAtom } from "jotai";
import { useNavigate, useParams } from "react-router";
import { editorCanvasAtom, growContainerSizeAtom } from "../../atoms";
import useResizeObserver from "use-resize-observer";
import { TargetVisualizer } from "../Creator/TargetVisualizer";
import { Button, ButtonLabel, ButtonLink } from "../../components/Button";
import { CameraIcon, MonitorIcon, UploadIcon } from "lucide-react";
import { loadImage } from "../../shared/utils";

export function CreatorMethodChoice() {
  const { digit } = useParams();
  const [, setGrowContainer] = useAtom(growContainerSizeAtom);
  const { ref: growRef } = useResizeObserver({
    onResize: ({ width, height }) => {
      if (width && height) {
        setGrowContainer({ width, height });
      }
    },
  });
  const [, setEditCanvas] = useAtom(editorCanvasAtom);
  const navigate = useNavigate();

  return (
    <>
      <div ref={growRef} className="grow bg-black relative overflow-hidden">
        <TargetVisualizer />
        <div className="absolute left-0 top-0 w-full h-full flex flex-col gap-2 items-center justify-center">
          <div className="mb-1">Method</div>
          <ButtonLink to={`/creator/${digit}/camera`}>
            <CameraIcon size={16} />
            Camera
          </ButtonLink>
          <ButtonLabel>
            <input
              type="file"
              className="hidden"
              onChange={async (e) => {
                if (e.target.files) {
                  const file = e.target.files[0];
                  const canvas = document.createElement("canvas");
                  const context = canvas.getContext("2d")!;
                  const image = await loadImage(URL.createObjectURL(file));
                  canvas.width = image.width;
                  canvas.height = image.height;
                  context.drawImage(image, 0, 0);
                  setEditCanvas(canvas);
                  navigate(`/creator/${digit}/editor`);
                }
              }}
            />
            <UploadIcon size={16} />
            Upload
          </ButtonLabel>
          <ButtonLink to={`/creator/${digit}/screenshare`}>
            <MonitorIcon size={16} />
            Screenshare
          </ButtonLink>
        </div>
      </div>
      <div className="flex h-16 gap-2 items-center py-2 bg-neutral-800 px-2 justify-between"></div>
    </>
  );
}
