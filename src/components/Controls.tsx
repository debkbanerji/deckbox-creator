import { FiDownload, FiUpload, FiX } from "react-icons/fi";
import type { ArtworkBySlot, ArtworkSlotId } from "../types/artwork";
import type { DeckboxSealingMode } from "../templates/deckbox/template";

type Props = {
  artwork: ArtworkBySlot;
  activeSlot: ArtworkSlotId;
  backgroundColor: string;
  sealingMode: DeckboxSealingMode;
  isExporting: boolean;
  onActiveSlotChange: (slot: ArtworkSlotId) => void;
  onBackgroundColorChange: (color: string) => void;
  onSealingModeChange: (mode: DeckboxSealingMode) => void;
  onExport: () => void;
  onImageChange: (slot: ArtworkSlotId, file: File) => void;
  onImageClear: (slot: ArtworkSlotId) => void;
  onZoomChange: (slot: ArtworkSlotId, zoom: number) => void;
};

const uploadSlots: Array<{ id: ArtworkSlotId; label: string }> = [
  { id: "front", label: "Front" },
  { id: "back", label: "Back" },
  { id: "top", label: "Top" },
  { id: "leftSide", label: "Left side" },
  { id: "rightSide", label: "Right side" },
];

export function Controls({
  artwork,
  activeSlot,
  backgroundColor,
  sealingMode,
  isExporting,
  onActiveSlotChange,
  onBackgroundColorChange,
  onSealingModeChange,
  onExport,
  onImageChange,
  onImageClear,
  onZoomChange,
}: Props) {
  return (
    <aside className="controls" aria-label="Box controls">
      <div className="artwork-slots">
        {uploadSlots.map((slot) => {
          const slotArtwork = artwork[slot.id];
          const inputId = `${slot.id}-zoom`;
          return (
            <div
              key={slot.id}
              className={`artwork-slot ${slot.id === activeSlot ? "is-active" : ""}`}
              onClick={() => onActiveSlotChange(slot.id)}
            >
              <div className="upload-row">
                <label className="upload-control">
                  <FiUpload aria-hidden />
                  <span className="upload-label">{slot.label}</span>
                  <span className="upload-name">{slotArtwork.image?.name ?? "Choose image"}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        onImageChange(slot.id, file);
                      }
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
                {slotArtwork.image && (
                  <button
                    className="clear-image-button"
                    type="button"
                    aria-label={`Clear ${slot.label} image`}
                    onClick={(event) => {
                      event.stopPropagation();
                      onImageClear(slot.id);
                    }}
                  >
                    <FiX aria-hidden />
                  </button>
                )}
                {!slotArtwork.image && <span className="clear-image-placeholder" aria-hidden />}
              </div>
              <div className="slot-zoom">
                <div className="control-row">
                  <label htmlFor={inputId}>Zoom</label>
                  <span>{slotArtwork.placement.scale.toFixed(2)}x</span>
                </div>
                <input
                  id={inputId}
                  type="range"
                  min="0.25"
                  max="4"
                  step="0.01"
                  value={slotArtwork.placement.scale}
                  onFocus={() => onActiveSlotChange(slot.id)}
                  onChange={(event) => onZoomChange(slot.id, Number(event.target.value))}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="color-control">
        <div className="control-row">
          <label htmlFor="background-color">Background</label>
          <span>{backgroundColor.toUpperCase()}</span>
        </div>
        <input
          id="background-color"
          type="color"
          value={backgroundColor}
          onChange={(event) => onBackgroundColorChange(event.target.value)}
        />
      </div>

      <div className="mode-control" aria-label="Closure mode">
        <div className="control-row">
          <span>Closure</span>
          <span>{sealingMode === "tongue" ? "Insert" : "Magnet"}</span>
        </div>
        <div className="segmented-control">
          <button
            type="button"
            className={sealingMode === "tongue" ? "is-active" : undefined}
            onClick={() => onSealingModeChange("tongue")}
          >
            Insert
          </button>
          <button
            type="button"
            className={sealingMode === "magnets" ? "is-active" : undefined}
            onClick={() => onSealingModeChange("magnets")}
          >
            Magnet
          </button>
        </div>
      </div>

      <button className="export-button" type="button" onClick={onExport} disabled={isExporting}>
        <FiDownload aria-hidden />
        {isExporting ? "Downloading PDF" : "Download PDF"}
      </button>
    </aside>
  );
}
