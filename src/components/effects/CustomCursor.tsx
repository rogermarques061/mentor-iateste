import { useEffect, useRef } from "react";

export function CustomCursor() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = svgRef.current!;

    const onMove = (e: MouseEvent) => {
      el.style.left = e.clientX + "px";
      el.style.top = e.clientY + "px";
    };

    const onEnter = () => {
      el.style.transform = "scale(1.15)";
      const blurs = el.querySelectorAll("feGaussianBlur");
      if (blurs[0]) blurs[0].setAttribute("stdDeviation", "3.5");
      if (blurs[1]) blurs[1].setAttribute("stdDeviation", "8");
    };
    const onLeave = () => {
      el.style.transform = "scale(1)";
      const blurs = el.querySelectorAll("feGaussianBlur");
      if (blurs[0]) blurs[0].setAttribute("stdDeviation", "2.5");
      if (blurs[1]) blurs[1].setAttribute("stdDeviation", "5");
    };

    const onDown = () => { el.style.transform = "scale(0.88)"; };
    const onUp = () => { el.style.transform = "scale(1)"; };

    const observe = () => {
      document.querySelectorAll("a, button, [role='button'], input, label, textarea, select").forEach((e) => {
        e.addEventListener("mouseenter", onEnter);
        e.addEventListener("mouseleave", onLeave);
      });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    observe();
    const mo = new MutationObserver(() => observe());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      mo.disconnect();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      width="22"
      height="26"
      viewBox="0 0 22 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden lg:block"
      style={{
        position: "fixed",
        pointerEvents: "none",
        zIndex: 99999,
        transform: "scale(1)",
        transition: "transform 0.12s ease",
        willChange: "transform, left, top",
      }}
    >
      <defs>
        <filter id="gold-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="blur1" />
          <feGaussianBlur stdDeviation="5" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF5A0" />
          <stop offset="45%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      <path
        d="M2 1 L2 22 L8 16.5 L14 24 L17 22.5 L11 15 L20 15 Z"
        fill="url(#gold-grad)"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="0.6"
        strokeLinejoin="round"
        filter="url(#gold-glow)"
      />
    </svg>
  );
}
