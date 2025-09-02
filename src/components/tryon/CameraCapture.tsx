import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTryOnStore } from '@/store/tryon';
import { Camera, CameraOff, RotateCcw, Upload } from 'lucide-react';

interface CameraCaptureProps {
  onLandmarksDetected: (landmarks: any) => void;
}

export function CameraCapture({ onLandmarksDetected }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { cameraStream, setCameraStream, setActive } = useTryOnStore();
  const [isLoading, setIsLoading] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasCamera, setHasCamera] = useState(true);

  // Ensure video element uses cameraStream when it changes
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (cameraStream) {
      try {
        // attach stream and play
        v.srcObject = cameraStream;
        v.play().catch(() => {
          /* ignore play errors (autoplay policy) */
        });
      } catch (err) {
        console.error('Error attaching stream to video element', err);
      }
    } else {
      // detach
      v.pause();
      try {
        v.srcObject = null;
      } catch {}
    }
  }, [cameraStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // stop any active camera on unmount
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
        setCameraStream(null);
      }
      setActive(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // Detection + drawing loop for video stream or video file
  useEffect(() => {
    let rafId: number | null = null;
    const v = videoRef.current;
    const c = canvasRef.current;

    const drawLandmarks = (landmarks: any) => {
      if (!c) return;
      const ctx = c.getContext('2d');
      if (!ctx) return;

      // Clear
      ctx.clearRect(0, 0, c.width, c.height);

      // Draw simple markers
      const drawPoint = (pt: { x: number; y: number }, color = 'rgba(56,189,248,0.95)') => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, Math.max(4, Math.round(Math.min(c.width, c.height) * 0.01)), 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      };

      // Optional lines
      const drawLine = (a: any, b: any, color = 'rgba(236,72,153,0.55)') => {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      };

      // Draw points if exist
      if (landmarks) {
        if (landmarks.leftEye) drawPoint(landmarks.leftEye);
        if (landmarks.rightEye) drawPoint(landmarks.rightEye);
        if (landmarks.noseBridge) drawPoint(landmarks.noseBridge, 'rgba(46,2,109,0.95)');
        if (landmarks.leftTemple && landmarks.rightTemple) {
          drawLine(landmarks.leftTemple, landmarks.rightTemple);
        }
      }
    };

    const detectAndDraw = () => {
      const video = v;
      const canvas = c;
      if (!video || !canvas) {
        rafId = requestAnimationFrame(detectAndDraw);
        return;
      }

      // Need dimensions to draw correctly
      const vw = video.videoWidth || video.clientWidth;
      const vh = video.videoHeight || video.clientHeight;
      if (vw === 0 || vh === 0) {
        // video not ready yet
        rafId = requestAnimationFrame(detectAndDraw);
        return;
      }

      // ensure canvas matches source resolution for sharp overlay
      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width = vw;
        canvas.height = vh;
        // make canvas visually fill container (css keeps it responsive)
      }

      // NOTE: This is mock detection. Replace with real detector (MediaPipe/TensorFlow) here
      const mockLandmarks = {
        leftEye: { x: Math.round(vw * 0.35), y: Math.round(vh * 0.42) },
        rightEye: { x: Math.round(vw * 0.65), y: Math.round(vh * 0.42) },
        leftTemple: { x: Math.round(vw * 0.12), y: Math.round(vh * 0.45) },
        rightTemple: { x: Math.round(vw * 0.88), y: Math.round(vh * 0.45) },
        noseBridge: { x: Math.round(vw * 0.5), y: Math.round(vh * 0.52) },
      };

      // notify parent
      try {
        onLandmarksDetected(mockLandmarks);
      } catch (err) {
        // swallow callback errors to avoid breaking RAF loop
        console.error(err);
      }

      // draw overlay
      drawLandmarks(mockLandmarks);

      rafId = requestAnimationFrame(detectAndDraw);
    };

    // Start loop only if we have a video source (stream or file)
    if (v && (cameraStream || v.src)) {
      rafId = requestAnimationFrame(detectAndDraw);
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
    // We intentionally depend on cameraStream and onLandmarksDetected
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraStream, onLandmarksDetected]);

  // Start camera; optional explicit mode param so switchCamera can call directly
  const startCamera = async (mode?: 'user' | 'environment') => {
    setIsLoading(true);
    const desiredFacing = mode || facingMode;
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: desiredFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setCameraStream(stream);
      setActive(true);
      setHasCamera(true);
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      // Some errors imply no camera or blocked permission
      if (err && (err.name === 'NotAllowedError' || err.name === 'NotFoundError')) {
        setHasCamera(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      try {
        cameraStream.getTracks().forEach((t) => t.stop());
      } catch (err) {
        console.warn('Error stopping tracks', err);
      }
      setCameraStream(null);
    }
    // Also pause video element
    const v = videoRef.current;
    if (v) {
      try {
        v.pause();
        v.srcObject = null;
        v.removeAttribute('src');
      } catch {}
    }
    setActive(false);
  };

  // Switch camera (front <-> back)
  const switchCamera = async () => {
    const next = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(next);
    // restart camera with explicit mode
    stopCamera();
    // small delay to ensure tracks fully stopped
    setTimeout(() => startCamera(next), 200);
  };

  // Handle file uploads (image or video)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const v = videoRef.current;
    const c = canvasRef.current;
    const url = URL.createObjectURL(file);

    // If image, draw to canvas and run single detection pass
    if (file.type.startsWith('image/')) {
      // Stop any camera
      stopCamera();

      const img = new Image();
      img.src = url;
      img.onload = () => {
        if (!c) return;
        // set canvas to image size
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const ctx = c.getContext('2d');
        if (!ctx) return;
        // draw image full-size
        ctx.drawImage(img, 0, 0, c.width, c.height);

        // mock landmarks based on image size
        const mockLandmarks = {
          leftEye: { x: Math.round(c.width * 0.35), y: Math.round(c.height * 0.42) },
          rightEye: { x: Math.round(c.width * 0.65), y: Math.round(c.height * 0.42) },
          leftTemple: { x: Math.round(c.width * 0.12), y: Math.round(c.height * 0.45) },
          rightTemple: { x: Math.round(c.width * 0.88), y: Math.round(c.height * 0.45) },
          noseBridge: { x: Math.round(c.width * 0.5), y: Math.round(c.height * 0.52) },
        };

        // notify parent & draw simple overlay
        try {
          onLandmarksDetected(mockLandmarks);
        } catch (err) {
          console.error(err);
        }

        // small visual markers
        ctx.fillStyle = 'rgba(56,189,248,0.95)';
        const radius = Math.max(4, Math.round(Math.min(c.width, c.height) * 0.01));
        for (const key of ['leftEye', 'rightEye', 'noseBridge']) {
          const p = (mockLandmarks as any)[key];
          ctx.beginPath();
          ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        setActive(true);
      };
      img.onerror = () => {
        console.error('Failed to load image file');
      };
      return;
    }

    // If video file, play it in the video element (works like camera stream)
    if (file.type.startsWith('video/')) {
      stopCamera();
      if (!v) return;
      v.srcObject = null;
      v.src = url;
      v.onloadeddata = () => {
        v.play().catch(() => {});
        setActive(true);
      };
      v.onerror = (e) => {
        console.error('Error playing uploaded video', e);
      };
      return;
    }

    // fallback: treat as image
    handleFileUpload(event);
  };

  if (!hasCamera) {
    return (
      <div className="text-center p-8">
        <CameraOff className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">Camera not available</h3>
        <p className="text-muted-foreground mb-6">Upload a photo instead to try on frames</p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          onChange={handleFileUpload}
          className="hidden"
        />

        <Button onClick={() => fileInputRef.current?.click()} variant="hero">
          <Upload className="w-4 h-4 mr-2" />
          Upload Photo
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
        {/* Video element (used for live camera or uploaded video) */}
        <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />

        {/* Canvas overlay used for drawing landmarks.
            We keep canvas absolute and sized with element, but canvases internal pixel size
            is managed in the detection/draw logic for sharpness. */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30">
          <div className="flex items-center gap-4">
            {!cameraStream ? (
              <Button onClick={() => startCamera()} disabled={isLoading} variant="hero" size="lg">
                <Camera className="w-5 h-5 mr-2" />
                {isLoading ? 'Starting...' : 'Start Camera'}
              </Button>
            ) : (
              <>
                <Button onClick={stopCamera} variant="glass" size="icon" aria-label="Stop camera">
                  <CameraOff className="w-5 h-5" />
                </Button>

                <Button onClick={switchCamera} variant="glass" size="icon" aria-label="Switch camera">
                  <RotateCcw className="w-5 h-5" />
                </Button>

                <Button
                  onClick={() => {
                    // open file picker to allow uploading photo/video instead
                    fileInputRef.current?.click();
                  }}
                  variant="outline"
                  size="icon"
                  aria-label="Upload"
                >
                  <Upload className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Upload option shown when camera is off */}
      {!cameraStream && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
          <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
          <Button onClick={() => fileInputRef.current?.click()} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Or Upload Photo / Video
          </Button>
        </motion.div>
      )}
    </div>
  );
}
