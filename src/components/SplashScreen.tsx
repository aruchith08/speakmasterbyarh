import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Skip splash on repeat visits within the same browser session
    if (typeof window !== "undefined" && sessionStorage.getItem("splash_shown") === "1") {
      setIsVisible(false);
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("splash_shown", "1");
      }
      setTimeout(onComplete, 800); // Wait for exit animation
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
        >
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
          
          {/* Main content */}
          <div className="relative flex flex-col items-center gap-8">
            {/* Logo with circles */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center gap-6"
            >
              {/* Left circle with inner dot */}
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-16 h-16 rounded-full border-[3px] border-foreground flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="w-6 h-6 rounded-full bg-foreground"
                  />
                </motion.div>
              </div>

              {/* Brand name */}
              <div className="flex items-baseline">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="font-heading text-4xl md:text-5xl font-bold text-foreground tracking-wider"
                >
                  SPEAK
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="font-heading text-4xl md:text-5xl font-bold text-muted-foreground tracking-wider"
                >
                  MASTER
                </motion.span>
              </div>

              {/* Right decorative circle */}
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-16 h-16 rounded-full border border-muted-foreground/30 flex items-center justify-center"
              >
                <div className="w-12 h-12 rounded-full border border-muted-foreground/20" />
              </motion.div>
            </motion.div>

            {/* Signature */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <span className="text-sm tracking-widest">by</span>
              <span className="font-heading text-lg tracking-[0.3em] text-foreground/80">
                ARH
              </span>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-16 w-48"
            >
              <div className="h-0.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: 1, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
