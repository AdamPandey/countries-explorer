import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

export function TickerColumn({ photos, direction = "up" }) {
  const controls = useAnimation();

  useEffect(() => {
    const animationProps = {
      y: direction === "up" ? "-50%" : "0%",
      transition: {
        duration: 30 + Math.random() * 15, 
        ease: "linear",
        repeat: Infinity,
      },
    };
    controls.start(animationProps);
  }, [controls, direction]);

  const handleHoverStart = () => controls.stop();
  const handleHoverEnd = () => {
     const animationProps = {
      y: direction === "up" ? "-50%" : "0%",
      transition: {
        duration: 30 + Math.random() * 15,
        ease: "linear",
        repeat: Infinity,
      },
    };
    controls.start(animationProps);
  };

  const initialY = direction === "up" ? "0%" : "-50%";

  return (
    <motion.div
      className="flex flex-col gap-4"
      initial={{ y: initialY }}
      animate={controls}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      {[...photos, ...photos].map((photo, index) => (
        <div key={`${photo.id}-${index}`} className="relative h-56 w-full rounded-xl overflow-hidden shadow-lg">
          <img
            // --- USE A HIGHER QUALITY IMAGE ---
            src={photo.src.large} 
            // ------------------------------------
            alt={photo.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 bg-black/50 text-white p-2 text-sm rounded-tr-lg">
            {photo.countryName}
          </div>
        </div>
      ))}
    </motion.div>
  );
}