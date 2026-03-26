import { useCursor } from "@/hooks/useCursor";
import { useEffect, useRef, useState } from "react";

export default function CursorFollower() {
  const { x, y } = useCursor();

  const posRef = useRef({ x: 0, y: 0 });
  const [dots, setDots] = useState(
    Array.from({ length: 6 }, () => ({ x: 0, y: 0 }))
  );

  // 🔥 update ref (no re-render)
  useEffect(() => {
    posRef.current = { x, y };
  }, [x, y]);

  useEffect(() => {
    const speed = 0.12;
    let animationFrame: number;

    const follow = () => {
      setDots(prev => {
        const newDots = [...prev];
        const { x, y } = posRef.current;

        newDots[0] = {
          x: prev[0].x + (x - prev[0].x) * speed,
          y: prev[0].y + (y - prev[0].y) * speed,
        };

        for (let i = 1; i < newDots.length; i++) {
          newDots[i] = {
            x: prev[i].x + (newDots[i - 1].x - prev[i].x) * speed,
            y: prev[i].y + (newDots[i - 1].y - prev[i].y) * speed,
          };
        }

        return newDots;
      });

      animationFrame = requestAnimationFrame(follow);
    };

    animationFrame = requestAnimationFrame(follow);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <>
      {dots.map((dot, i) => (
        <div
          key={i}
          style={{
            position: "fixed",
            left: dot.x,
            top: dot.y,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 9999,
            opacity: 1 - i * 0.15,
          }}
        >
          <div
            style={{
              width: `${20 - i * 2}px`,
              height: `${20 - i * 2}px`,
              borderRadius: "50%",
              background: "rgba(255, 120, 220, 0.7)",
              filter: "blur(12px)",
            }}
          />
        </div>
      ))}
    </>
  );
}
