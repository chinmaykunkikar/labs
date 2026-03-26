"use client";

interface LoadingScreenProps {
  readonly progress: number;
}

export function LoadingScreen({ progress }: LoadingScreenProps) {
  const percent = Math.round(progress * 100);

  return (
    <div className="loading-screen absolute inset-0 z-10 flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="mb-4 text-sm font-light tracking-widest text-white/40 uppercase">
          Loading frames
        </div>
        <div className="text-6xl font-bold tabular-nums text-white">
          {percent}%
        </div>
        <div className="mx-auto mt-6 h-px w-48 overflow-hidden bg-white/10">
          <div
            className="h-full bg-white/60 transition-[width] duration-200 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
