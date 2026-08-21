import { useMemo, useState } from "react";
import type { ArtworkPlacement, ImageInfo } from "./types/artwork";
import { BoxPreview } from "./components/BoxPreview";
import { Controls } from "./components/Controls";
import { getEffectiveDpi } from "./image/effectiveDpi";
import { deckboxTemplate } from "./templates/deckbox/template";

const initialPlacement: ArtworkPlacement = {
  scale: 1,
  panXmm: 0,
  panYmm: 0,
};

export default function App() {
  const [image, setImage] = useState<ImageInfo | null>(null);
  const [placement, setPlacement] = useState<ArtworkPlacement>(initialPlacement);

  const dpi = useMemo(() => {
    if (!image) {
      return null;
    }

    return getEffectiveDpi(image, deckboxTemplate.frontPanel, placement);
  }, [image, placement]);

  async function handleImageChange(file: File) {
    const url = URL.createObjectURL(file);
    const dimensions = await readImageDimensions(url);
    setImage({
      url,
      name: file.name,
      ...dimensions,
    });
    setPlacement(initialPlacement);
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
          image={image}
          placement={placement}
          onPan={(deltaXmm, deltaYmm) => {
            setPlacement((current) => ({
              ...current,
              panXmm: current.panXmm + deltaXmm,
              panYmm: current.panYmm + deltaYmm,
            }));
          }}
        />
        <Controls
          image={image}
          dpi={dpi}
          zoom={placement.scale}
          onImageChange={handleImageChange}
          onZoomChange={(scale) => setPlacement((current) => ({ ...current, scale }))}
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
