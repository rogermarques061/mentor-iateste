import { useEffect, useRef } from "react";

const isMobile = () => window.innerWidth <= 768;

class Particle {
  x = 0; y = 0; baseX = 0; baseY = 0;
  size = 0; opacity = 0; speed = 0;
  angle = 0; angleSpeed = 0;
  currentOpacity = 0; currentSize = 0;
  cw = 0; ch = 0;

  constructor(cw: number, ch: number) {
    this.cw = cw; this.ch = ch;
    this.reset();
  }

  reset() {
    this.x = this.baseX = Math.random() * this.cw;
    this.y = this.baseY = Math.random() * this.ch;
    this.size = Math.random() * 1.2 + 0.3;
    this.opacity = Math.random() * 0.18 + 0.05;
    this.speed = Math.random() * 0.4 + 0.1;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = (Math.random() - 0.5) * 0.008;
    this.currentOpacity = this.opacity;
    this.currentSize = this.size;
  }

  update(mx: number, my: number) {
    this.angle += this.angleSpeed;
    this.baseX += Math.cos(this.angle) * this.speed * 0.3;
    this.baseY += Math.sin(this.angle) * this.speed * 0.3;
    if (this.baseX < 0) this.baseX = this.cw;
    if (this.baseX > this.cw) this.baseX = 0;
    if (this.baseY < 0) this.baseY = this.ch;
    if (this.baseY > this.ch) this.baseY = 0;

    const dx = this.baseX - mx;
    const dy = this.baseY - my;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = 180;

    if (dist < maxDist) {
      const force = (maxDist - dist) / maxDist;
      const wave = Math.sin(dist * 0.05 - Date.now() * 0.004) * 25 * force;
      const a = Math.atan2(dy, dx);
      this.x = this.baseX + Math.cos(a) * wave * 2;
      this.y = this.baseY + Math.sin(a) * wave * 2;
      this.currentOpacity = Math.min(this.opacity + force * 0.3, 0.6);
      this.currentSize = this.size + force * 1.5;
    } else {
      this.x += (this.baseX - this.x) * 0.05;
      this.y += (this.baseY - this.y) * 0.05;
      this.currentOpacity = this.opacity;
      this.currentSize = this.size;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.currentOpacity;
    ctx.fillStyle = "#FFD700";
    ctx.shadowBlur = 4;
    ctx.shadowColor = "rgba(255,215,0,0.4)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export function WaveCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isMobile()) return;

    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const count = 45;
    const particles = Array.from({ length: count }, () => new Particle(w, h));
    const mouse = { x: w / 2, y: h / 2 };
    let waveRadius = 0;

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("mousemove", onMove);

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.save();
            ctx.globalAlpha = (1 - dist / 100) * 0.05;
            ctx.strokeStyle = "#FFD700";
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      waveRadius += 1.5;
      const op = Math.max(0, 0.12 - waveRadius / 200);
      ctx.save();
      ctx.globalAlpha = op;
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, waveRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      if (waveRadius > 200) waveRadius = 0;

      particles.forEach((p) => {
        p.update(mouse.x, mouse.y);
        p.draw(ctx);
      });

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="hidden md:block"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
        opacity: 0.18,
      }}
    />
  );
}
