"use client";

import { useEffect, useRef, useState } from "react";
import { preloadFrames } from "./preloader";
import { CONFIG } from "./config";

interface PreloaderState {
  readonly progress: number;
  readonly ready: boolean;
  readonly error: string | null;
}

export interface FramePreloader extends PreloaderState {
  readonly framesRef: React.RefObject<Array<ImageBitmap | null>>;
}

export function useFramePreloader(): FramePreloader {
  const framesRef = useRef<Array<ImageBitmap | null>>(
    Array.from({ length: CONFIG.TOTAL_FRAMES }, () => null),
  );
  const [state, setState] = useState<PreloaderState>({
    progress: 0,
    ready: false,
    error: null,
  });
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const controller = new AbortController();

    preloadFrames(
      CONFIG.TOTAL_FRAMES,
      (loaded, total) => {
        setState((prev) => ({
          ...prev,
          progress: loaded / total,
          ready: prev.ready || loaded >= CONFIG.PRIORITY_FRAME_COUNT,
        }));
      },
      controller.signal,
      framesRef.current,
    )
      .then(() => {
        setState((prev) => ({ ...prev, progress: 1, ready: true }));
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to load frames",
        }));
      });

    return () => {
      controller.abort();
    };
  }, []);

  return { ...state, framesRef };
}
