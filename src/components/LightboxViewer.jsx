import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Download from "yet-another-react-lightbox/plugins/download";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";

// This whole module (plus its ~30kb of plugin/CSS) is code-split via
// React.lazy in Gallery.jsx, so it never touches the initial bundle — it's
// only fetched the first time someone actually opens a photo.
export default function LightboxViewer({ open, index, images, onClose }) {
  const slides = images.map((image) => ({
    src: image.src,
    alt: image.alt,
    download: image.src,
  }));

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={slides}
      plugins={[Zoom, Fullscreen, Download, Counter]}
      counter={{ container: { style: { top: "unset", bottom: 0 } } }}
      carousel={{ finite: false, preload: 2 }}
      animation={{ swipe: 250 }}
      controller={{ closeOnBackdropClick: true }}
    />
  );
}
