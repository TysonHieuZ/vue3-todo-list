<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  shape: 'circle' | 'heart' | 'star';
  wobble: number;
  wobbleSpeed: number;
}

const COLORS = [
  '#ffb3c6', '#ff85a1', '#ffc8d5', '#ffadc0',
  '#f9c784', '#ffd6a5', '#ffe5b4', '#ffd1dc',
  '#c9b8ff', '#e0b4ff', '#ffb3e6', '#ff99cc',
  '#ffffff',
];

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let petals: Petal[] = [];
let animId: number;
let width = 0;
let height = 0;

function createPetal(): Petal {
  const shapes: Petal['shape'][] = ['circle', 'heart', 'heart', 'star', 'circle'];
  return {
    x: Math.random() * width,
    y: -20,
    size: Math.random() * 14 + 6,
    speedY: Math.random() * 1.2 + 0.4,
    speedX: (Math.random() - 0.5) * 0.6,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.04,
    opacity: Math.random() * 0.5 + 0.3,
    color: COLORS[Math.floor(Math.random() * COLORS.length)] as string,
    shape: shapes[Math.floor(Math.random() * shapes.length)] as Petal['shape'],
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.03 + 0.01,
  };
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size * 0.5;
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.4);
  ctx.bezierCurveTo(x, y, x - s, y, x - s, y + s * 0.4);
  ctx.bezierCurveTo(x - s, y + s * 0.8, x, y + s * 1.2, x, y + s * 1.4);
  ctx.bezierCurveTo(x, y + s * 1.2, x + s, y + s * 0.8, x + s, y + s * 0.4);
  ctx.bezierCurveTo(x + s, y, x, y, x, y + s * 0.4);
  ctx.closePath();
}

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const spikes = 5;
  const outer = size * 0.6;
  const inner = size * 0.25;
  let rot = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;
  ctx.beginPath();
  ctx.moveTo(x, y - outer);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(x + Math.cos(rot) * outer, y + Math.sin(rot) * outer);
    rot += step;
    ctx.lineTo(x + Math.cos(rot) * inner, y + Math.sin(rot) * inner);
    rot += step;
  }
  ctx.lineTo(x, y - outer);
  ctx.closePath();
}

function drawPetal(p: Petal) {
  if (!ctx) return;
  ctx.save();
  ctx.globalAlpha = p.opacity;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  ctx.fillStyle = p.color;
  ctx.shadowColor = p.color;
  ctx.shadowBlur = 6;

  if (p.shape === 'heart') {
    drawHeart(ctx, 0, -p.size * 0.5, p.size);
    ctx.fill();
  } else if (p.shape === 'star') {
    drawStar(ctx, 0, 0, p.size);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size * 0.5, p.size * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function animate() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, width, height);

  // Add new petals
  if (petals.length < 80 && Math.random() < 0.25) {
    petals.push(createPetal());
  }

  petals = petals.filter(p => p.y < height + 30);

  for (const p of petals) {
    p.wobble += p.wobbleSpeed;
    p.x += p.speedX + Math.sin(p.wobble) * 0.5;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;
    drawPetal(p);
  }

  animId = requestAnimationFrame(animate);
}

function resize() {
  if (!canvas) return;
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

onMounted(() => {
  canvas = document.getElementById('petals-canvas') as HTMLCanvasElement;
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
  animate();
});

onUnmounted(() => {
  cancelAnimationFrame(animId);
  window.removeEventListener('resize', resize);
});
</script>

<template>
  <canvas id="petals-canvas" aria-hidden="true"></canvas>
</template>
