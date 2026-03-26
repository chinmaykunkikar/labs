"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CONFIG } from "./config";
import { useFramePreloader } from "./use-frame-preloader";
import { findNearestFrame } from "./preloader";
import { FrameCanvas } from "./FrameCanvas";
import { TextOverlays } from "./TextOverlays";
import { LoadingScreen } from "./LoadingScreen";
import type { FrameCanvasHandle } from "./FrameCanvas";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Maps scroll progress (0–1) to frame progress (0–1) with deceleration.
 * First 75% of scroll plays ~88% of frames (nearly linear).
 * Last 25% of scroll stretches the remaining ~12% of frames (ease-out).
 * The result: frames naturally slow down as the sequence ends.
 */
function easeFrameProgress(t: number): number {
  const knee = 0.75;
  const kneeOutput = 0.88;

  if (t <= knee) {
    return (t / knee) * kneeOutput;
  }

  const tail = (t - knee) / (1 - knee);
  const eased = 1 - (1 - tail) * (1 - tail);
  return kneeOutput + (1 - kneeOutput) * eased;
}

export function ScrollFrameHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<FrameCanvasHandle>(null);
  const lastFrameRef = useRef(-1);

  const { progress: loadProgress, framesRef, ready } = useFramePreloader();

  useGSAP(
    () => {
      if (!ready || !triggerRef.current || !heroRef.current) return;

      gsap.to(".loading-screen", {
        opacity: 0,
        scale: 1.05,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete() {
          gsap.set(".loading-screen", { display: "none" });
        },
      });

      const frames = framesRef.current;
      if (frames[0]) {
        canvasRef.current?.draw(frames[0] as ImageBitmap);
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: heroRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: CONFIG.SCRUB_DURATION,
          onUpdate(self) {
            const easedProgress = easeFrameProgress(self.progress);
            const index = Math.round(
              easedProgress * (CONFIG.TOTAL_FRAMES - 1),
            );
            if (index === lastFrameRef.current) return;
            lastFrameRef.current = index;

            const currentFrames = framesRef.current;
            const frame =
              currentFrames[index] ??
              findNearestFrame(currentFrames, index);
            if (frame) {
              canvasRef.current?.draw(frame as ImageBitmap);
            }
          },
        },
      });

      CONFIG.TEXT_SEGMENTS.forEach((segment) => {
        const panelSelector = `.${segment.key}-panel`;
        const headlineSelector = `.${segment.key}-headline span`;
        const bodySelector = `.${segment.key}-body span`;

        const enterStart = segment.start;
        const enterEnd = enterStart + (segment.end - segment.start) * 0.3;
        const exitStart = segment.start + (segment.end - segment.start) * 0.7;
        const exitEnd = segment.end;

        tl.fromTo(
          panelSelector,
          { opacity: 0 },
          { opacity: 1, duration: enterEnd - enterStart, ease: "none" },
          enterStart,
        );

        tl.fromTo(
          headlineSelector,
          { opacity: 0, y: 30, filter: "blur(4px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.03,
            duration: enterEnd - enterStart,
            ease: "power2.out",
          },
          enterStart,
        );

        tl.fromTo(
          bodySelector,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.015,
            duration: enterEnd - enterStart,
            ease: "power2.out",
          },
          enterStart + (enterEnd - enterStart) * 0.4,
        );

        tl.to(
          panelSelector,
          { opacity: 0, duration: exitEnd - exitStart, ease: "none" },
          exitStart,
        );

        tl.to(
          headlineSelector,
          {
            opacity: 0,
            y: -20,
            filter: "blur(4px)",
            stagger: 0.02,
            duration: exitEnd - exitStart,
            ease: "power2.in",
          },
          exitStart,
        );

        tl.to(
          bodySelector,
          {
            opacity: 0,
            y: -15,
            stagger: 0.01,
            duration: exitEnd - exitStart,
            ease: "power2.in",
          },
          exitStart,
        );
      });

    },
    { scope: containerRef, dependencies: [ready] },
  );

  return (
    <div ref={containerRef}>
      <div
        ref={triggerRef}
        style={{
          height: `${CONFIG.SCROLL_HEIGHT_MULTIPLIER * 100}vh`,
        }}
      >
        <div
          ref={heroRef}
          className="relative overflow-hidden bg-black"
          style={{ height: "100dvh" }}
        >
          <FrameCanvas ref={canvasRef} />
          <TextOverlays />
          <LoadingScreen progress={loadProgress} />
        </div>
      </div>
    </div>
  );
}
