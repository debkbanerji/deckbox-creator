import { useState } from "react";
import type { ArtworkBySlot, ArtworkPlacement, ArtworkSlotId, ImageInfo } from "./types/artwork";
import { BoxPreview } from "./components/BoxPreview";
import { Controls } from "./components/Controls";
import { deckboxTemplate } from "./templates/deckbox/template";

const initialPlacement: ArtworkPlacement = {
  scale: 1,
  panXmm: 0,
  panYmm: 0,
};

function createInitialArtwork(): ArtworkBySlot {
  return {
    front: { image: null, placement: initialPlacement },
    back: { image: null, placement: initialPlacement },
    top: { image: null, placement: initialPlacement },
    leftSide: { image: null, placement: initialPlacement },
    rightSide: { image: null, placement: initialPlacement },
  };
}

export default function App() {
  const [artwork, setArtwork] = useState<ArtworkBySlot>(createInitialArtwork);
  const [activeSlot, setActiveSlot] = useState<ArtworkSlotId>("front");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");

  async function handleImageChange(slot: ArtworkSlotId, file: File) {
    const url = URL.createObjectURL(file);
    const dimensions = await readImageDimensions(url);
    setActiveSlot(slot);
    setArtwork((current) => {
      const previousUrl = current[slot].image?.url;
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }

      return {
        ...current,
        [slot]: {
          image: {
            url,
            name: file.name,
            ...dimensions,
          },
          placement: initialPlacement,
        },
      };
    });
  }

  function handleImageClear(slot: ArtworkSlotId) {
    setArtwork((current) => {
      const previousUrl = current[slot].image?.url;
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }

      return {
        ...current,
        [slot]: {
          image: null,
          placement: initialPlacement,
        },
      };
    });
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <h1>Deb&apos;s Deckbox Creator</h1>
        </div>
      </header>

      <div className="workspace">
        <BoxPreview
          template={deckboxTemplate}
          artwork={artwork}
          activeSlot={activeSlot}
          backgroundColor={backgroundColor}
          onSelectSlot={setActiveSlot}
          onPan={(slot, deltaXmm, deltaYmm) => {
            setArtwork((current) => ({
              ...current,
              [slot]: {
                ...current[slot],
                placement: {
                  ...current[slot].placement,
                  panXmm: current[slot].placement.panXmm + deltaXmm,
                  panYmm: current[slot].placement.panYmm + deltaYmm,
                },
              },
            }));
          }}
        />
        <Controls
          artwork={artwork}
          activeSlot={activeSlot}
          backgroundColor={backgroundColor}
          onActiveSlotChange={setActiveSlot}
          onBackgroundColorChange={setBackgroundColor}
          onImageChange={handleImageChange}
          onImageClear={handleImageClear}
          onZoomChange={(slot, scale) =>
            setArtwork((current) => ({
              ...current,
              [slot]: {
                ...current[slot],
                placement: {
                  ...current[slot].placement,
                  scale,
                },
              },
            }))
          }
        />
      </div>
    </main>
  );
}

function readImageDimensions(url: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("Unable to read uploaded image."));
    image.src = url;
  });
}
