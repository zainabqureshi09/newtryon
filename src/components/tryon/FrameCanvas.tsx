import { useRef, useEffect } from "react";
import { useTryOnStore, FaceLandmarks } from "@/store/tryon";

interface FrameCanvasProps {
  landmarks: FaceLandmarks | null;
  frameModel: string;
  className?: string;
}

// Frame fitting calculations
const calculateFrameTransform = (landmarks: FaceLandmarks) => {
  if (!landmarks) return null;

  // Calculate eye distance in pixels
  const eyeDistance = Math.sqrt(
    Math.pow(landmarks.rightEye.x - landmarks.leftEye.x, 2) +
      Math.pow(landmarks.rightEye.y - landmarks.leftEye.y, 2)
  );

  // Reference frame eye distance (in pixels from a reference model)
  const referenceEyeDistance = 60; // adjust this constant for better scaling
  const scale = eyeDistance / referenceEyeDistance;

  // Center between eyes
  const centerX = (landmarks.leftEye.x + landmarks.rightEye.x) / 2;
  const centerY = (landmarks.leftEye.y + landmarks.rightEye.y) / 2;

  return {
    x: centerX,
    y: centerY - 10, // lift slightly
    scale: scale * 1.1,
    rotation: 0,
  };
};

export function FrameCanvas({ landmarks, frameModel, className }: FrameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { framePosition, updateFramePosition } = useTryOnStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (landmarks) {
        const autoTransform = calculateFrameTransform(landmarks);
        if (autoTransform) {
          const finalTransform = {
            x: autoTransform.x + framePosition.x,
            y: autoTransform.y + framePosition.y,
            scale: autoTransform.scale * framePosition.scale,
            rotation: autoTransform.rotation + framePosition.rotation,
          };
          drawFrame(ctx, finalTransform);
        }

        if (process.env.NODE_ENV === "development") {
          drawLandmarks(ctx, landmarks);
        }
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [landmarks, frameModel, framePosition]);

  const drawFrame = (ctx: CanvasRenderingContext2D, transform: any) => {
    ctx.save();

    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);
    ctx.rotate((transform.rotation * Math.PI) / 180);

    ctx.strokeStyle = "#87CEEB"; // sky blue outline
    ctx.lineWidth = 3;
    ctx.fillStyle = "rgba(128,0,128,0.2)"; // purple tint

    // Left lens
    ctx.beginPath();
    ctx.ellipse(-25, 0, 22, 16, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Right lens
    ctx.beginPath();
    ctx.ellipse(25, 0, 22, 16, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Bridge
    ctx.beginPath();
    ctx.moveTo(-8, -6);
    ctx.lineTo(8, -6);
    ctx.stroke();

    // Temples
    ctx.beginPath();
    ctx.moveTo(-47, -5);
    ctx.lineTo(-65, -10);
    ctx.moveTo(47, -5);
    ctx.lineTo(65, -10);
    ctx.stroke();

    ctx.restore();
  };

  const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: FaceLandmarks) => {
    ctx.fillStyle = "#ff007f"; // pink debug points
    Object.values(landmarks).forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    const startPos = { ...framePosition };

    const handleMouseMove = (ev: MouseEvent) => {
      const deltaX = ev.clientX - rect.left - startX;
      const deltaY = ev.clientY - rect.top - startY;

      updateFramePosition({
        x: startPos.x + deltaX,
        y: startPos.y + deltaY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grab";
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grabbing";
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className={className}
      width={640}
      height={480}
      onMouseDown={handleMouseDown}
      style={{ cursor: "grab", backgroundColor: "transparent" }}
    />
  );
}
