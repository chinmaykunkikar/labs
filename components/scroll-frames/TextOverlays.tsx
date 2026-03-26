"use client";

import { CONFIG } from "./config";

function splitIntoWords(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

interface TextPanelProps {
  readonly segmentKey: string;
  readonly headline: string;
  readonly body: string;
}

function TextPanel({ segmentKey, headline, body }: TextPanelProps) {
  const headlineWords = splitIntoWords(headline);
  const bodyWords = splitIntoWords(body);

  return (
    <div
      className={`text-panel absolute inset-0 flex items-center justify-center ${segmentKey}-panel`}
      style={{ opacity: 0 }}
    >
      <div className="max-w-2xl px-6 text-center">
        <h2 className={`${segmentKey}-headline mb-4 text-5xl font-bold tracking-tight text-white md:text-7xl`}>
          {headlineWords.map((word, i) => (
            <span
              key={i}
              className="inline-block"
              style={{ opacity: 0, transform: "translateY(30px)", filter: "blur(4px)" }}
            >
              {word}
              {i < headlineWords.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </h2>
        <p className={`${segmentKey}-body text-lg font-light text-white/70 md:text-xl`}>
          {bodyWords.map((word, i) => (
            <span
              key={i}
              className="inline-block"
              style={{ opacity: 0, transform: "translateY(20px)" }}
            >
              {word}
              {i < bodyWords.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export function TextOverlays() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {CONFIG.TEXT_SEGMENTS.map((segment) => (
        <TextPanel
          key={segment.key}
          segmentKey={segment.key}
          headline={segment.headline}
          body={segment.body}
        />
      ))}
    </div>
  );
}
