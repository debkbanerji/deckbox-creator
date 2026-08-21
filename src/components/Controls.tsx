import { FiEye, FiUpload } from "react-icons/fi";
import type { ImageInfo } from "../types/artwork";
import type { DpiResult } from "../image/effectiveDpi";
import { ImageQualityIndicator } from "./ImageQualityIndicator";

type Props = {
  image: ImageInfo | null;
  dpi: DpiResult | null;
  zoom: number;
  onImageChange: (file: File) => void;
  onZoomChange: (zoom: number) => void;
};

export function Controls({
  image,
  dpi,
  zoom,
  onImageChange,
  onZoomChange,
}: Props) {
  return (
    <aside className="controls" aria-label="Box controls">
      <label className="upload-control">
        <FiUpload aria-hidden />
        <span>{image ? image.name : "Choose image"}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onImageChange(file);
            }
          }}
        />
      </label>

      <div className="control-group">
        <div className="control-row">
          <label htmlFor="zoom">Zoom</label>
          <span>{zoom.toFixed(2)}x</span>
        </div>
        <input
          id="zoom"
          type="range"
          min="1"
          max="4"
          step="0.01"
          value={zoom}
          onChange={(event) => onZoomChange(Number(event.target.value))}
        />
      </div>

      <ImageQualityIndicator dpi={dpi} />

      <div className="browser-pass">
        <FiEye aria-hidden />
        <span>Browser vector pass</span>
      </div>

    </aside>
  );
}
