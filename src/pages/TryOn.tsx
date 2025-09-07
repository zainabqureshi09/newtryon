import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function TryOnPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { overlayImage } = location.state || {};
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    const video = document.getElementById("video") as HTMLVideoElement;
    if (video) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video.play();
            setCameraReady(true);
          };
        })
        .catch(err => console.error("Camera error:", err));
    }
  }, []);

  if (!overlayImage) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p>No glasses selected for Try-On.</p>
        <button
          className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      <video
        id="video"
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />
      {cameraReady && (
        <img
          src={overlayImage}
          alt="glasses"
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-40 opacity-90"
        />
      )}
    </div>
  );
}
