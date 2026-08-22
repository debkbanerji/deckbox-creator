import type { ArtworkClip, BoxTemplate, PathSegment, PointMm, RectMm } from "../../types/box";

const pageWidthMm = 431.8;
const pageHeightMm = 279.4;

const panelWidth = 74;
const panelHeight = 100;
const depth = 50;
const rightSideWidth = depth;
const glueWidth = 21;
const leftDustWidth = 66;
const tongueHeight = 28;
const lidHeight = 67;
const midPanelHeight = depth;
const bottomFlap = 34;

const netWidth = leftDustWidth + panelWidth + depth + panelWidth + rightSideWidth + glueWidth;
const netHeight = tongueHeight + lidHeight + midPanelHeight + panelHeight + bottomFlap;
const xLeft = (pageWidthMm - netWidth) / 2;
const yTop = (pageHeightMm - netHeight) / 2;

const columnX = xLeft + leftDustWidth;
const columnRight = columnX + panelWidth;
const tongueTop = yTop;
const lidTop = tongueTop + tongueHeight;
const midTop = lidTop + lidHeight;
const frontTop = midTop + midPanelHeight;
const frontBottom = frontTop + panelHeight;
const bottomBottom = frontBottom + bottomFlap;

const rightSideX = columnRight;
const backX = rightSideX + depth;
const outerSideX = backX + panelWidth;
const glueX = columnX - glueWidth;
const rightOuter = outerSideX + rightSideWidth;
const backCenterX = backX + panelWidth / 2;
const vApex = { x: backCenterX, y: frontTop + 53 };
const vLeftShoulder = { x: backCenterX - 66, y: frontTop };
const vRightShoulder = { x: backCenterX + 66, y: frontTop };
const lidWingWidth = depth;

const backPanel: RectMm = {
  x: columnX,
  y: frontTop,
  width: panelWidth,
  height: panelHeight,
};
const frontPanel: RectMm = {
  x: backX,
  y: frontTop,
  width: panelWidth,
  height: panelHeight,
};
const frontCoverPanel: RectMm = {
  x: columnX,
  y: lidTop,
  width: panelWidth,
  height: lidHeight,
};
const topPanel: RectMm = {
  x: columnX,
  y: midTop,
  width: panelWidth,
  height: midPanelHeight,
};
const rightSidePanel: RectMm = {
  x: rightSideX,
  y: frontTop,
  width: depth,
  height: panelHeight,
};
const outerSidePanel: RectMm = {
  x: outerSideX,
  y: frontTop,
  width: rightSideWidth,
  height: panelHeight,
};
const leftCoverWingPoints: PointMm[] = [
  { x: columnX, y: lidTop },
  { x: columnX - 12, y: lidTop },
  { x: columnX - lidWingWidth, y: midTop - 9 },
  { x: columnX - lidWingWidth, y: midTop },
  { x: columnX, y: midTop },
];
const rightCoverWingPoints: PointMm[] = [
  { x: columnRight, y: lidTop },
  { x: columnRight + 12, y: lidTop },
  { x: columnRight + lidWingWidth, y: midTop - 9 },
  { x: columnRight + lidWingWidth, y: midTop },
  { x: columnRight, y: midTop },
];
const leftCoverWingRenderRect: RectMm = {
  x: columnX - lidWingWidth,
  y: lidTop,
  width: depth,
  height: panelHeight,
};
const rightCoverWingRenderRect: RectMm = {
  x: columnRight,
  y: lidTop,
  width: depth,
  height: panelHeight,
};
const frontCoverRenderRect: RectMm = {
  x: frontCoverPanel.x,
  y: midTop - panelHeight,
  width: frontCoverPanel.width,
  height: panelHeight,
};
const leftCoverWingArtworkRect: RectMm = {
  ...leftCoverWingRenderRect,
  y: midTop - panelHeight,
};
const rightCoverWingArtworkRect: RectMm = {
  ...rightCoverWingRenderRect,
  y: midTop - panelHeight,
};
const glueFlapRect: RectMm = { x: glueX, y: frontTop, width: glueWidth, height: panelHeight };
const leftHingeFlapPoints: PointMm[] = [
  { x: columnX, y: midTop },
  { x: columnX - 38, y: midTop + 27 },
  { x: columnX - 32, y: midTop + 36 },
  { x: columnX, y: frontTop },
];
const rightHingeFlapPoints: PointMm[] = [
  { x: columnRight, y: midTop },
  { x: columnRight + 38, y: midTop + 27 },
  { x: columnRight + 32, y: midTop + 36 },
  { x: columnRight, y: frontTop },
];
const bodyStripPoints: PointMm[] = [
  { x: columnRight, y: frontTop },
  vLeftShoulder,
  vApex,
  vRightShoulder,
  { x: rightOuter, y: frontTop },
  { x: rightOuter, y: frontBottom },
  { x: columnRight, y: frontBottom },
];
const vCutoutPoints: PointMm[] = [vLeftShoulder, vRightShoulder, vApex];
const backBottomFlapPoints: PointMm[] = [
  { x: columnX, y: frontBottom },
  { x: columnRight, y: frontBottom },
  { x: columnRight - 3, y: bottomBottom },
  { x: columnX + 56, y: bottomBottom },
  { x: columnX + 47, y: frontBottom + depth / 2 },
  { x: columnX + 37, y: frontBottom + depth / 2 },
  { x: columnX + 33, y: bottomBottom },
  { x: columnX + 9, y: bottomBottom },
  { x: columnX, y: frontBottom },
];
const leftSideBottomFlapPoints: PointMm[] = [
  { x: rightSideX, y: frontBottom },
  { x: backX, y: frontBottom },
  { x: backX - 8, y: frontBottom + 20 },
  { x: rightSideX + 12, y: frontBottom + 20 },
  { x: rightSideX, y: frontBottom },
];
const frontBottomFlapPoints: PointMm[] = [
  { x: backX, y: frontBottom },
  { x: outerSideX, y: frontBottom },
  { x: outerSideX - 3, y: bottomBottom },
  { x: backX + 56, y: bottomBottom },
  { x: backX + 47, y: frontBottom + depth / 2 },
  { x: backX + 37, y: frontBottom + depth / 2 },
  { x: backX + 33, y: bottomBottom },
  { x: backX + 9, y: bottomBottom },
  { x: backX, y: frontBottom },
];
const rightSideBottomFlapPoints: PointMm[] = [
  { x: outerSideX, y: frontBottom },
  { x: rightOuter, y: frontBottom },
  { x: rightOuter - 8, y: frontBottom + 20 },
  { x: outerSideX + 12, y: frontBottom + 20 },
  { x: outerSideX, y: frontBottom },
];
const tongueSlotPoints: PointMm[] = [
  { x: backX + 16, y: frontTop + 62.7 },
  { x: backX + 57, y: frontTop + 62.7 },
  { x: backX + 61, y: frontTop + 65.9 },
  { x: backX + 12, y: frontTop + 65.9 },
];

const line = (from: PointMm, to: PointMm): PathSegment => ({
  type: "line",
  from,
  to,
});

const poly = (points: PointMm[], closed = false): PathSegment => ({
  type: "polyline",
  points,
  closed,
});

const path = (d: string): PathSegment => ({
  type: "path",
  d,
});

const rectRegion = (rect: RectMm): ArtworkClip => ({
  type: "rect",
  rect,
});

const polygonRegion = (points: PointMm[]): ArtworkClip => ({
  type: "polygon",
  points,
});

const insetRect = (rect: RectMm, insetX: number, insetY: number): RectMm => ({
  x: rect.x + insetX,
  y: rect.y + insetY,
  width: rect.width - insetX * 2,
  height: rect.height - insetY * 2,
});

const scalePolygon = (points: PointMm[], scale: number): PointMm[] => {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const center = {
    x: (Math.min(...xs) + Math.max(...xs)) / 2,
    y: (Math.min(...ys) + Math.max(...ys)) / 2,
  };

  return points.map((point) => ({
    x: center.x + (point.x - center.x) * scale,
    y: center.y + (point.y - center.y) * scale,
  }));
};

const topProngCutD = `
  M ${columnX} ${lidTop}
  L ${columnX} ${tongueTop + 5.6}
  C ${columnX} ${tongueTop + 2.4}, ${columnX + 2.4} ${tongueTop}, ${columnX + 5.6} ${tongueTop}
  L ${columnX + 17.3} ${tongueTop}
  C ${columnX + 20} ${tongueTop}, ${columnX + 21.6} ${tongueTop + 1.8}, ${columnX + 21.6} ${tongueTop + 4.6}
  L ${columnX + 21.6} ${lidTop - 11.8}
  C ${columnX + 21.6} ${lidTop - 8.2}, ${columnX + 24.5} ${lidTop - 6.1}, ${columnX + 28.1} ${lidTop - 6.1}
  C ${columnX + 31.5} ${lidTop - 6.1}, ${columnX + 32.2} ${lidTop - 9.6}, ${columnX + 37.5} ${lidTop - 9.6}
  C ${columnX + 42.8} ${lidTop - 9.6}, ${columnX + 43.5} ${lidTop - 6.1}, ${columnX + 46.9} ${lidTop - 6.1}
  C ${columnX + 50.5} ${lidTop - 6.1}, ${columnX + 53.4} ${lidTop - 8.2}, ${columnX + 53.4} ${lidTop - 11.8}
  L ${columnX + 53.4} ${tongueTop + 4.6}
  C ${columnX + 53.4} ${tongueTop + 1.8}, ${columnX + 55} ${tongueTop}, ${columnX + 57.7} ${tongueTop}
  L ${columnX + 69.4} ${tongueTop}
  C ${columnX + 72.6} ${tongueTop}, ${columnRight} ${tongueTop + 2.4}, ${columnRight} ${tongueTop + 5.6}
  L ${columnRight} ${lidTop}
`;

const topProngFillD = `${topProngCutD} Z`;
const topProngCut = path(topProngCutD);

export const deckboxTemplate: BoxTemplate = {
  id: "deckbox",
  name: "Deckbox",
  pageWidthMm,
  pageHeightMm,
  frontPanel,
  panels: [
    {
      id: "lid",
      label: "FRONT COVER",
      rect: frontCoverPanel,
    },
    {
      id: "hinge",
      label: "TOP",
      rect: topPanel,
    },
    {
      id: "front",
      label: "BACK",
      rect: backPanel,
    },
    {
      id: "right-side",
      label: "SIDE",
      rect: rightSidePanel,
    },
    {
      id: "back",
      label: "FRONT",
      rect: frontPanel,
    },
    {
      id: "outer-side",
      label: "SIDE",
      rect: outerSidePanel,
    },
    {
      id: "glue",
      label: "GLUE",
      rect: glueFlapRect,
    },
  ],
  calibrationMark: {
    x: 20,
    y: pageHeightMm - 18,
    length: 50,
  },
  artworkRegions: [
    {
      id: "front",
      slot: "front",
      clip: { type: "rect", rect: frontPanel },
      anchorRect: frontPanel,
      renderRect: frontPanel,
    },
    {
      id: "front-cover",
      slot: "front",
      clip: { type: "rect", rect: frontCoverPanel },
      anchorRect: frontPanel,
      renderRect: frontCoverRenderRect,
      rotationDegrees: 180,
    },
    {
      id: "front-cover-tongue",
      slot: "front",
      clip: { type: "path", d: topProngFillD },
      anchorRect: frontPanel,
      renderRect: frontCoverRenderRect,
      rotationDegrees: 180,
    },
    {
      id: "back",
      slot: "back",
      clip: { type: "rect", rect: backPanel },
      anchorRect: backPanel,
      renderRect: backPanel,
    },
    {
      id: "top",
      slot: "top",
      clip: { type: "rect", rect: topPanel },
      anchorRect: topPanel,
      renderRect: topPanel,
    },
    {
      id: "right-side",
      slot: "leftSide",
      clip: { type: "rect", rect: rightSidePanel },
      anchorRect: rightSidePanel,
      renderRect: rightSidePanel,
    },
    {
      id: "outer-side",
      slot: "rightSide",
      clip: { type: "rect", rect: outerSidePanel },
      anchorRect: outerSidePanel,
      renderRect: outerSidePanel,
    },
    {
      id: "left-cover-wing",
      slot: "rightSide",
      clip: { type: "polygon", points: leftCoverWingPoints },
      anchorRect: outerSidePanel,
      renderRect: leftCoverWingArtworkRect,
      rotationDegrees: 180,
    },
    {
      id: "right-cover-wing",
      slot: "leftSide",
      clip: { type: "polygon", points: rightCoverWingPoints },
      anchorRect: rightSidePanel,
      renderRect: rightCoverWingArtworkRect,
      rotationDegrees: 180,
    },
  ],
  backgroundRegions: [
    { type: "path", d: topProngFillD },
    rectRegion(frontCoverPanel),
    polygonRegion(leftCoverWingPoints),
    polygonRegion(rightCoverWingPoints),
    rectRegion(topPanel),
    polygonRegion(leftHingeFlapPoints),
    polygonRegion(rightHingeFlapPoints),
    rectRegion(backPanel),
    rectRegion(glueFlapRect),
    polygonRegion(bodyStripPoints),
    polygonRegion(backBottomFlapPoints),
    polygonRegion(leftSideBottomFlapPoints),
    polygonRegion(frontBottomFlapPoints),
    polygonRegion(rightSideBottomFlapPoints),
  ],
  knockoutRegions: [
    polygonRegion(vCutoutPoints),
    polygonRegion(tongueSlotPoints),
  ],
  glueRegions: [
    rectRegion(insetRect(glueFlapRect, 4, 10)),
    polygonRegion(scalePolygon(leftHingeFlapPoints, 0.58)),
    polygonRegion(scalePolygon(rightHingeFlapPoints, 0.58)),
    polygonRegion(scalePolygon(leftSideBottomFlapPoints, 0.58)),
    polygonRegion(scalePolygon(rightSideBottomFlapPoints, 0.58)),
  ],
  backGlueAnnotations: [
    {
      label: "glue on\nback",
      text: { x: columnX - 31, y: tongueTop + 9 },
      arrowFrom: { x: columnX - 19, y: tongueTop + 12 },
      arrowTo: { x: columnX - 3, y: tongueTop + 12 },
    },
    {
      label: "glue on\nback",
      text: { x: columnRight + 31, y: tongueTop + 9 },
      arrowFrom: { x: columnRight + 19, y: tongueTop + 12 },
      arrowTo: { x: columnRight + 3, y: tongueTop + 12 },
    },
  ],
  cutPaths: [
    topProngCut,

    // Lid dust flaps, wide and angled to match the current deckbox geometry.
    poly(leftCoverWingPoints),
    poly(rightCoverWingPoints),

    // Hinge side flaps.
    poly(leftHingeFlapPoints),
    poly(rightHingeFlapPoints),

    // Main front column edges.
    line({ x: columnX, y: lidTop }, { x: columnX, y: frontTop }),
    line({ x: columnRight, y: lidTop }, { x: columnRight, y: frontTop }),
    line({ x: columnX, y: frontTop }, { x: columnRight, y: frontTop }),

    // Left glue flap.
    poly([
      { x: columnX, y: frontTop },
      { x: glueX, y: frontTop },
      { x: glueX, y: frontBottom },
      { x: columnX, y: frontBottom },
    ]),

    // Right-hand body strip, including the deep V-shaped receiving cut above the slot panel.
    poly(bodyStripPoints),

    // Bottom flaps are deliberately varied so the locking flaps slot together cleanly.
    poly(backBottomFlapPoints),
    poly(leftSideBottomFlapPoints),
    poly(frontBottomFlapPoints),
    poly(rightSideBottomFlapPoints),
  ],
  scorePaths: [
    line({ x: columnX, y: lidTop }, { x: columnRight, y: lidTop }),
    line({ x: columnX, y: midTop }, { x: columnRight, y: midTop }),
    line({ x: columnX, y: frontTop }, { x: columnRight, y: frontTop }),
    line({ x: glueX, y: frontBottom }, { x: rightOuter, y: frontBottom }),
    line({ x: columnX, y: frontTop }, { x: columnX, y: frontBottom }),
    line({ x: columnRight, y: frontTop }, { x: columnRight, y: frontBottom }),
    line({ x: backX, y: frontTop }, { x: backX, y: frontBottom }),
    line({ x: outerSideX, y: frontTop }, { x: outerSideX, y: frontBottom }),
    line(vLeftShoulder, vApex),
    line(vApex, vRightShoulder),
    line({ x: rightSideX, y: frontBottom }, { x: backX, y: frontBottom }),
    line({ x: backX, y: frontBottom }, { x: outerSideX, y: frontBottom }),
    line({ x: outerSideX, y: frontBottom }, { x: rightOuter, y: frontBottom }),
    line({ x: rightSideX, y: frontTop }, { x: backX, y: frontTop }),
    line({ x: backX, y: frontTop }, { x: outerSideX, y: frontTop }),
    line({ x: outerSideX, y: frontTop }, { x: rightOuter, y: frontTop }),
  ],
  slotPaths: [
    poly(tongueSlotPoints, true),
  ],
};
