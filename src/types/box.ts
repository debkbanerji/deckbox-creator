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

export type BoxTemplate = {
  id: string;
  name: string;
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
  frontPanel: RectMm;
  calibrationMark: {
    x: number;
    y: number;
    length: number;
  };
};
