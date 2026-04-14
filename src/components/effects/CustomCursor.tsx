import { useEffect, useRef } from "react";

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = canvasRef.current!;

    // Draw golden arrow on canvas
    const ctx = el.getContext("2d")!;
    ctx.clearRect(0, 0, 20, 24);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 18);
    ctx.lineTo(4.5, 14);
    ctx.lineTo(9, 22);
    ctx.lineTo(11.5, 21);
    ctx.lineTo(7, 13);
    ctx.lineTo(12, 13);
    ctx.closePath();
    ctx.fillStyle = "#FFD700";
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.6)";
    ctx.lineWidth = 0.8;
    ctx.stroke();

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
    };

    const onEnter = () => {
      el.style.transform = "scale(1.2)";
      el.style.filter = "drop-shadow(0 0 7px rgba(255, 215, 0, 0.9))";
    };
    const onLeave = () => {
      el.style.transform = "scale(1)";
      el.style.filter = "drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))";
    };

    const observe = () => {
      document.querySelectorAll("a, button, [role='button'], input, label, textarea, select").forEach((e) => {
        e.addEventListener("mouseenter", onEnter);
        e.addEventListener("mouseleave", onLeave);
      });
    };

    document.addEventListener("mousemove", onMove);
    observe();
    const mo = new MutationObserver(() => observe());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      mo.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={20}
      height={24}
      className="hidden lg:block"
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 99999,
        transform: "scale(1)",
        filter: "drop-shadow(0 0 4px rgba(255, 215, 0, 0.6))",
        transition: "transform 0.15s ease, filter 0.15s ease",
      }}
    />
  );
}
