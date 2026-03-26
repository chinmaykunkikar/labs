export function drawFrame(
  ctx: CanvasRenderingContext2D,
  frame: ImageBitmap,
  canvasWidth: number,
  canvasHeight: number,
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const scale = Math.max(
    canvasWidth / frame.width,
    canvasHeight / frame.height,
  );
  const scaledWidth = frame.width * scale;
  const scaledHeight = frame.height * scale;
  const offsetX = (canvasWidth - scaledWidth) / 2;
  const offsetY = (canvasHeight - scaledHeight) / 2;

  ctx.drawImage(frame, offsetX, offsetY, scaledWidth, scaledHeight);
}
