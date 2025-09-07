import { useEffect, useRef } from "react";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import "@tensorflow/tfjs-backend-webgl";

export default function TryOn({ glassesUrl }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    async function setupCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    }

    async function runFaceTracking() {
      const model = await faceLandmarksDetection.load(
        faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
      );

      const ctx = canvasRef.current.getContext("2d");
      const glasses = new Image();
      glasses.src = glassesUrl;

      async function detect() {
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

        const predictions = await model.estimateFaces({ input: videoRef.current });
        if (predictions.length > 0) {
          const keypoints = predictions[0].scaledMesh;

          // Eyes ke points
          const leftEye = keypoints[33];   // left eye corner
          const rightEye = keypoints[263]; // right eye corner

          // Width calculate
          const glassesWidth = Math.abs(rightEye[0] - leftEye[0]) * 2;
          const glassesHeight = glassesWidth / 2;

          // Glasses draw
          ctx.drawImage(
            glasses,
            leftEye[0] - glassesWidth / 2,
            leftEye[1] - glassesHeight / 2,
            glassesWidth * 2,
            glassesHeight
          );
        }

        requestAnimationFrame(detect);
      }

      detect();
    }

    setupCamera().then(runFaceTracking);
  }, [glassesUrl]);

  return (
    <div className="tryon-container">
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width="640" height="480" />
    </div>
  );
}
