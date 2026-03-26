export interface TextSegment {
  readonly start: number;
  readonly end: number;
  readonly key: string;
  readonly headline: string;
  readonly body: string;
}

export interface PreloadState {
  readonly progress: number;
  readonly frames: ReadonlyArray<ImageBitmap | null>;
  readonly ready: boolean;
  readonly error: string | null;
}
