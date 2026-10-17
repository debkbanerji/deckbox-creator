import { GState, jsPDF } from "jspdf";
import type { ArtworkBySlot, ImageInfo } from "../types/artwork";
import type { ArtworkClip, ArtworkRegion, BoxTemplate, PathSegment, PointMm, RectMm } from "../types/box";
import { getArtworkDrawRect } from "../image/effectiveDpi";

type PdfOptions = {
  artwork: ArtworkBySlot;
  backgroundColor: string;
  filename?: string;
};

type PdfPage = {
  name: string;
  widthMm: number;
  heightMm: number;
};

type PdfLayout = {
  page: PdfPage;
  offset: PointMm;
};

type PdfPathOp = {
  op: "m" | "l" | "c" | "h";
  c: number[];
};

const pdfLineWidthMm = 0.15;

export async function downloadDeckboxPdf(template: BoxTemplate, options: PdfOptions) {
  const pdf = await createDeckboxPdf(template, options);
  pdf.save(options.filename ?? "Deckbox.pdf");
}

export async function createDeckboxPdf(template: BoxTemplate, options: PdfOptions) {
  const layout = choosePdfLayout(template);
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [layout.page.widthMm, layout.page.heightMm],
    compress: true,
  });

  fillPage(pdf, layout.page);
  drawBackgrounds(pdf, template, options.backgroundColor, layout.offset);
  await drawArtwork(pdf, template, options.artwork, layout.offset);
  drawClipFills(pdf, template.knockoutRegions, "#ffffff", layout.offset);
  drawClipFills(pdf, template.glueRegions, "#ffffff", layout.offset);
  drawGlueLabels(pdf, template, layout.offset);
  drawBackGlueAnnotations(pdf, template, layout.offset);
  drawScoreLines(pdf, template, layout.offset);
  drawCutLines(pdf, template, layout.offset);
  drawMagnetGuides(pdf, template, layout.offset);
  drawDesignCredit(pdf, layout.page);

  return pdf;
}

export function getDeckboxPdfLayout(template: BoxTemplate) {
  return choosePdfLayout(template);
}

function choosePdfLayout(template: BoxTemplate): PdfLayout {
  return {
    page: {
      name: "11 x 17 in",
      widthMm: template.pageWidthMm,
      heightMm: template.pageHeightMm,
    },
    offset: { x: 0, y: 0 },
  };
}

function fillPage(pdf: jsPDF, page: PdfPage) {
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, page.widthMm, page.heightMm, "F");
}

function drawDesignCredit(pdf: jsPDF, page: PdfPage) {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(14);
  pdf.setTextColor(23, 32, 42);
  const lines = ["Created with", "deckbox.debkbanerji.com"];
  const textHeight = pdf.getTextDimensions(lines.join("\n")).h;
  pdf.text(lines, page.widthMm / 4 + 15, page.heightMm * 0.75 - 15 - textHeight / 2, {
    align: "center",
    baseline: "top",
  });
}

function drawBackgrounds(
  pdf: jsPDF,
  template: BoxTemplate,
  backgroundColor: string,
  offset: PointMm,
) {
  drawClipFills(pdf, template.backgroundRegions, backgroundColor, offset);
}

async function drawArtwork(
  pdf: jsPDF,
  template: BoxTemplate,
  artwork: ArtworkBySlot,
  offset: PointMm,
) {
  for (const region of template.artworkRegions) {
    const slotArtwork = artwork[region.slot];
    if (!slotArtwork.image) {
      continue;
    }

    const image = await getArtworkPdfImage(region, slotArtwork.image.url);
    const imageRect = getArtworkPdfRect(region, slotArtwork.image, slotArtwork.placement);

    pdf.saveGraphicsState();
    pdf.path(toPdfPathOps(clipToPathOps(region.clip), offset));
    pdf.clip();
    pdf.discardPath();
    pdf.addImage(
      image,
      "PNG",
      imageRect.x + offset.x,
      imageRect.y + offset.y,
      imageRect.width,
      imageRect.height,
    );
    pdf.restoreGraphicsState();
  }
}

function getArtworkPdfRect(
  region: ArtworkRegion,
  image: ImageInfo,
  placement: ArtworkBySlot[ArtworkRegion["slot"]]["placement"],
) {
  const drawRect = getArtworkDrawRect(image, region.anchorRect, placement);
  const xOffset = region.renderRect.x - region.anchorRect.x;
  const yOffset = region.renderRect.y - region.anchorRect.y;
  const rect = {
    x: drawRect.x + xOffset,
    y: drawRect.y + yOffset,
    width: drawRect.width,
    height: drawRect.height,
  };

  if (region.rotationDegrees !== 180) {
    return rect;
  }

  const centerX = region.renderRect.x + region.renderRect.width / 2;
  const centerY = region.renderRect.y + region.renderRect.height / 2;

  return {
    x: centerX * 2 - rect.x - rect.width,
    y: centerY * 2 - rect.y - rect.height,
    width: rect.width,
    height: rect.height,
  };
}

async function getArtworkPdfImage(region: ArtworkRegion, url: string) {
  const image = await loadImage(url);

  if (region.rotationDegrees !== 180) {
    return image;
  }

  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to create rotated export image.");
  }

  context.translate(canvas.width / 2, canvas.height / 2);
  context.rotate(Math.PI);
  context.drawImage(image, -canvas.width / 2, -canvas.height / 2);

  return canvas;
}

function drawClipFills(
  pdf: jsPDF,
  clips: ArtworkClip[],
  color: string,
  offset: PointMm,
) {
  const { r, g, b } = parseHexColor(color);
  pdf.setFillColor(r, g, b);
  pdf.setLineJoin("miter");
  clips.forEach((clip) => {
    const path = toPdfPathOps(clipToPathOps(clip), offset);
    pdf.path(path);
    pdf.fill();
  });
}

function drawGlueLabels(pdf: jsPDF, template: BoxTemplate, offset: PointMm) {
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);

  template.glueRegions.forEach((region, index) => {
    const center = getClipCenter(region);
    if (!center) {
      return;
    }

    const fontSize = index === 0 ? 7 : 8.5;
    pdf.setFontSize(fontSize);
    const textDimensions = pdf.getTextDimensions("GLUE");
    const panelGlueXOffset = index === 0 ? textDimensions.h : 0;
    const panelGlueYOffset = index === 0 ? -textDimensions.w / 2 - 0.8 : 0;
    pdf.text(
      "GLUE",
      center.x + offset.x + panelGlueXOffset,
      center.y + offset.y + panelGlueYOffset,
      {
        align: "center",
        baseline: "middle",
        angle: index === 0 ? 270 : 0,
      },
    );
  });
}

function drawBackGlueAnnotations(pdf: jsPDF, template: BoxTemplate, offset: PointMm) {
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9.5);
  pdf.setTextColor(0, 0, 0);
  pdf.setDrawColor(0, 0, 0);
  pdf.setFillColor(0, 0, 0);
  pdf.setLineWidth(pdfLineWidthMm);

  template.backGlueAnnotations.forEach((annotation) => {
    const from = addOffset(annotation.arrowFrom, offset);
    const to = addOffset(annotation.arrowTo, offset);
    pdf.line(from.x, from.y, to.x, to.y);
    drawArrowhead(pdf, from, to);
    pdf.text(annotation.label.split("\n"), annotation.text.x + offset.x, annotation.text.y + offset.y, {
      align: "center",
      baseline: "middle",
      lineHeightFactor: 1.05,
    });
  });
}

function drawScoreLines(pdf: jsPDF, template: BoxTemplate, offset: PointMm) {
  pdf.saveGraphicsState();
  pdf.setGState(new GState({ "stroke-opacity": 0.28 }));
  pdf.setDrawColor(17, 24, 39);
  pdf.setLineWidth(pdfLineWidthMm);
  drawPaths(pdf, template.scorePaths, offset);
  pdf.restoreGraphicsState();
}

function drawCutLines(pdf: jsPDF, template: BoxTemplate, offset: PointMm) {
  pdf.setDrawColor(17, 24, 39);
  pdf.setLineWidth(pdfLineWidthMm);
  drawPaths(pdf, template.cutPaths, offset);
  drawPaths(pdf, template.slotPaths, offset);
}

function drawMagnetGuides(pdf: jsPDF, template: BoxTemplate, offset: PointMm) {
  if (!template.magnetPaths?.length) {
    return;
  }

  pdf.saveGraphicsState();
  pdf.setGState(new GState({ "stroke-opacity": 0.7 }));
  pdf.setDrawColor(17, 24, 39);
  pdf.setLineWidth(pdfLineWidthMm);
  drawPaths(pdf, template.magnetPaths, offset);
  pdf.restoreGraphicsState();
}

function drawPaths(pdf: jsPDF, paths: PathSegment[], offset: PointMm) {
  paths.forEach((path) => {
    pdf.path(toPdfPathOps(pathSegmentToPathOps(path), offset));
    pdf.stroke();
  });
}

function drawArrowhead(pdf: jsPDF, from: PointMm, to: PointMm) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const length = 3.2;
  const halfWidth = 1.35;
  const base = {
    x: to.x - Math.cos(angle) * length,
    y: to.y - Math.sin(angle) * length,
  };
  const perpendicular = angle + Math.PI / 2;
  const points = [
    to,
    {
      x: base.x + Math.cos(perpendicular) * halfWidth,
      y: base.y + Math.sin(perpendicular) * halfWidth,
    },
    {
      x: base.x - Math.cos(perpendicular) * halfWidth,
      y: base.y - Math.sin(perpendicular) * halfWidth,
    },
  ];

  pdf.triangle(points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y, "F");
}

function pathSegmentToPathOps(path: PathSegment): PdfPathOp[] {
  if (path.type === "line") {
    return [
      { op: "m", c: [path.from.x, path.from.y] },
      { op: "l", c: [path.to.x, path.to.y] },
    ];
  }

  if (path.type === "path") {
    return parsePathData(path.d);
  }

  if (path.points.length === 0) {
    return [];
  }

  const ops: PdfPathOp[] = [
    { op: "m", c: [path.points[0].x, path.points[0].y] },
    ...path.points.slice(1).map((point) => ({ op: "l" as const, c: [point.x, point.y] })),
  ];

  if (path.closed) {
    ops.push({ op: "h", c: [] });
  }

  return ops;
}

function clipToPathOps(clip: ArtworkClip): PdfPathOp[] {
  if (clip.type === "rect") {
    const { x, y, width, height } = clip.rect;
    return [
      { op: "m", c: [x, y] },
      { op: "l", c: [x + width, y] },
      { op: "l", c: [x + width, y + height] },
      { op: "l", c: [x, y + height] },
      { op: "h", c: [] },
    ];
  }

  if (clip.type === "path") {
    return parsePathData(clip.d);
  }

  return pathSegmentToPathOps({ type: "polyline", points: clip.points, closed: true });
}

function toPdfPathOps(ops: PdfPathOp[], offset: PointMm): PdfPathOp[] {
  return ops.map((op) => {
    if (op.op === "h") {
      return op;
    }

    const c = [...op.c];
    for (let index = 0; index < c.length; index += 2) {
      c[index] += offset.x;
      c[index + 1] += offset.y;
    }

    return { ...op, c };
  });
}

function parsePathData(d: string): PdfPathOp[] {
  const tokens = d.match(/[MLCZ]|-?\d+(?:\.\d+)?/g) ?? [];
  const ops: PdfPathOp[] = [];
  let index = 0;

  while (index < tokens.length) {
    const command = tokens[index++];

    if (command === "M" || command === "L") {
      ops.push({
        op: command === "M" ? "m" : "l",
        c: [Number(tokens[index++]), Number(tokens[index++])],
      });
      continue;
    }

    if (command === "C") {
      ops.push({
        op: "c",
        c: [
          Number(tokens[index++]),
          Number(tokens[index++]),
          Number(tokens[index++]),
          Number(tokens[index++]),
          Number(tokens[index++]),
          Number(tokens[index++]),
        ],
      });
      continue;
    }

    if (command === "Z") {
      ops.push({ op: "h", c: [] });
    }
  }

  return ops;
}

function getClipBounds(clip: ArtworkClip): RectMm {
  if (clip.type === "rect") {
    return clip.rect;
  }

  return getPointsBounds(getClipPoints(clip));
}

function getClipPoints(clip: ArtworkClip): PointMm[] {
  if (clip.type === "rect") {
    const { x, y, width, height } = clip.rect;
    return [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
    ];
  }

  if (clip.type === "polygon") {
    return clip.points;
  }

  return getPathDataPoints(clip.d);
}

function getPathDataPoints(d: string): PointMm[] {
  const values = d.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
  const points: PointMm[] = [];

  for (let index = 0; index < values.length; index += 2) {
    points.push({ x: values[index], y: values[index + 1] });
  }

  return points;
}

function getPointsBounds(points: PointMm[]): RectMm {
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function getClipCenter(clip: ArtworkClip): PointMm | null {
  if (clip.type === "rect") {
    return {
      x: clip.rect.x + clip.rect.width / 2,
      y: clip.rect.y + clip.rect.height / 2,
    };
  }

  if (clip.type === "polygon") {
    return clip.points.reduce(
      (total, point) => ({
        x: total.x + point.x / clip.points.length,
        y: total.y + point.y / clip.points.length,
      }),
      { x: 0, y: 0 },
    );
  }

  return null;
}

function addOffset(point: PointMm, offset: PointMm): PointMm {
  return {
    x: point.x + offset.x,
    y: point.y + offset.y,
  };
}

function parseHexColor(color: string) {
  const normalized = color.replace("#", "");
  const value = normalized.length === 3
    ? normalized.split("").map((character) => character + character).join("")
    : normalized;

  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load uploaded image."));
    image.src = url;
  });
}
