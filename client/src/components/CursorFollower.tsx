import { useCursor } from "@/hooks/useCursor";
import { useEffect, useRef, useState } from "react";


export default function CursorFollower() {
  const [isHovering, setIsHovering] = useState(false);
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

  useEffect(() => {
  const handleEnter = () => setIsHovering(true);
  const handleLeave = () => setIsHovering(false);

 const elements = document.querySelectorAll("button, a, input, textarea");

  elements.forEach(el => {
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);
  });

  return () => {
    elements.forEach(el => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    });
  };
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
           transform: `translate(-50%, -50%) scale(${isHovering && i === 0 ? 2 : 1})`,
transition: "transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
            pointerEvents: "none",
            zIndex: 9999,
            opacity: 1 - i * 0.15,
            boxShadow: isHovering && i === 0
  ? "0 0 30px rgba(255, 200, 100, 0.5)"
  : "none",
          }}
        >
          <div
            style={{
              width: `${20 - i * 2}px`,
              height: `${20 - i * 2}px`,
              borderRadius: "50%",
              background: isHovering
  ? "linear-gradient(135deg, #ffd166, #ff70a6)"
  : "linear-gradient(135deg, #ff70a6, #c77dff)",
      
              filter: "blur(16px)",
            }}
          />
        </div>
      ))}
    </>
  );
}
