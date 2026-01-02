import { useEffect, useRef, useState } from "react";

export const CosmicBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shootingStars, setShootingStars] = useState<{ id: number; top: string; left: string; delay: string }[]>([]);

  useEffect(() => {
    // Generate initial shooting stars
    const initialStars = [
      { id: 1, top: "10%", left: "80%", delay: "0s" },
      { id: 2, top: "30%", left: "90%", delay: "4s" },
      { id: 3, top: "5%", left: "50%", delay: "7s" },
    ];
    setShootingStars(initialStars);

    // Add new shooting stars periodically
    const interval = setInterval(() => {
      const newStar = {
        id: Date.now(),
        top: `${Math.random() * 50}%`,
        left: `${Math.random() * 100}%`,
        delay: "0s",
      };
      setShootingStars((prev) => [...prev.slice(-5), newStar]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Space Background */}
      <div className="space-bg">
        <div className="stars" />
        {shootingStars.map((star) => (
          <div
            key={star.id}
            className="shooting-star"
            style={{
              top: star.top,
              left: star.left,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Mercury Blobs */}
      <div
        ref={containerRef}
        className="mercury-blob w-[600px] h-[600px] -top-40 -left-40 opacity-20"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="mercury-blob w-[400px] h-[400px] top-1/2 left-2/3 opacity-10"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="mercury-blob w-[300px] h-[300px] bottom-20 right-20 opacity-15"
        style={{ animationDelay: "-10s" }}
      />
    </>
  );
};
