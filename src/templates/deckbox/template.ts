import type { ArtworkClip, BoxTemplate, PathSegment, PointMm, RectMm } from "../../types/box";

export type DeckboxSealingMode = "tongue" | "magnets";

const pageWidthMm = 431.8;
const pageHeightMm = 279.4;

const panelWidth = 74;
const panelHeight = 100;
const depth = 50;
const rightSideWidth = depth;
const glueWidth = 14;
const leftDustWidth = 66;
const frontCoverHeightIncrease = 13;
const tongueHeight = 28 - frontCoverHeightIncrease;
const lidHeight = 67 + frontCoverHeightIncrease;
const midPanelHeight = depth;
const bottomFlap = 34;

const netWidth = leftDustWidth + panelWidth + depth + panelWidth + rightSideWidth + glueWidth;
const netHeight = tongueHeight + lidHeight + midPanelHeight + panelHeight + bottomFlap;
const xLeft = (pageWidthMm - netWidth) / 2;
const yTop = (pageHeightMm - netHeight) / 2;

const outerSideX = xLeft + glueWidth;
const frontX = outerSideX + rightSideWidth;
const rightSideX = frontX + panelWidth;
const columnX = rightSideX + depth;
const columnRight = columnX + panelWidth;
const glueX = columnRight;
const rightOuter = glueX + glueWidth;
const bodyTop = yTop + bottomFlap;
const bodyBottom = bodyTop + panelHeight;
const topPanelTop = bodyBottom;
const lidTop = topPanelTop + midPanelHeight;
const tongueTop = lidTop + lidHeight;
const tongueBottom = tongueTop + tongueHeight;

const frontCenterX = frontX + panelWidth / 2;
const vApex = { x: frontCenterX, y: bodyTop + panelHeight - 53 };
const vLeftShoulder = { x: columnX, y: bodyBottom };
const vRightShoulder = { x: outerSideX, y: bodyBottom };
const lidWingWidth = depth;

const backPanel: RectMm = {
  x: columnX,
  y: bodyTop,
  width: panelWidth,
  height: panelHeight,
};
const frontPanel: RectMm = {
  x: frontX,
  y: bodyTop,
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
  y: topPanelTop,
  width: panelWidth,
  height: midPanelHeight,
};
const rightSidePanel: RectMm = {
  x: rightSideX,
  y: bodyTop,
  width: depth,
  height: panelHeight,
};
const outerSidePanel: RectMm = {
  x: outerSideX,
  y: bodyTop,
  width: rightSideWidth,
  height: panelHeight,
};
const leftCoverWingPoints: PointMm[] = [
  { x: columnRight, y: tongueTop },
  { x: columnRight + lidWingWidth, y: lidTop },
  { x: columnRight, y: lidTop },
];
const rightCoverWingPoints: PointMm[] = [
  { x: columnX, y: tongueTop },
  { x: columnX - lidWingWidth, y: lidTop },
  { x: columnX, y: lidTop },
];
const leftCoverWingRenderRect: RectMm = {
  x: columnRight,
  y: lidTop,
  width: depth,
  height: panelHeight,
};
const rightCoverWingRenderRect: RectMm = {
  x: columnX - lidWingWidth,
  y: lidTop,
  width: depth,
  height: panelHeight,
};
const frontCoverRenderRect: RectMm = {
  x: frontCoverPanel.x,
  y: lidTop,
  width: frontCoverPanel.width,
  height: panelHeight,
};
const leftCoverWingArtworkRect: RectMm = {
  ...leftCoverWingRenderRect,
  y: lidTop,
};
const rightCoverWingArtworkRect: RectMm = {
  ...rightCoverWingRenderRect,
  y: lidTop,
};
const glueFlapRect: RectMm = { x: glueX, y: bodyTop, width: glueWidth, height: panelHeight };
const glueFlapPoints: PointMm[] = [
  { x: columnRight, y: bodyBottom },
  { x: glueX + glueWidth, y: bodyBottom - glueWidth },
  { x: glueX + glueWidth, y: bodyTop },
  { x: columnRight, y: bodyTop },
];
const leftHingeFlapPoints: PointMm[] = [
  { x: columnRight, y: lidTop },
  { x: columnRight + 17, y: topPanelTop + 37 },
  { x: columnRight + 17, y: topPanelTop + 14 },
  { x: columnRight, y: topPanelTop },
];
const rightHingeFlapPoints: PointMm[] = [
  { x: columnX, y: lidTop },
  { x: columnX - 17, y: topPanelTop + 37 },
  { x: columnX - 17, y: topPanelTop + 14 },
  { x: columnX, y: topPanelTop },
];
const bodyStripPoints: PointMm[] = [
  { x: columnX, y: bodyBottom },
  vLeftShoulder,
  vApex,
  vRightShoulder,
  { x: outerSideX, y: bodyBottom },
  { x: outerSideX, y: bodyTop },
  { x: columnX, y: bodyTop },
];
const bodyStripCutPoints = bodyStripPoints.slice(0, -1);
const vCutoutPoints: PointMm[] = [vLeftShoulder, vRightShoulder, vApex];
const frontMagnetTab = {
  x: vApex.x - 17,
  y: vApex.y - 12,
  width: 34,
  height: tongueHeight,
  radius: 4.5,
};
const frontMagnetTabLeftTop = { x: frontMagnetTab.x, y: frontMagnetTab.y };
const frontMagnetTabRightTop = {
  x: frontMagnetTab.x + frontMagnetTab.width,
  y: frontMagnetTab.y,
};
const frontMagnetTabLeftBottom = {
  x: frontMagnetTab.x,
  y: frontMagnetTab.y + frontMagnetTab.height - frontMagnetTab.radius,
};
const frontMagnetTabRightBottom = {
  x: frontMagnetTab.x + frontMagnetTab.width,
  y: frontMagnetTab.y + frontMagnetTab.height - frontMagnetTab.radius,
};
const frontMagnetCircleCenter = {
  x: frontMagnetTab.x + frontMagnetTab.width / 2,
  y: frontMagnetTab.y + frontMagnetTab.height / 2,
};
const topMagnetCircleCenter = {
  x: columnX + panelWidth / 2,
  y: tongueTop + tongueHeight / 2,
};
const magnetCircleRadius = 3;
const backBottomFlapPoints: PointMm[] = [
  { x: columnRight, y: bodyTop },
  { x: columnX, y: bodyTop },
  { x: columnX, y: yTop },
  { x: columnX + 18, y: yTop },
  { x: columnX + 27, y: bodyTop - depth / 2 },
  { x: columnX + 37, y: bodyTop - depth / 2 },
  { x: columnX + 41, y: yTop },
  { x: columnRight - 9, y: yTop },
  { x: columnRight, y: bodyTop },
];
const leftSideBottomFlapPoints: PointMm[] = [
  { x: columnX, y: bodyTop },
  { x: rightSideX, y: bodyTop },
  { x: rightSideX + 8, y: bodyTop - 20 },
  { x: columnX - 12, y: bodyTop - 20 },
  { x: columnX, y: bodyTop },
];
const frontBottomFlapPoints: PointMm[] = [
  { x: rightSideX, y: bodyTop },
  { x: frontX, y: bodyTop },
  { x: frontX, y: yTop },
  { x: frontX + 18, y: yTop },
  { x: frontX + 27, y: bodyTop - depth / 2 },
  { x: frontX + 37, y: bodyTop - depth / 2 },
  { x: frontX + 41, y: yTop },
  { x: rightSideX - 9, y: yTop },
  { x: rightSideX, y: bodyTop },
];
const rightSideBottomFlapPoints: PointMm[] = [
  { x: frontX, y: bodyTop },
  { x: outerSideX, y: bodyTop },
  { x: outerSideX + 8, y: bodyTop - 20 },
  { x: frontX - 12, y: bodyTop - 20 },
  { x: frontX, y: bodyTop },
];
const tongueSlotPoints: PointMm[] = [
  { x: frontX + 58, y: bodyTop + 38.3 - frontCoverHeightIncrease },
  { x: frontX + 17, y: bodyTop + 38.3 - frontCoverHeightIncrease },
  { x: frontX + 13, y: bodyTop + 35.1 - frontCoverHeightIncrease },
  { x: frontX + 62, y: bodyTop + 35.1 - frontCoverHeightIncrease },
];
const tongueSlotCenter = {
  x: (frontX + 13 + frontX + 62) / 2,
  y: bodyTop + 36.7 - frontCoverHeightIncrease,
};
const tongueSlotKnockoutPoints = tongueSlotPoints.map((point) => ({
  x: point.x + (point.x < tongueSlotCenter.x ? 0.14 : -0.14),
  y: point.y + (point.y < tongueSlotCenter.y ? 0.18 : -0.18),
}));

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

const flapCut = (points: PointMm[]): PathSegment => poly(points.slice(1));

const path = (d: string): PathSegment => ({
  type: "path",
  d,
});

const bottomRoundedRectPath = (rect: RectMm, radius: number): string => {
  const right = rect.x + rect.width;
  const bottom = rect.y + rect.height;
  const leftControlX = rect.x + radius * 0.45;
  const rightControlX = right - radius * 0.45;

  return `
    M ${rect.x} ${rect.y}
    L ${right} ${rect.y}
    L ${right} ${bottom - radius}
    C ${right} ${bottom - radius * 0.45}, ${rightControlX} ${bottom}, ${right - radius} ${bottom}
    L ${rect.x + radius} ${bottom}
    C ${leftControlX} ${bottom}, ${rect.x} ${bottom - radius * 0.45}, ${rect.x} ${bottom - radius}
    L ${rect.x} ${rect.y}
  `;
};

const bottomRoundedRectCutPath = (rect: RectMm, radius: number): string => {
  const right = rect.x + rect.width;
  const bottom = rect.y + rect.height;
  const leftControlX = rect.x + radius * 0.45;
  const rightControlX = right - radius * 0.45;

  return `
    M ${right} ${rect.y}
    L ${right} ${bottom - radius}
    C ${right} ${bottom - radius * 0.45}, ${rightControlX} ${bottom}, ${right - radius} ${bottom}
    L ${rect.x + radius} ${bottom}
    C ${leftControlX} ${bottom}, ${rect.x} ${bottom - radius * 0.45}, ${rect.x} ${bottom - radius}
    L ${rect.x} ${rect.y}
  `;
};

const circlePath = (center: PointMm, radius: number): string => {
  const kappa = radius * 0.5522847498;

  return `
    M ${center.x + radius} ${center.y}
    C ${center.x + radius} ${center.y + kappa}, ${center.x + kappa} ${center.y + radius}, ${center.x} ${center.y + radius}
    C ${center.x - kappa} ${center.y + radius}, ${center.x - radius} ${center.y + kappa}, ${center.x - radius} ${center.y}
    C ${center.x - radius} ${center.y - kappa}, ${center.x - kappa} ${center.y - radius}, ${center.x} ${center.y - radius}
    C ${center.x + kappa} ${center.y - radius}, ${center.x + radius} ${center.y - kappa}, ${center.x + radius} ${center.y}
    Z
  `;
};

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

const rightHalfPolygon = (
  points: PointMm[],
  leftCutRatio = 0.5,
  outerExtraLeftMm = 0,
): PointMm[] => {
  const source =
    points.length > 1 &&
    points[0].x === points[points.length - 1].x &&
    points[0].y === points[points.length - 1].y
      ? points.slice(0, -1)
      : points;
  const xs = source.map((point) => point.x);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const cutX = minX + (maxX - minX) * leftCutRatio;
  const ys = source.map((point) => point.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const height = maxY - minY || 1;
  const edgeTopX = cutX;
  const edgeSlope = -outerExtraLeftMm / height;
  const clipped: PointMm[] = [];
  const edgeXAtY = (y: number) => edgeTopX + (y - minY) * edgeSlope;

  const intersect = (from: PointMm, to: PointMm): PointMm => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const denominator = dx - edgeSlope * dy;
    const t =
      Math.abs(denominator) < 0.0001
        ? 0
        : (edgeXAtY(from.y) - from.x) / denominator;
    const y = from.y + dy * t;

    return { x: edgeXAtY(y), y };
  };

  source.forEach((point, index) => {
    const previous = source[(index + source.length - 1) % source.length];
    const pointInside = point.x >= edgeXAtY(point.y);
    const previousInside = previous.x >= edgeXAtY(previous.y);

    if (pointInside && !previousInside) {
      clipped.push(intersect(previous, point));
    }

    if (pointInside) {
      clipped.push(point);
    }

    if (!pointInside && previousInside) {
      clipped.push(intersect(previous, point));
    }
  });

  return clipped;
};

const topProngCutD = `
  M ${columnRight} ${tongueTop}
  L ${columnRight} ${tongueBottom - 5.6}
  C ${columnRight} ${tongueBottom - 2.4}, ${columnRight - 2.4} ${tongueBottom}, ${columnRight - 5.6} ${tongueBottom}
  L ${columnRight - 17.8} ${tongueBottom}
  C ${columnRight - 21.2} ${tongueBottom}, ${columnRight - 22.6} ${tongueBottom - 1.6}, ${columnRight - 22.6} ${tongueBottom - 5.2}
  C ${columnRight - 22.6} ${tongueTop + 7.4}, ${columnRight - 24.5} ${tongueTop + 6.1}, ${columnRight - 28.1} ${tongueTop + 6.1}
  C ${columnRight - 31.5} ${tongueTop + 6.1}, ${columnRight - 32.2} ${tongueTop + 9.6}, ${columnRight - 37.5} ${tongueTop + 9.6}
  C ${columnRight - 42.8} ${tongueTop + 9.6}, ${columnRight - 43.5} ${tongueTop + 6.1}, ${columnRight - 46.9} ${tongueTop + 6.1}
  C ${columnRight - 50.5} ${tongueTop + 6.1}, ${columnRight - 52.4} ${tongueTop + 7.4}, ${columnRight - 52.4} ${tongueBottom - 5.2}
  C ${columnRight - 52.4} ${tongueBottom - 1.6}, ${columnRight - 54.3} ${tongueBottom}, ${columnRight - 57.7} ${tongueBottom}
  L ${columnRight - 69.4} ${tongueBottom}
  C ${columnRight - 72.6} ${tongueBottom}, ${columnX} ${tongueBottom - 2.4}, ${columnX} ${tongueBottom - 5.6}
  L ${columnX} ${tongueTop}
`;

const topProngFillD = `${topProngCutD} Z`;
const topProngCut = path(topProngCutD);

const topMagnetTabD = bottomRoundedRectPath(
  { x: columnX, y: tongueTop, width: panelWidth, height: tongueHeight },
  4.4,
);
const topMagnetTabCutD = bottomRoundedRectCutPath(
  { x: columnX, y: tongueTop, width: panelWidth, height: tongueHeight },
  4.4,
);
const frontMagnetTabD = bottomRoundedRectPath(frontMagnetTab, frontMagnetTab.radius);
const magnetBodyStripD = `
  M ${columnX} ${bodyBottom}
  L ${vLeftShoulder.x} ${vLeftShoulder.y}
  L ${frontMagnetTabRightTop.x} ${frontMagnetTabRightTop.y}
  L ${frontMagnetTab.x + frontMagnetTab.width} ${frontMagnetTab.y + frontMagnetTab.height - frontMagnetTab.radius}
  C ${frontMagnetTab.x + frontMagnetTab.width} ${frontMagnetTab.y + frontMagnetTab.height - frontMagnetTab.radius * 0.45}, ${frontMagnetTab.x + frontMagnetTab.width - frontMagnetTab.radius * 0.45} ${frontMagnetTab.y + frontMagnetTab.height}, ${frontMagnetTab.x + frontMagnetTab.width - frontMagnetTab.radius} ${frontMagnetTab.y + frontMagnetTab.height}
  L ${frontMagnetTab.x + frontMagnetTab.radius} ${frontMagnetTab.y + frontMagnetTab.height}
  C ${frontMagnetTab.x + frontMagnetTab.radius * 0.45} ${frontMagnetTab.y + frontMagnetTab.height}, ${frontMagnetTab.x} ${frontMagnetTab.y + frontMagnetTab.height - frontMagnetTab.radius * 0.45}, ${frontMagnetTab.x} ${frontMagnetTab.y + frontMagnetTab.height - frontMagnetTab.radius}
  L ${frontMagnetTabLeftTop.x} ${frontMagnetTabLeftTop.y}
  L ${vRightShoulder.x} ${vRightShoulder.y}
  L ${outerSideX} ${bodyBottom}
  L ${outerSideX} ${bodyTop}
  L ${columnX} ${bodyTop}
  Z
`;
const magnetBodyStripCutD = `
  M ${columnX} ${bodyBottom}
  L ${frontMagnetTabRightTop.x} ${frontMagnetTabRightTop.y}
  L ${frontMagnetTab.x + frontMagnetTab.width} ${frontMagnetTab.y + frontMagnetTab.height - frontMagnetTab.radius}
  C ${frontMagnetTab.x + frontMagnetTab.width} ${frontMagnetTab.y + frontMagnetTab.height - frontMagnetTab.radius * 0.45}, ${frontMagnetTab.x + frontMagnetTab.width - frontMagnetTab.radius * 0.45} ${frontMagnetTab.y + frontMagnetTab.height}, ${frontMagnetTab.x + frontMagnetTab.width - frontMagnetTab.radius} ${frontMagnetTab.y + frontMagnetTab.height}
  L ${frontMagnetTab.x + frontMagnetTab.radius} ${frontMagnetTab.y + frontMagnetTab.height}
  C ${frontMagnetTab.x + frontMagnetTab.radius * 0.45} ${frontMagnetTab.y + frontMagnetTab.height}, ${frontMagnetTab.x} ${frontMagnetTab.y + frontMagnetTab.height - frontMagnetTab.radius * 0.45}, ${frontMagnetTab.x} ${frontMagnetTab.y + frontMagnetTab.height - frontMagnetTab.radius}
  L ${frontMagnetTabLeftTop.x} ${frontMagnetTabLeftTop.y}
  L ${outerSideX} ${bodyBottom}
  L ${outerSideX} ${bodyTop}
`;
const magnetVoidKnockouts: ArtworkClip[] = [
  polygonRegion([
    vLeftShoulder,
    frontMagnetTabRightTop,
    frontMagnetTabRightBottom,
  ]),
  polygonRegion([
    frontMagnetTabLeftTop,
    vRightShoulder,
    frontMagnetTabLeftBottom,
  ]),
];
const magnetGuidePaths = [
  path(circlePath(topMagnetCircleCenter, magnetCircleRadius)),
  path(circlePath(frontMagnetCircleCenter, magnetCircleRadius)),
];

export const createDeckboxTemplate = (sealingMode: DeckboxSealingMode = "tongue"): BoxTemplate => {
  const isMagnetMode = sealingMode === "magnets";
  const closureTabD = isMagnetMode ? topMagnetTabD : topProngFillD;
  const closureCut = isMagnetMode ? path(topMagnetTabCutD) : topProngCut;
  const bodyStripRegion = isMagnetMode ? { type: "path" as const, d: magnetBodyStripD } : polygonRegion(bodyStripPoints);
  const bodyStripCut = isMagnetMode ? path(magnetBodyStripCutD) : poly(bodyStripCutPoints);

  return {
    id: isMagnetMode ? "deckbox-magnets" : "deckbox",
    name: "Deckbox",
    sealingMode,
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
      rotationDegrees: 180,
    },
    {
      id: "front-cover",
      slot: "front",
      clip: { type: "rect", rect: frontCoverPanel },
      anchorRect: frontPanel,
      renderRect: frontCoverRenderRect,
    },
    {
      id: isMagnetMode ? "front-cover-magnet-tab" : "front-cover-tongue",
      slot: "front",
      clip: { type: "path", d: closureTabD },
      anchorRect: frontPanel,
      renderRect: frontCoverRenderRect,
    },
    {
      id: "back",
      slot: "back",
      clip: { type: "rect", rect: backPanel },
      anchorRect: backPanel,
      renderRect: backPanel,
      rotationDegrees: 180,
    },
    {
      id: "top",
      slot: "top",
      clip: { type: "rect", rect: topPanel },
      anchorRect: topPanel,
      renderRect: topPanel,
      rotationDegrees: 180,
    },
    {
      id: "right-side",
      slot: "leftSide",
      clip: { type: "rect", rect: rightSidePanel },
      anchorRect: rightSidePanel,
      renderRect: rightSidePanel,
      rotationDegrees: 180,
    },
    {
      id: "outer-side",
      slot: "rightSide",
      clip: { type: "rect", rect: outerSidePanel },
      anchorRect: outerSidePanel,
      renderRect: outerSidePanel,
      rotationDegrees: 180,
    },
    {
      id: "left-cover-wing",
      slot: "rightSide",
      clip: { type: "polygon", points: leftCoverWingPoints },
      anchorRect: outerSidePanel,
      renderRect: leftCoverWingArtworkRect,
    },
    {
      id: "right-cover-wing",
      slot: "leftSide",
      clip: { type: "polygon", points: rightCoverWingPoints },
      anchorRect: rightSidePanel,
      renderRect: rightCoverWingArtworkRect,
    },
  ],
  backgroundRegions: [
    { type: "path", d: closureTabD },
    rectRegion(frontCoverPanel),
    polygonRegion(leftCoverWingPoints),
    polygonRegion(rightCoverWingPoints),
    rectRegion(topPanel),
    polygonRegion(leftHingeFlapPoints),
    polygonRegion(rightHingeFlapPoints),
    rectRegion(backPanel),
    polygonRegion(glueFlapPoints),
    bodyStripRegion,
    polygonRegion(backBottomFlapPoints),
    polygonRegion(leftSideBottomFlapPoints),
    polygonRegion(frontBottomFlapPoints),
    polygonRegion(rightSideBottomFlapPoints),
  ],
  knockoutRegions: isMagnetMode
    ? magnetVoidKnockouts
    : [
        polygonRegion(scalePolygon(vCutoutPoints, 0.994)),
        polygonRegion(tongueSlotKnockoutPoints),
      ],
  glueRegions: [
    rectRegion(insetRect(glueFlapRect, 4, 20)),
    polygonRegion(scalePolygon(leftHingeFlapPoints, 0.58)),
    polygonRegion(scalePolygon(rightHingeFlapPoints, 0.58)),
    polygonRegion(rightHalfPolygon(scalePolygon(leftSideBottomFlapPoints, 0.58), 0.36, 1.75)),
    polygonRegion(rightHalfPolygon(scalePolygon(rightSideBottomFlapPoints, 0.58), 0.36, 1.75)),
  ],
  backGlueAnnotations: [
    {
      label: "glue on\nback",
      text: { x: columnRight + 31, y: tongueBottom - 10.5 },
      arrowFrom: { x: columnRight + 19, y: tongueBottom - 8 },
      arrowTo: { x: columnRight + 3, y: tongueBottom - 8 },
    },
    {
      label: "glue on\nback",
      text: { x: columnX - 31, y: tongueBottom - 10.5 },
      arrowFrom: { x: columnX - 19, y: tongueBottom - 8 },
      arrowTo: { x: columnX - 3, y: tongueBottom - 8 },
    },
    ...(isMagnetMode
      ? [
          {
            label: "glue on\nback",
            text: {
              x: frontMagnetCircleCenter.x,
              y: frontMagnetTab.y + frontMagnetTab.height + 20,
            },
            arrowFrom: {
              x: frontMagnetCircleCenter.x,
              y: frontMagnetTab.y + frontMagnetTab.height + 12,
            },
            arrowTo: {
              x: frontMagnetCircleCenter.x,
              y: frontMagnetTab.y + frontMagnetTab.height + 3,
            },
          },
        ]
      : []),
  ],
  cutPaths: [
    closureCut,

    // Lid dust flaps, wide and angled to match the current deckbox geometry.
    poly(leftCoverWingPoints),
    poly(rightCoverWingPoints),

    // Hinge side flaps.
    poly(leftHingeFlapPoints),
    poly(rightHingeFlapPoints),

    // Left glue flap.
    poly(glueFlapPoints),

    // Right-hand body strip, including the deep V-shaped receiving cut above the slot panel.
    bodyStripCut,

    // Bottom flaps are deliberately varied so the locking flaps slot together cleanly.
    flapCut(backBottomFlapPoints),
    flapCut(leftSideBottomFlapPoints),
    flapCut(frontBottomFlapPoints),
    flapCut(rightSideBottomFlapPoints),
  ],
  scorePaths: [
    line({ x: columnRight, y: tongueTop }, { x: columnX, y: tongueTop }),
    ...(isMagnetMode ? [line(frontMagnetTabLeftTop, frontMagnetTabRightTop)] : []),
    line({ x: columnRight, y: lidTop }, { x: columnX, y: lidTop }),
    line({ x: columnRight, y: bodyBottom }, { x: columnX, y: bodyBottom }),
    line({ x: glueX + glueWidth, y: bodyTop }, { x: outerSideX, y: bodyTop }),
    line({ x: columnRight, y: tongueTop }, { x: columnRight, y: bodyTop }),
    line({ x: columnX, y: tongueTop }, { x: columnX, y: bodyTop }),
    line({ x: rightSideX, y: bodyBottom }, { x: rightSideX, y: bodyTop }),
    line({ x: frontX, y: bodyBottom }, { x: frontX, y: bodyTop }),
    line({ x: columnX, y: bodyTop }, { x: rightSideX, y: bodyTop }),
    line({ x: rightSideX, y: bodyTop }, { x: frontX, y: bodyTop }),
    line({ x: frontX, y: bodyTop }, { x: outerSideX, y: bodyTop }),
    line({ x: columnX, y: bodyBottom }, { x: rightSideX, y: bodyBottom }),
    line({ x: rightSideX, y: bodyBottom }, { x: frontX, y: bodyBottom }),
    line({ x: frontX, y: bodyBottom }, { x: outerSideX, y: bodyBottom }),
  ],
  slotPaths: isMagnetMode ? [] : [
    poly(tongueSlotPoints, true),
  ],
  magnetPaths: isMagnetMode ? magnetGuidePaths : [],
  };
};

export const deckboxTemplate = createDeckboxTemplate();
