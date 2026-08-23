import { useId, useRef } from "react";
import type { ArtworkBySlot, ArtworkSlotId } from "../types/artwork";
import type {
  ArtworkClip,
  ArtworkRegion,
  BoxTemplate,
  PathSegment,
  PointMm,
} from "../types/box";
import { getArtworkDrawRect } from "../image/effectiveDpi";

type Props = {
  template: BoxTemplate;
  artwork: ArtworkBySlot;
  activeSlot: ArtworkSlotId;
  backgroundColor: string;
  onSelectSlot: (slot: ArtworkSlotId) => void;
  onPan: (slot: ArtworkSlotId, deltaXmm: number, deltaYmm: number) => void;
};

export function BoxPreview({
  template,
  artwork,
  activeSlot,
  backgroundColor,
  onSelectSlot,
  onPan,
}: Props) {
  const clipId = useId().replace(/:/g, "");
  const arrowMarkerId = `${clipId}-arrow`;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragStart = useRef<{
    slot: ArtworkSlotId;
    point: PointMm;
    rotationDegrees: ArtworkRegion["rotationDegrees"];
  } | null>(null);

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

        <defs>
          <marker
            id={arrowMarkerId}
            markerWidth="5"
            markerHeight="5"
            refX="4.5"
            refY="2.5"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#000000" />
          </marker>
          {template.artworkRegions.map((region) => (
            <clipPath key={region.id} id={`${clipId}-${region.id}`}>
              {renderClip(region.clip)}
            </clipPath>
          ))}
        </defs>

        <g className="template-backgrounds">
          {template.backgroundRegions.map((region, index) => (
            <g key={index}>{renderClip(region, { fill: backgroundColor })}</g>
          ))}
        </g>

        <g className="panel-labels">
          {template.panels.map((panel) => (
            <text
              key={panel.id}
              x={panel.rect.x + panel.rect.width / 2}
              y={getPanelLabelY(template, panel.id, panel.rect.y, panel.rect.height)}
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
        </g>

        <g className="artwork-regions">
          {template.artworkRegions.map((region) =>
            renderArtworkRegion(region, artwork, `${clipId}-${region.id}`),
          )}
        </g>

        <g className="knockout-regions">
          {template.knockoutRegions.map((region, index) => (
            <g key={index}>{renderClip(region, { fill: "#ffffff" })}</g>
          ))}
        </g>

        <g className="glue-regions">
          {template.glueRegions.map((region, index) => (
            <g key={index}>{renderClip(region, { fill: "#ffffff" })}</g>
          ))}
        </g>

        <g className="glue-labels">
          {template.glueRegions.map((region, index) => {
            const center = getClipCenter(region);
            if (!center) {
              return null;
            }

            return (
              <text key={index} x={center.x} y={center.y}>
                GLUE
              </text>
            );
          })}
        </g>

        <g className="back-glue-annotations">
          {template.backGlueAnnotations.map((annotation, index) => (
            <g key={index}>
              <line
                x1={annotation.arrowFrom.x}
                y1={annotation.arrowFrom.y}
                x2={annotation.arrowTo.x}
                y2={annotation.arrowTo.y}
                markerEnd={`url(#${arrowMarkerId})`}
              />
              <text x={annotation.text.x} y={annotation.text.y}>
                {annotation.label.split("\n").map((line, lineIndex) => (
                  <tspan key={line} x={annotation.text.x} dy={lineIndex === 0 ? 0 : 5}>
                    {line}
                  </tspan>
                ))}
              </text>
            </g>
          ))}
        </g>

        <g className="score-lines">{template.scorePaths.map((path, index) => renderPath(path, index))}</g>
        <g className="cut-lines">{template.cutPaths.map((path, index) => renderPath(path, index))}</g>
        <g className="slot-lines">{template.slotPaths.map((path, index) => renderPath(path, index))}</g>
        <g className="magnet-guides">
          {template.magnetPaths?.map((path, index) => renderPath(path, index))}
        </g>

        <g className="artwork-hit-regions">
          {template.artworkRegions.map((region) => (
            <g
              key={region.id}
              className={region.slot === activeSlot ? "is-active" : undefined}
              onPointerDown={(event) => {
                onSelectSlot(region.slot);
                const slotArtwork = artwork[region.slot];
                if (!slotArtwork.image) {
                  return;
                }

                const start = getSvgPoint(event);
                if (!start) {
                  return;
                }

                dragStart.current = {
                  slot: region.slot,
                  point: start,
                  rotationDegrees: region.rotationDegrees,
                };
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

                const deltaX = next.x - dragStart.current.point.x;
                const deltaY = next.y - dragStart.current.point.y;
                const direction = dragStart.current.rotationDegrees === 180 ? -1 : 1;

                onPan(dragStart.current.slot, deltaX * direction, deltaY * direction);
                dragStart.current = { ...dragStart.current, point: next };
              }}
              onPointerUp={() => {
                dragStart.current = null;
              }}
              onPointerCancel={() => {
                dragStart.current = null;
              }}
            >
              {renderClip(region.clip, { fill: "transparent" })}
            </g>
          ))}
        </g>
      </svg>
    </section>
  );
}

function renderArtworkRegion(region: ArtworkRegion, artwork: ArtworkBySlot, clipId: string) {
  const slotArtwork = artwork[region.slot];
  if (!slotArtwork.image) {
    return null;
  }

  const drawRect = getArtworkDrawRect(
    slotArtwork.image,
    region.anchorRect,
    slotArtwork.placement,
  );
  const xOffset = region.renderRect.x - region.anchorRect.x;
  const yOffset = region.renderRect.y - region.anchorRect.y;
  const rotation = region.rotationDegrees ?? 0;
  const imageTransform =
    rotation === 180
      ? `rotate(180 ${region.renderRect.x + region.renderRect.width / 2} ${
          region.renderRect.y + region.renderRect.height / 2
        })`
      : undefined;

  return (
    <g key={region.id} clipPath={`url(#${clipId})`}>
      <image
        href={slotArtwork.image.url}
        x={drawRect.x + xOffset}
        y={drawRect.y + yOffset}
        width={drawRect.width}
        height={drawRect.height}
        transform={imageTransform}
        preserveAspectRatio="none"
      />
    </g>
  );
}

function getPanelLabelY(template: BoxTemplate, panelId: string, y: number, height: number) {
  if (panelId === "back") {
    return template.sealingMode === "magnets" ? y + 30 : y + 78;
  }

  return y + height / 2;
}

function renderClip(clip: ArtworkClip, attributes: { fill?: string } = {}) {
  if (clip.type === "rect") {
    return (
      <rect
        x={clip.rect.x}
        y={clip.rect.y}
        width={clip.rect.width}
        height={clip.rect.height}
        {...attributes}
      />
    );
  }

  if (clip.type === "path") {
    return <path d={clip.d} {...attributes} />;
  }

  return (
    <polygon
      points={clip.points.map((point) => `${point.x},${point.y}`).join(" ")}
      {...attributes}
    />
  );
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

function renderPath(path: PathSegment, index: number) {
  if (path.type === "line") {
    return <line key={index} x1={path.from.x} y1={path.from.y} x2={path.to.x} y2={path.to.y} />;
  }

  if (path.type === "path") {
    return <path key={index} d={path.d} fill="none" style={{ fill: "none" }} />;
  }

  const renderedPoints = path.closed ? [...path.points, path.points[0]] : path.points;
  const points = renderedPoints.map((point) => `${point.x},${point.y}`).join(" ");
  return <polyline key={index} points={points} fill="none" style={{ fill: "none" }} />;
}
