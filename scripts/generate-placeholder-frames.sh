#!/bin/bash
# Generates 360 placeholder PNG frames using ffmpeg.
# Three animated gradient layers screen-blended for bold, vivid color transitions.

set -euo pipefail

FRAMES_DIR="$(dirname "$0")/../public/frames"
TOTAL_FRAMES=360
WIDTH=1920
HEIGHT=1080

mkdir -p "$FRAMES_DIR"
rm -f "$FRAMES_DIR"/frame-*.png

echo "Generating $TOTAL_FRAMES placeholder frames at ${WIDTH}x${HEIGHT}..."

ffmpeg -y \
  -f lavfi -i "gradients=s=${WIDTH}x${HEIGHT}:duration=${TOTAL_FRAMES}:speed=0.025:x0=0:y0=0:x1=${WIDTH}:y1=${HEIGHT}:c0=#0f0235:c1=#e94560" \
  -f lavfi -i "gradients=s=${WIDTH}x${HEIGHT}:duration=${TOTAL_FRAMES}:speed=0.018:x0=${WIDTH}:y0=0:x1=0:y1=${HEIGHT}:c0=#120a3d:c1=#00f5d4" \
  -f lavfi -i "gradients=s=${WIDTH}x${HEIGHT}:duration=${TOTAL_FRAMES}:speed=0.012:x0=$((WIDTH/2)):y0=${HEIGHT}:x1=$((WIDTH/2)):y1=0:c0=#1b0a40:c1=#ff6b35" \
  -filter_complex "
    [0:v][1:v]blend=all_mode=screen[ab];
    [ab][2:v]blend=all_mode=screen:all_opacity=0.6[out]
  " \
  -map "[out]" \
  -frames:v "$TOTAL_FRAMES" \
  "$FRAMES_DIR/frame-%03d.png"

echo "Done. Generated frames in $FRAMES_DIR"
FRAME_COUNT=$(ls "$FRAMES_DIR"/frame-*.png 2>/dev/null | wc -l | tr -d ' ')
echo "Verified: $FRAME_COUNT frames"
TOTAL_SIZE=$(du -sh "$FRAMES_DIR" | cut -f1)
echo "Total size: $TOTAL_SIZE"
