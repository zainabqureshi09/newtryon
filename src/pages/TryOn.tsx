import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

type Props = {
  glassesOverlay: string;    // full URL to transparent PNG (from Strapi)
  boxWidth?: number;     // container width in px (optional)
  boxHeight?: number;    // container height in px (optional)
};

export default function TryOnAdvanced({
  tryOnImage,
  boxWidth = 640,
  boxHeight = 480,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const uploadImgRef = useRef<HTMLImageElement | null>(null);
  const overlayRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [mode, setMode] = useState<"camera" | "upload">("camera");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [detectParams, setDetectParams] = useState({
    inputSize: 320,         // tinyFaceDetector input size (320, 416, 512 etc.)
    scoreThreshold: 0.5,    // tinyFaceDetector threshold
  });
  const [frozen, setFrozen] = useState(false); // snapshot freeze in camera mode

  // ---------- model loading ----------
  useEffect(() => {
    const MODEL_URL = "/models"; // ensure your models exist in public/models
    setLoadingMessage("Loading face models...");
    (async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        setLoadingMessage(null);
      } catch (err) {
        console.error("Model load error:", err);
        setLoadingMessage("Failed to load face models. Check /models folder.");
      }
    })();
  }, []);

  // ---------- enumerate video devices ----------
  useEffect(() => {
    async function getDevices() {
      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        setDevices(list.filter((d) => d.kind === "videoinput"));
        // if first available, select default
        const v = list.find((d) => d.kind === "videoinput");
        if (v && !selectedDeviceId) setSelectedDeviceId(v.deviceId);
      } catch (err) {
        console.warn("Could not enumerate devices", err);
      }
    }
    getDevices();
  }, [selectedDeviceId]);

  // ---------- helpers ----------
  const getTinyOptions = () =>
    new faceapi.TinyFaceDetectorOptions({
      inputSize: detectParams.inputSize,
      scoreThreshold: detectParams.scoreThreshold,
    });

  // ---------- start camera ----------
  const startCamera = async (deviceId?: string) => {
    stopCamera(); // stop previous if any
    try {
      const constraints: MediaStreamConstraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : { facingMode: "user" },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setStreamActive(true);
      setFrozen(false);
      // start detection loop when models ready and video playing
      requestAnimationFrame(detectLoop);
    } catch (err) {
      console.error("camera start error", err);
      setLoadingMessage("Camera access denied or unavailable.");
      setStreamActive(false);
    }
  };

  // ---------- stop camera ----------
  const stopCamera = () => {
    if (!videoRef.current) return;
    const stream = videoRef.current.srcObject as MediaStream | null;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    videoRef.current.srcObject = null;
    setStreamActive(false);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  // ---------- detection & overlay logic ----------
  const positionOverlay = (centerX: number, centerY: number, angleDeg: number, eyeDist: number, sourceWidth: number, sourceHeight: number) => {
    const ov = overlayRef.current;
    if (!ov) return;
    const glassesWidth = eyeDist * 2.4; // tweak factor
    ov.style.width = `${glassesWidth}px`;
    // Convert coordinates: faceapi returns coordinates relative to displayed element (we pass displaySize)
    ov.style.left = `${centerX}px`;
    // shift vertically a bit so glasses sit on nose bridge
    ov.style.top = `${centerY - eyeDist * 0.28}px`;
    ov.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
    ov.style.transformOrigin = "center center";
  };

  // Single detection on image (upload mode)
  const detectOnImage = async (imgEl: HTMLImageElement) => {
    if (!modelsLoaded) {
      setLoadingMessage("Models loading...");
      return;
    }
    setLoadingMessage("Detecting face...");
    const detection = await faceapi.detectSingleFace(imgEl, getTinyOptions()).withFaceLandmarks();
    if (!detection) {
      setLoadingMessage("Face not detected. Try clearer/front photo.");
      return;
    }
    const displaySize = { width: imgEl.offsetWidth, height: imgEl.offsetHeight };
    const resized = faceapi.resizeResults(detection, displaySize);
    const leftEye = resized.landmarks.getLeftEye();
    const rightEye = resized.landmarks.getRightEye();
    const avg = (pts: faceapi.Point[]) => pts.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
    const left = avg(leftEye); left.x /= leftEye.length; left.y /= leftEye.length;
    const right = avg(rightEye); right.x /= rightEye.length; right.y /= rightEye.length;
    const center = { x: (left.x + right.x) / 2, y: (left.y + right.y) / 2 };
    const dx = right.x - left.x; const dy = right.y - left.y;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const eyeDist = Math.hypot(dx, dy);
    positionOverlay(center.x, center.y, angle, eyeDist, displaySize.width, displaySize.height);
    setLoadingMessage(null);
  };

  // Detection loop for camera (using requestAnimationFrame)
  const detectLoop = async () => {
    if (!modelsLoaded || !videoRef.current || mode !== "camera" || frozen) {
      rafRef.current = requestAnimationFrame(detectLoop);
      return;
    }
    try {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        rafRef.current = requestAnimationFrame(detectLoop);
        return;
      }
      const detection = await faceapi.detectSingleFace(videoRef.current, getTinyOptions()).withFaceLandmarks();
      if (detection) {
        const displaySize = { width: videoRef.current.offsetWidth, height: videoRef.current.offsetHeight };
        const resized = faceapi.resizeResults(detection, displaySize);
        const leftEye = resized.landmarks.getLeftEye();
        const rightEye = resized.landmarks.getRightEye();
        const avg = (pts: faceapi.Point[]) => pts.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
        const left = avg(leftEye); left.x /= leftEye.length; left.y /= leftEye.length;
        const right = avg(rightEye); right.x /= rightEye.length; right.y /= rightEye.length;
        const center = { x: (left.x + right.x) / 2, y: (left.y + right.y) / 2 };
        const dx = right.x - left.x; const dy = right.y - left.y;
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const eyeDist = Math.hypot(dx, dy);
        positionOverlay(center.x, center.y, angle, eyeDist, displaySize.width, displaySize.height);
      }
    } catch (err) {
      // detection error - ignore silently but log for dev
      // console.debug("detectLoop err", err);
    } finally {
      rafRef.current = requestAnimationFrame(detectLoop);
    }
  };

  // ---------- UI callbacks ----------
  const onDeviceChange = async (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    await startCamera(deviceId);
  };

  const onUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUserImage(url);
    // clear any previous overlay pos
    if (overlayRef.current) {
      overlayRef.current.style.left = "-9999px";
    }
    setTimeout(() => {
      if (uploadImgRef.current) detectOnImage(uploadImgRef.current);
    }, 100); // wait for image to render
    setMode("upload");
    stopCamera();
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    // draw current video frame to canvas and use as userImage (freeze)
    const v = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = v.videoWidth || v.offsetWidth;
    canvas.height = v.videoHeight || v.offsetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setUserImage(dataUrl);
    setMode("upload");
    setFrozen(true);
    // detect on this captured image
    setTimeout(() => {
      if (uploadImgRef.current) detectOnImage(uploadImgRef.current);
    }, 100);
    // stop camera stream but keep overlay working on the captured image
    stopCamera();
  };

  const resumeFromSnapshot = () => {
    setFrozen(false);
    setUserImage(null);
    setMode("camera");
    if (selectedDeviceId) startCamera(selectedDeviceId);
    else startCamera();
  };

  // cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When switching to camera mode, start camera
  useEffect(() => {
    if (mode === "camera") {
      startCamera(selectedDeviceId || undefined);
    } else {
      // if switching to upload, ensure camera stopped
      stopCamera();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedDeviceId, modelsLoaded]);

  // ---------- render ----------
  return (
    <div className="max-w-[900px] mx-auto space-y-4">
      {/* header / controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode("camera")}
            className={`px-3 py-1 rounded ${mode === "camera" ? "bg-pink-600 text-white" : "bg-white border"}`}
          >
            Camera
          </button>
          <button
            onClick={() => {
              setMode("upload");
              setUserImage(null);
              stopCamera();
            }}
            className={`px-3 py-1 rounded ${mode === "upload" ? "bg-pink-600 text-white" : "bg-white border"}`}
          >
            Upload Photo
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 mr-2">Input size</label>
          <input
            type="range"
            min={128}
            max={640}
            step={64}
            value={detectParams.inputSize}
            onChange={(e) => setDetectParams((d) => ({ ...d, inputSize: Number(e.target.value) }))}
            className="w-36"
          />
          <span className="text-sm ml-2">{detectParams.inputSize}px</span>
        </div>
      </div>

      {/* device select + actions */}
      {mode === "camera" && (
        <div className="flex items-center gap-2">
          <select
            value={selectedDeviceId || ""}
            onChange={(e) => onDeviceChange(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Default camera</option>
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Camera ${d.deviceId}`}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (!streamActive) startCamera(selectedDeviceId || undefined);
              else {
                takeSnapshot();
              }
            }}
            className="px-3 py-1 rounded bg-sky-600 text-white"
          >
            {streamActive ? "Snapshot" : "Start Camera"}
          </button>

          {streamActive && (
            <button
              onClick={() => {
                stopCamera();
                setStreamActive(false);
              }}
              className="px-3 py-1 rounded bg-gray-200"
            >
              Stop
            </button>
          )}

          {frozen && (
            <button onClick={resumeFromSnapshot} className="px-3 py-1 rounded bg-green-500 text-white">
              Resume Live
            </button>
          )}
        </div>
      )}

      {/* main try-on box */}
      <div style={{ width: boxWidth, height: boxHeight }} className="mx-auto relative bg-gray-100 rounded-lg overflow-hidden">
        {/* video (camera mode) */}
        <video
          ref={videoRef}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: mode === "camera" ? "block" : "none" }}
          playsInline
          muted
        />

        {/* upload image */}
        <img
          ref={uploadImgRef}
          src={userImage || undefined}
          alt="uploaded"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: mode === "upload" && userImage ? "block" : "none" }}
          onLoad={() => {
            // detect when upload image loads
            if (uploadImgRef.current) detectOnImage(uploadImgRef.current);
          }}
        />

        {/* overlay image (absolute) */}
        <img
          ref={overlayRef}
          src={tryOnImage}
          alt="overlay"
          style={{
            position: "absolute",
            left: "-9999px",
            top: "-9999px",
            pointerEvents: "none",
            userSelect: "none",
            transformOrigin: "center center",
            willChange: "transform, left, top, width",
          }}
        />
      </div>

      {/* upload input (upload mode) */}
      {mode === "upload" && (
        <div className="text-center">
          <input type="file" accept="image/*" onChange={onUploadFile} />
          <p className="text-sm text-gray-500 mt-2">Use a front-facing, well-lit photo for best results.</p>
        </div>
      )}

      {/* status */}
      <div>
        {loadingMessage && <p className="text-sm text-red-500">{loadingMessage}</p>}
        {!modelsLoaded && <p className="text-sm text-gray-500">Loading face models...</p>}
      </div>
    </div>
  );
}
