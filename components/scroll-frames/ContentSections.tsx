export function ContentSections() {
  return (
    <div className="bg-black">
      <section className="mx-auto max-w-3xl px-6 py-32">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          How it works
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-white/60">
          The hero you just scrolled through renders a sequence of 120 image
          frames on an HTML canvas element. No video element is involved. Each
          frame is a pre-extracted WebP image loaded into an ImageBitmap for
          off-main-thread decoding.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-white/60">
          GSAP ScrollTrigger pins the canvas to the viewport and maps scroll
          progress to a frame index. The scrub parameter smoothly interpolates
          between positions, so fast scrolling produces fluid transitions
          instead of jarring jumps.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-32">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Performance
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-white/60">
          Frames are preloaded in two phases: the first 15 frames load
          immediately (priority batch), then the remaining 105 load in
          concurrent batches of 6. The canvas draws imperatively through a ref,
          bypassing React reconciliation entirely on the hot path. Redundant
          draws are skipped when the frame index has not changed.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-32">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Text choreography
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-white/60">
          Text overlays are DOM elements positioned over the canvas. Each word
          is wrapped in a span and animated with GSAP stagger, producing a
          word-by-word reveal with blur-to-sharp transitions. The text timeline
          runs on the same ScrollTrigger instance as the frame sequencer,
          keeping everything in perfect sync.
        </p>
      </section>

      <footer className="border-t border-white/10 py-16 text-center text-sm text-white/30">
        Scroll-driven frame sequencer experiment
      </footer>
    </div>
  );
}
