import type { ArtworkSlotId } from "./artwork";

export type PointMm = {
  x: number;
  y: number;
};

export type PathSegment =
  | { type: "line"; from: PointMm; to: PointMm }
  | { type: "polyline"; points: PointMm[]; closed?: boolean }
  | { type: "path"; d: string };

export type RectMm = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type ArtworkClip =
  | { type: "rect"; rect: RectMm }
  | { type: "polygon"; points: PointMm[] }
  | { type: "path"; d: string };

export type ArtworkRegion = {
  id: string;
  slot: ArtworkSlotId;
  clip: ArtworkClip;
  anchorRect: RectMm;
  renderRect: RectMm;
  rotationDegrees?: 0 | 180;
};

export type ArrowAnnotation = {
  label: string;
  text: PointMm;
  arrowFrom: PointMm;
  arrowTo: PointMm;
};

export type BoxTemplate = {
  id: string;
  name: string;
  sealingMode?: "tongue" | "magnets";
  pageWidthMm: number;
  pageHeightMm: number;
  panels: Array<{
    id: string;
    label: string;
    rect: RectMm;
  }>;
  cutPaths: PathSegment[];
  scorePaths: PathSegment[];
  slotPaths: PathSegment[];
  magnetPaths?: PathSegment[];
  backgroundRegions: ArtworkClip[];
  knockoutRegions: ArtworkClip[];
  glueRegions: ArtworkClip[];
  backGlueAnnotations: ArrowAnnotation[];
  artworkRegions: ArtworkRegion[];
  frontPanel: RectMm;
  calibrationMark: {
    x: number;
    y: number;
    length: number;
  };
};
