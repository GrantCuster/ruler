import { useAtom } from "jotai";
import { growContainerSizeAtom } from "../../atoms";
import { getTargetDimensions } from "../../shared/utils";
import { useParams } from "react-router";

export function TargetVisualizer() {
  const { digit } = useParams();
  const { targetWidth, targetHeight } = getTargetDimensions(digit!);
  const [growContainerSize] = useAtom(growContainerSizeAtom);

  const padding = 24;
  const scale = Math.min(
    Math.min(
      (growContainerSize.width - padding * 2) / targetWidth,
      (growContainerSize.height - padding * 2) / targetHeight,
    ),
    1,
  );

  const adjustedWidth = targetWidth * scale;
  const adjustedHeight = targetHeight * scale;

  return (
    <>
      <div
        className="absolute bg-black bg-opacity-80"
        style={{
          left: 0,
          top: 0,
          width: growContainerSize.width,
          height: (growContainerSize.height - adjustedHeight) / 2,
        }}
      ></div>
      <div
        className="absolute bg-black bg-opacity-80"
        style={{
          left: 0,
          top:
            growContainerSize.height -
            (growContainerSize.height - adjustedHeight) / 2,
          width: growContainerSize.width,
          height: (growContainerSize.height - adjustedHeight) / 2,
        }}
      ></div>
      <div
        className="absolute bg-black bg-opacity-80"
        style={{
          left: 0,
          top: (growContainerSize.height - adjustedHeight) / 2,
          width: (growContainerSize.width - adjustedWidth) / 2,
          height: adjustedHeight,
        }}
      ></div>
      <div
        className="absolute bg-black bg-opacity-80"
        style={{
          right: 0,
          top: (growContainerSize.height - adjustedHeight) / 2,
          width: (growContainerSize.width - adjustedWidth) / 2,
          height: adjustedHeight,
        }}
      ></div>
      <div
        className="border-blue-500 absolute border-2"
        style={{
          left: (growContainerSize.width - adjustedWidth) / 2,
          top: (growContainerSize.height - adjustedHeight) / 2,
          width: adjustedWidth,
          height: adjustedHeight,
        }}
      ></div>
    </>
  );
}
