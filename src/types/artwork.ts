export const artworkSlotIds = ["front", "back", "top", "leftSide", "rightSide"] as const;

export type ArtworkSlotId = (typeof artworkSlotIds)[number];

export type ImageInfo = {
  url: string;
  name: string;
  width: number;
  height: number;
};

export type ArtworkPlacement = {
  scale: number;
  panXmm: number;
  panYmm: number;
};

export type ArtworkState = {
  image: ImageInfo | null;
  placement: ArtworkPlacement;
};

export type ArtworkBySlot = Record<ArtworkSlotId, ArtworkState>;
