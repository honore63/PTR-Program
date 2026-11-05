import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type RotatingBannerHeadingProps = {
  headings: string[];
  className: string;
};

export function RotatingBannerHeading({ headings, className }: RotatingBannerHeadingProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const activeHeading = headings[activeIndex] || headings[0] || "";

  useEffect(() => {
    setActiveIndex(0);
    if (reduceMotion || headings.length < 2) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % headings.length);
    }, 4500);
    return () => window.clearInterval(intervalId);
  }, [headings, reduceMotion]);

  return (
    <div className="grid w-full" aria-live="off">
      <AnimatePresence mode="wait" initial={false}>
        <motion.h1
          key={activeHeading}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -10 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.42, ease: "easeOut" }}
          className={`col-start-1 row-start-1 ${className}`}
        >
          {activeHeading}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
}
