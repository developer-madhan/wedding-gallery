import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";
export default function LightboxViewer({open,index,images,onClose}) {
  return <Lightbox open={open} close={onClose} index={index} slides={images} plugins={[Zoom,Fullscreen,Download]} />;
}
