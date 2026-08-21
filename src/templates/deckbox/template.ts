import type { BoxTemplate, PathSegment, PointMm, RectMm } from "../../types/box";

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

const frontPanel: RectMm = {
  x: columnX,
  y: frontTop,
  width: panelWidth,
  height: panelHeight,
};

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

const topProngCut = path(`
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
`);

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
      rect: { x: columnX, y: lidTop, width: panelWidth, height: lidHeight },
    },
    {
      id: "hinge",
      label: "TOP",
      rect: { x: columnX, y: midTop, width: panelWidth, height: midPanelHeight },
    },
    {
      id: "front",
      label: "BACK",
      rect: frontPanel,
    },
    {
      id: "right-side",
      label: "SIDE",
      rect: { x: rightSideX, y: frontTop, width: depth, height: panelHeight },
    },
    {
      id: "back",
      label: "FRONT",
      rect: { x: backX, y: frontTop, width: panelWidth, height: panelHeight },
    },
    {
      id: "outer-side",
      label: "SIDE",
      rect: { x: outerSideX, y: frontTop, width: rightSideWidth, height: panelHeight },
    },
    {
      id: "glue",
      label: "GLUE",
      rect: { x: glueX, y: frontTop, width: glueWidth, height: panelHeight },
    },
  ],
  calibrationMark: {
    x: 20,
    y: pageHeightMm - 18,
    length: 50,
  },
  cutPaths: [
    topProngCut,

    // Lid dust flaps, wide and angled like the reference photo.
    poly([
      { x: columnX, y: lidTop },
      { x: columnX - 12, y: lidTop },
      { x: columnX - lidWingWidth, y: midTop - 9 },
      { x: columnX - lidWingWidth, y: midTop },
      { x: columnX, y: midTop },
    ]),
    poly([
      { x: columnRight, y: lidTop },
      { x: columnRight + 12, y: lidTop },
      { x: columnRight + lidWingWidth, y: midTop - 9 },
      { x: columnRight + lidWingWidth, y: midTop },
      { x: columnRight, y: midTop },
    ]),

    // Hinge side flaps.
    poly([
      { x: columnX, y: midTop },
      { x: columnX - 38, y: midTop + 27 },
      { x: columnX - 32, y: midTop + 36 },
      { x: columnX, y: frontTop },
    ]),
    poly([
      { x: columnRight, y: midTop },
      { x: columnRight + 38, y: midTop + 27 },
      { x: columnRight + 32, y: midTop + 36 },
      { x: columnRight, y: frontTop },
    ]),

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
    poly([
      { x: columnRight, y: frontTop },
      vLeftShoulder,
      vApex,
      vRightShoulder,
      { x: rightOuter, y: frontTop },
      { x: rightOuter, y: frontBottom },
      { x: columnRight, y: frontBottom },
    ]),

    // Bottom flaps are deliberately varied to match the photographed blank more closely.
    poly([
      { x: columnX, y: frontBottom },
      { x: columnRight, y: frontBottom },
      { x: columnRight - 6, y: bottomBottom },
      { x: columnX + 56, y: bottomBottom },
      { x: columnX + 47, y: frontBottom + depth / 2 },
      { x: columnX + 37, y: frontBottom + depth / 2 },
      { x: columnX + 33, y: bottomBottom },
      { x: columnX + 9, y: bottomBottom },
      { x: columnX, y: frontBottom },
    ]),
    poly([
      { x: rightSideX, y: frontBottom },
      { x: backX, y: frontBottom },
      { x: backX - 8, y: frontBottom + 20 },
      { x: rightSideX + 12, y: frontBottom + 20 },
      { x: rightSideX, y: frontBottom },
    ]),
    poly([
      { x: backX, y: frontBottom },
      { x: outerSideX, y: frontBottom },
      { x: outerSideX - 6, y: bottomBottom },
      { x: backX + 56, y: bottomBottom },
      { x: backX + 47, y: frontBottom + depth / 2 },
      { x: backX + 37, y: frontBottom + depth / 2 },
      { x: backX + 33, y: bottomBottom },
      { x: backX + 9, y: bottomBottom },
      { x: backX, y: frontBottom },
    ]),
    poly([
      { x: outerSideX, y: frontBottom },
      { x: rightOuter, y: frontBottom },
      { x: rightOuter - 8, y: frontBottom + 20 },
      { x: outerSideX + 12, y: frontBottom + 20 },
      { x: outerSideX, y: frontBottom },
    ]),
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
    poly(
      [
        { x: backX + 16, y: frontTop + 62.7 },
        { x: backX + 57, y: frontTop + 62.7 },
        { x: backX + 61, y: frontTop + 65.9 },
        { x: backX + 12, y: frontTop + 65.9 },
      ],
      true,
    ),
  ],
};
