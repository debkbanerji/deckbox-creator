import type { ArtworkPlacement, ImageInfo } from "../types/artwork";
import type { RectMm } from "../types/box";

export type DpiRating = "excellent" | "good" | "acceptable" | "low";

export type DpiResult = {
  dpi: number;
  rating: DpiRating;
  label: string;
};

export function getArtworkDrawRect(
  image: ImageInfo,
  panel: RectMm,
  placement: ArtworkPlacement,
) {
  const imageAspect = image.width / image.height;
  const panelAspect = panel.width / panel.height;
  const baseWidth = imageAspect > panelAspect ? panel.height * imageAspect : panel.width;
  const baseHeight = imageAspect > panelAspect ? panel.height : panel.width / imageAspect;
  const width = baseWidth * placement.scale;
  const height = baseHeight * placement.scale;

  return {
    x: panel.x + (panel.width - width) / 2 + placement.panXmm,
    y: panel.y + (panel.height - height) / 2 + placement.panYmm,
    width,
    height,
  };
}

export function getEffectiveDpi(
  image: ImageInfo,
  panel: RectMm,
  placement: ArtworkPlacement,
): DpiResult {
  const drawRect = getArtworkDrawRect(image, panel, placement);
  const usedSourceWidth = image.width * (panel.width / drawRect.width);
  const usedSourceHeight = image.height * (panel.height / drawRect.height);
  const horizontalDpi = usedSourceWidth / (panel.width / 25.4);
  const verticalDpi = usedSourceHeight / (panel.height / 25.4);
  const dpi = Math.floor(Math.min(horizontalDpi, verticalDpi));

  if (dpi >= 300) {
    return { dpi, rating: "excellent", label: "Excellent" };
  }

  if (dpi >= 200) {
    return { dpi, rating: "good", label: "Good" };
  }

  if (dpi >= 150) {
    return { dpi, rating: "acceptable", label: "Acceptable" };
  }

  return { dpi, rating: "low", label: "Low" };
}
