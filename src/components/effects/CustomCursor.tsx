import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Skip on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current!;
    const ringEl = ringRef.current!;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
    };

    let raf: number;
    const animateRing = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12;
      ringEl.style.left = ring.current.x + "px";
      ringEl.style.top = ring.current.y + "px";
      raf = requestAnimationFrame(animateRing);
    };

    const onEnter = () => {
      dot.style.transform = "translate(-50%, -50%) scale(1.8)";
      ringEl.style.width = "48px";
      ringEl.style.height = "48px";
      ringEl.style.borderColor = "rgba(255, 215, 0, 0.9)";
    };
    const onLeave = () => {
      dot.style.transform = "translate(-50%, -50%) scale(1)";
      ringEl.style.width = "32px";
      ringEl.style.height = "32px";
      ringEl.style.borderColor = "rgba(255, 215, 0, 0.5)";
    };

    const observe = () => {
      document.querySelectorAll("a, button, [role='button'], input, label, textarea, select").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    document.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(animateRing);

    // Observe initially + on DOM changes
    observe();
    const mo = new MutationObserver(() => observe());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      mo.disconnect();
    };
  }, []);

  // Hide on touch devices via CSS
  return (
    <>
      <div
        ref={dotRef}
        className="hidden lg:block"
        style={{
          position: "fixed",
          width: 10,
          height: 10,
          background: "#FFD700",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.08s ease, opacity 0.2s ease",
          mixBlendMode: "difference",
          boxShadow: "0 0 8px rgba(255,215,0,0.8), 0 0 20px rgba(255,215,0,0.3)",
        }}
      />
      <div
        ref={ringRef}
        className="hidden lg:block"
        style={{
          position: "fixed",
          width: 32,
          height: 32,
          border: "1.5px solid rgba(255,215,0,0.5)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 99998,
          transform: "translate(-50%, -50%)",
          transition: "transform 0.18s ease, width 0.2s ease, height 0.2s ease, border-color 0.2s ease",
        }}
      />
    </>
  );
}
