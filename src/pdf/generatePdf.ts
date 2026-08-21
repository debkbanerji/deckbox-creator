import { jsPDF } from "jspdf";
import type { ArtworkPlacement, ImageInfo } from "../types/artwork";
import type { BoxTemplate, PathSegment } from "../types/box";
import { renderPanelArtwork } from "../image/cropImage";

type PdfOptions = {
  image: ImageInfo | null;
  placement: ArtworkPlacement;
  showCutLines: boolean;
  showScoreLines: boolean;
};

export async function generatePdf(template: BoxTemplate, options: PdfOptions) {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [template.pageWidthMm, template.pageHeightMm],
  });

  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, template.pageWidthMm, template.pageHeightMm, "F");

  if (options.image) {
    const artwork = await renderPanelArtwork(options.image, template.frontPanel, options.placement);
    pdf.addImage(
      artwork,
      "JPEG",
      template.frontPanel.x,
      template.frontPanel.y,
      template.frontPanel.width,
      template.frontPanel.height,
    );
  }

  if (options.showScoreLines) {
    pdf.setDrawColor(145, 151, 161);
    pdf.setLineWidth(0.18);
    pdf.setLineDashPattern([2.2, 1.6], 0);
    drawPaths(pdf, template.scorePaths);
    pdf.setLineDashPattern([], 0);
  }

  if (options.showCutLines) {
    pdf.setDrawColor(17, 24, 39);
    pdf.setLineWidth(0.25);
    drawPaths(pdf, template.cutPaths);
    pdf.setDrawColor(17, 24, 39);
    pdf.setLineWidth(0.28);
    drawPaths(pdf, template.slotPaths);
  }

  drawCalibration(pdf, template);
  pdf.save("custom-deckbox-dieline.pdf");
}

function drawPaths(pdf: jsPDF, paths: PathSegment[]) {
  paths.forEach((path) => {
    if (path.type === "line") {
      pdf.line(path.from.x, path.from.y, path.to.x, path.to.y);
      return;
    }

    if (path.type === "path") {
      return;
    }

    path.points.forEach((point, index) => {
      const next = path.points[index + 1];
      if (next) {
        pdf.line(point.x, point.y, next.x, next.y);
      }
    });

    if (path.closed && path.points.length > 1) {
      const first = path.points[0];
      const last = path.points[path.points.length - 1];
      pdf.line(last.x, last.y, first.x, first.y);
    }
  });
}

function drawCalibration(pdf: jsPDF, template: BoxTemplate) {
  const { x, y, length } = template.calibrationMark;

  pdf.setDrawColor(17, 24, 39);
  pdf.setLineWidth(0.2);
  pdf.line(x, y, x + length, y);
  pdf.line(x, y - 2, x, y + 2);
  pdf.line(x + length, y - 2, x + length, y + 2);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7);
  pdf.setTextColor(17, 24, 39);
  pdf.text("PRINT AT 100% / ACTUAL SIZE", x, y - 6);
  pdf.text("50 mm calibration", x, y + 6);
  pdf.text("SOLID = CUT/SLOT   DASHED = SCORE/FOLD", template.pageWidthMm - 108, y + 6);
}
