import type { DpiResult } from "../image/effectiveDpi";

type Props = {
  dpi: DpiResult | null;
};

export function ImageQualityIndicator({ dpi }: Props) {
  if (!dpi) {
    return (
      <div className="quality quality-empty">
        <span className="quality-dot" />
        <span>No image loaded</span>
      </div>
    );
  }

  return (
    <div className={`quality quality-${dpi.rating}`}>
      <span className="quality-dot" />
      <span>
        Image quality: {dpi.label} ({dpi.dpi} DPI)
      </span>
    </div>
  );
}
