"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { drawFrame } from "./frame-renderer";

export interface FrameCanvasHandle {
  draw: (frame: ImageBitmap) => void;
}

export const FrameCanvas = forwardRef<FrameCanvasHandle>(
  function FrameCanvas(_, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const displaySizeRef = useRef({ width: 0, height: 0 });

    const setupCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = window.innerWidth;
      const displayHeight = window.innerHeight;

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctxRef.current = ctx;
      }

      displaySizeRef.current = { width: displayWidth, height: displayHeight };
    }, []);

    useEffect(() => {
      setupCanvas();

      const observer = new ResizeObserver(() => {
        setupCanvas();
      });
      observer.observe(document.body);

      return () => {
        observer.disconnect();
      };
    }, [setupCanvas]);

    useImperativeHandle(ref, () => ({
      draw(frame: ImageBitmap) {
        const ctx = ctxRef.current;
        if (!ctx) return;
        const { width, height } = displaySizeRef.current;
        drawFrame(ctx, frame, width, height);
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
    );
  },
);
