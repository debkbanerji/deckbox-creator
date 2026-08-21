import type { ArtworkPlacement, ImageInfo } from "../types/artwork";
import type { RectMm } from "../types/box";
import { getArtworkDrawRect } from "./effectiveDpi";

export async function renderPanelArtwork(
  image: ImageInfo,
  panel: RectMm,
  placement: ArtworkPlacement,
  dpi = 300,
) {
  const source = await loadImage(image.url);
  const widthPx = Math.round((panel.width / 25.4) * dpi);
  const heightPx = Math.round((panel.height / 25.4) * dpi);
  const canvas = document.createElement("canvas");
  canvas.width = widthPx;
  canvas.height = heightPx;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create artwork canvas.");
  }

  const drawRect = getArtworkDrawRect(image, panel, placement);
  const pxPerMm = widthPx / panel.width;

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, widthPx, heightPx);
  context.drawImage(
    source,
    (drawRect.x - panel.x) * pxPerMm,
    (drawRect.y - panel.y) * pxPerMm,
    drawRect.width * pxPerMm,
    drawRect.height * pxPerMm,
  );

  return canvas.toDataURL("image/jpeg", 0.95);
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load uploaded image."));
    image.src = url;
  });
}
