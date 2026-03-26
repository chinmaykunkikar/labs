import { CONFIG } from "./config";

export function buildFrameUrl(index: number): string {
  const padded = String(index + 1).padStart(CONFIG.FRAME_DIGITS, "0");
  return `${CONFIG.FRAME_PATH_PREFIX}${padded}${CONFIG.FRAME_EXTENSION}`;
}

async function loadFrame(
  url: string,
  signal: AbortSignal,
): Promise<ImageBitmap> {
  const response = await fetch(url, { signal });
  const blob = await response.blob();
  return createImageBitmap(blob);
}

async function loadBatch(
  urls: ReadonlyArray<{ index: number; url: string }>,
  frames: Array<ImageBitmap | null>,
  onProgress: (loaded: number) => void,
  signal: AbortSignal,
  concurrency: number,
): Promise<void> {
  let cursor = 0;
  let loaded = 0;

  async function next(): Promise<void> {
    while (cursor < urls.length) {
      if (signal.aborted) return;
      const current = urls[cursor];
      cursor += 1;
      try {
        const bitmap = await loadFrame(current.url, signal);
        frames[current.index] = bitmap;
        loaded += 1;
        onProgress(loaded);
      } catch (err) {
        if (signal.aborted) return;
        throw err;
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, urls.length) }, () =>
    next(),
  );
  await Promise.all(workers);
}

export async function preloadFrames(
  totalFrames: number,
  onProgress: (loaded: number, total: number) => void,
  signal: AbortSignal,
  frames: Array<ImageBitmap | null>,
): Promise<void> {

  const priorityUrls = Array.from(
    { length: CONFIG.PRIORITY_FRAME_COUNT },
    (_, i) => ({
      index: i,
      url: buildFrameUrl(i),
    }),
  );

  let totalLoaded = 0;

  await loadBatch(
    priorityUrls,
    frames,
    (batchLoaded) => {
      totalLoaded = batchLoaded;
      onProgress(totalLoaded, totalFrames);
    },
    signal,
    3,
  );

  const remainingUrls = Array.from(
    { length: totalFrames - CONFIG.PRIORITY_FRAME_COUNT },
    (_, i) => {
      const index = i + CONFIG.PRIORITY_FRAME_COUNT;
      return { index, url: buildFrameUrl(index) };
    },
  );

  await loadBatch(
    remainingUrls,
    frames,
    (batchLoaded) => {
      totalLoaded = CONFIG.PRIORITY_FRAME_COUNT + batchLoaded;
      onProgress(totalLoaded, totalFrames);
    },
    signal,
    CONFIG.PRELOAD_BATCH_SIZE,
  );
}

export function findNearestFrame(
  frames: ReadonlyArray<ImageBitmap | null>,
  index: number,
): ImageBitmap | null {
  for (let i = index; i >= 0; i--) {
    if (frames[i]) return frames[i];
  }
  for (let i = index + 1; i < frames.length; i++) {
    if (frames[i]) return frames[i];
  }
  return null;
}
