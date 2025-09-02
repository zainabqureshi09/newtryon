import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CameraCapture } from '@/components/tryon/CameraCapture';
import { FrameCanvas } from '@/components/tryon/FrameCanvas';
import { useTryOnStore } from '@/store/tryon';
import { 
  Download, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Move, 
  RotateCw,
  ArrowLeft 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const availableFrames = [
  { id: 'aviator', name: 'Aviator Classic', image: '/images/frame-aviator.jpg' },
  { id: 'wayframe', name: 'Wayframe Modern', image: '/images/frame-wayframe.jpg' },
  { id: 'cateye', name: 'Cat Eye Elegant', image: '/images/frame-cateye.jpg' },
];

export default function TryOn() {
  const { 
    landmarks, 
    setLandmarks, 
    selectedFrame, 
    setSelectedFrame, 
    framePosition,
    updateFramePosition,
    resetPosition,
    pupillaryDistance,
    setPupillaryDistance 
  } = useTryOnStore();

  const [isCapturing, setIsCapturing] = useState(false);

  const handleLandmarksDetected = (detectedLandmarks: any) => {
    setLandmarks(detectedLandmarks);
  };

  const handleFrameSelect = (frameId: string) => {
    setSelectedFrame(frameId);
    resetPosition();
  };

  const handleScaleChange = (delta: number) => {
    updateFramePosition({ 
      scale: Math.max(0.5, Math.min(2, framePosition.scale + delta)) 
    });
  };

  const handleRotationChange = (delta: number) => {
    updateFramePosition({ 
      rotation: framePosition.rotation + delta 
    });
  };

  const captureSnapshot = () => {
    // In real implementation, this would capture the combined video + frame overlay
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      // Download logic here
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Virtual Try-On</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                onClick={captureSnapshot}
                variant="hero"
                disabled={!selectedFrame || isCapturing}
              >
                <Download className="w-4 h-4 mr-2" />
                {isCapturing ? 'Capturing...' : 'Save Photo'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Try-On Area */}
          <div className="lg:col-span-2">
            <div className="relative">
              <CameraCapture onLandmarksDetected={handleLandmarksDetected} />
              
              {/* Frame Overlay */}
              {selectedFrame && landmarks && (
                <div className="absolute inset-0 pointer-events-none">
                  <FrameCanvas
                    landmarks={landmarks}
                    frameModel={selectedFrame}
                    className="w-full h-full"
                  />
                </div>
              )}
            </div>

            {/* Transform Controls */}
            {selectedFrame && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 glass rounded-2xl"
              >
                <h3 className="text-lg font-semibold mb-4">Adjust Fit</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Scale</p>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleScaleChange(-0.1)}
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleScaleChange(0.1)}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Rotate</p>
                    <div className="flex gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRotationChange(-5)}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRotationChange(5)}
                      >
                        <RotateCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Move</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Move className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Reset</p>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={resetPosition}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Pupillary Distance */}
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">
                    Pupillary Distance (PD): {pupillaryDistance}mm
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="80"
                    value={pupillaryDistance}
                    onChange={(e) => setPupillaryDistance(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>50mm</span>
                    <span>80mm</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Frame Selection Sidebar */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Select Frame</h2>
              <div className="space-y-3">
                {availableFrames.map((frame) => (
                  <motion.button
                    key={frame.id}
                    onClick={() => handleFrameSelect(frame.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      selectedFrame === frame.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Frame Preview</span>
                      </div>
                    </div>
                    <h3 className="font-medium text-left">{frame.name}</h3>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="p-6 bg-muted/50 rounded-xl">
              <h3 className="font-semibold mb-3">How to Use</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Position your face in the camera view</li>
                <li>• Select a frame from the sidebar</li>
                <li>• Use controls to adjust fit</li>
                <li>• Drag the frame to reposition</li>
                <li>• Click "Save Photo" when ready</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}