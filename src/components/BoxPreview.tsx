import { useId, useRef } from "react";
import type { ArtworkPlacement, ImageInfo } from "../types/artwork";
import type { BoxTemplate, PathSegment, PointMm } from "../types/box";
import { getArtworkDrawRect } from "../image/effectiveDpi";

type Props = {
  template: BoxTemplate;
  image: ImageInfo | null;
  placement: ArtworkPlacement;
  onPan: (deltaXmm: number, deltaYmm: number) => void;
};

export function BoxPreview({
  template,
  image,
  placement,
  onPan,
}: Props) {
  const clipId = useId();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragStart = useRef<PointMm | null>(null);
  const artworkRect = image ? getArtworkDrawRect(image, template.frontPanel, placement) : null;
  const dimensionPanel =
    template.panels.find((panel) => panel.label === "BACK")?.rect ?? template.frontPanel;

  function getSvgPoint(event: React.PointerEvent<SVGElement>) {
    const svg = svgRef.current;
    if (!svg) {
      return null;
    }

    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM();

    if (!matrix) {
      return null;
    }

    const transformed = point.matrixTransform(matrix.inverse());
    return { x: transformed.x, y: transformed.y };
  }

  return (
    <section className="preview-shell" aria-label="Dieline preview">
      <svg
        ref={svgRef}
        className="box-preview"
        viewBox={`0 0 ${template.pageWidthMm} ${template.pageHeightMm}`}
        role="img"
        aria-label="11 by 17 inch box dieline preview"
      >
        <g className="panel-fills">
          {template.panels.map((panel) => (
            <rect
              key={panel.id}
              x={panel.rect.x}
              y={panel.rect.y}
              width={panel.rect.width}
              height={panel.rect.height}
            />
          ))}
        </g>

        <clipPath id={clipId}>
          <rect
            x={template.frontPanel.x}
            y={template.frontPanel.y}
            width={template.frontPanel.width}
            height={template.frontPanel.height}
          />
        </clipPath>

        <rect
          x={template.frontPanel.x}
          y={template.frontPanel.y}
          width={template.frontPanel.width}
          height={template.frontPanel.height}
          className="front-panel-empty"
        />

        <g className="panel-labels">
          {template.panels.map((panel) => (
            <text
              key={panel.id}
              x={panel.rect.x + panel.rect.width / 2}
              y={panel.id === "back" ? panel.rect.y + 78 : panel.rect.y + panel.rect.height / 2}
              transform={
                panel.id === "glue"
                  ? `rotate(-90 ${panel.rect.x + panel.rect.width / 2} ${
                      panel.rect.y + panel.rect.height / 2
                    })`
                  : undefined
              }
            >
              {panel.label}
            </text>
          ))}
          <text
            className="dimension-label"
            x={dimensionPanel.x + dimensionPanel.width / 2}
            y={dimensionPanel.y + 8}
          >
            {dimensionPanel.width} mm
          </text>
          <text
            className="dimension-label"
            x={dimensionPanel.x + 8}
            y={dimensionPanel.y + dimensionPanel.height / 2}
            transform={`rotate(-90 ${dimensionPanel.x + 8} ${
              dimensionPanel.y + dimensionPanel.height / 2
            })`}
          >
            {dimensionPanel.height} mm
          </text>
        </g>

        {image && artworkRect && (
          <g clipPath={`url(#${clipId})`}>
            <image
              href={image.url}
              x={artworkRect.x}
              y={artworkRect.y}
              width={artworkRect.width}
              height={artworkRect.height}
              preserveAspectRatio="none"
            />
          </g>
        )}

        <rect
          x={template.frontPanel.x}
          y={template.frontPanel.y}
          width={template.frontPanel.width}
          height={template.frontPanel.height}
          className="front-panel-hit"
          onPointerDown={(event) => {
            if (!image) {
              return;
            }
            dragStart.current = getSvgPoint(event);
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!dragStart.current) {
              return;
            }
            const next = getSvgPoint(event);
            if (!next) {
              return;
            }
            onPan(next.x - dragStart.current.x, next.y - dragStart.current.y);
            dragStart.current = next;
          }}
          onPointerUp={() => {
            dragStart.current = null;
          }}
          onPointerCancel={() => {
            dragStart.current = null;
          }}
        />

        <g className="score-lines">{template.scorePaths.map((path, index) => renderPath(path, index))}</g>
        <g className="cut-lines">{template.cutPaths.map((path, index) => renderPath(path, index))}</g>
        <g className="slot-lines">{template.slotPaths.map((path, index) => renderPath(path, index))}</g>

      </svg>
    </section>
  );
}

function renderPath(path: PathSegment, index: number) {
  if (path.type === "line") {
    return <line key={index} x1={path.from.x} y1={path.from.y} x2={path.to.x} y2={path.to.y} />;
  }

  if (path.type === "path") {
    return <path key={index} d={path.d} />;
  }

  const renderedPoints = path.closed ? [...path.points, path.points[0]] : path.points;
  const points = renderedPoints.map((point) => `${point.x},${point.y}`).join(" ");
  return <polyline key={index} points={points} />;
}
