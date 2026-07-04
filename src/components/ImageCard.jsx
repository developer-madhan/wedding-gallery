// Placeholder production scaffold
import { motion } from "motion/react";
export default function ImageCard({ image, onClick }) {
  return (
    <motion.div className="image-card" whileHover={{ scale: 1.02 }}>
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onClick={onClick}
      />
      <div className="image-number">{image.number}</div>
    </motion.div>
  );
}
