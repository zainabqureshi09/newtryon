import { create } from 'zustand';

export interface FaceLandmarks {
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  leftTemple: { x: number; y: number };
  rightTemple: { x: number; y: number };
  noseBridge: { x: number; y: number };
}

interface TryOnState {
  isActive: boolean;
  cameraStream: MediaStream | null;
  landmarks: FaceLandmarks | null;
  selectedFrame: string | null;
  framePosition: { x: number; y: number; scale: number; rotation: number };
  pupillaryDistance: number;
  
  setActive: (active: boolean) => void;
  setCameraStream: (stream: MediaStream | null) => void;
  setLandmarks: (landmarks: FaceLandmarks | null) => void;
  setSelectedFrame: (frameId: string | null) => void;
  updateFramePosition: (position: Partial<typeof this.framePosition>) => void;
  setPupillaryDistance: (pd: number) => void;
  resetPosition: () => void;
}

export const useTryOnStore = create<TryOnState>((set) => ({
  isActive: false,
  cameraStream: null,
  landmarks: null,
  selectedFrame: null,
  framePosition: { x: 0, y: 0, scale: 1, rotation: 0 },
  pupillaryDistance: 63, // Average PD in mm
  
  setActive: (active) => set({ isActive: active }),
  setCameraStream: (stream) => set({ cameraStream: stream }),
  setLandmarks: (landmarks) => set({ landmarks }),
  setSelectedFrame: (frameId) => set({ selectedFrame: frameId }),
  updateFramePosition: (position) => 
    set((state) => ({ 
      framePosition: { ...state.framePosition, ...position } 
    })),
  setPupillaryDistance: (pd) => set({ pupillaryDistance: pd }),
  resetPosition: () => 
    set({ framePosition: { x: 0, y: 0, scale: 1, rotation: 0 } }),
}));