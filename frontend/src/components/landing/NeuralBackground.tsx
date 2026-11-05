
"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: "violet" | "cyan";
};

type Particle = {
  from: number;
  to: number;
  progress: number;
  speed: number;
};

export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let particles: Particle[] = [];

    const connectionDistance = 150;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = canvas.clientWidth;
      height = canvas.clientHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(
        180,
        Math.max(65, Math.floor((width * height) / 9500)),
      );

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.8 + 1,
        color: Math.random() > 0.5 ? "violet" : "cyan",
      }));

      particles = [];

      for (let i = 0; i < count * 0.7; i++) {
        const from = Math.floor(Math.random() * count);
        let to = Math.floor(Math.random() * count);

        while (to === from) {
          to = Math.floor(Math.random() * count);
        }

        particles.push({
          from,
          to,
          progress: Math.random(),
          speed: Math.random() * 0.0015 + 0.0005,
        });
      }
    };

    const draw = () => {
      ctx!.clearRect(0, 0, width, height);

      // Slowly move every neural node
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      // Neural connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.22;

            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);

            ctx!.strokeStyle =
              a.color === "cyan"
                ? `rgba(34, 211, 238, ${opacity})`
                : `rgba(139, 92, 246, ${opacity})`;

            ctx!.lineWidth = 0.7;
            ctx!.stroke();
          }
        }
      }

      // Glowing neural nodes
      nodes.forEach((node) => {
        const color =
          node.color === "cyan"
            ? "rgba(34,211,238,"
            : "rgba(139,92,246,";

        ctx!.beginPath();
        ctx!.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx!.fillStyle = color + "0.8)";
        ctx!.shadowBlur = 12;
        ctx!.shadowColor =
          node.color === "cyan" ? "#22D3EE" : "#8B5CF6";
        ctx!.fill();
        ctx!.shadowBlur = 0;
      });

      // Traveling particles
      particles.forEach((particle) => {
        particle.progress += particle.speed;

        if (particle.progress >= 1) {
          particle.progress = 0;
          particle.from = particle.to;

          particle.to = Math.floor(Math.random() * nodes.length);
        }

        const a = nodes[particle.from];
        const b = nodes[particle.to];

        const x = a.x + (b.x - a.x) * particle.progress;
        const y = a.y + (b.y - a.y) * particle.progress;

        ctx!.beginPath();
        ctx!.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx!.fillStyle = "#67E8F9";
        ctx!.shadowBlur = 10;
        ctx!.shadowColor = "#22D3EE";
        ctx!.fill();
        ctx!.shadowBlur = 0;
      });

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  )
}
