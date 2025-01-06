import { useAtom } from "jotai";
import { useRef, useEffect } from "react";
import { cameraStreamAtom, mediaSizeAtom, creatorCameraVideoElementAtom } from "../../atoms";


export function CameraStream() {
    const [stream] = useAtom(cameraStreamAtom);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [mediaSize, setMediaSize] = useAtom(mediaSizeAtom);
    const [cameraVideoElement, setCameraVideoElement] = useAtom(
        creatorCameraVideoElementAtom
    );

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
                transform: "scaleX(-1)",
                width: mediaSize.width,
                height: mediaSize.height,
            }} />
    ) : null;
}

