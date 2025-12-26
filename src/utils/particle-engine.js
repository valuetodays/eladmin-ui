let canvas, ctx;
let particles = [];
let inited = false;

const SHAPES = [
  "circle",
  "square",
  "triangle",
  "diamond",
  "line",
  "cross",
  "star",
  "hexagon",
  "ring",
  "spark",
];

function random(min, max) {
  return Math.random() * (max - min) + min;
}
function colorByType(type) {
  if (type === "success") return "#52c41a";
  if (type === "error") return "#ff4d4f";
  return `hsl(${Math.random() * 360},80%,60%)`;
}

class Particle {
  constructor(x, y, type) {
    const angle = Math.random() * Math.PI * 2;
    const speed = random(2.5, 6.5);
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.size = random(4, 9);
    this.life = 60;
    this.alpha = 1;
    this.rotation = random(0, Math.PI * 2);
    this.rotateSpeed = random(-0.15, 0.15);
    this.color = colorByType(type);
    this.shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  }
  update() {
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotateSpeed;
    this.life--;
    this.alpha = this.life / 60;
    this.size *= 0.985;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();

    switch (this.shape) {
      case "circle":
        ctx.fillStyle = this.color;
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "square":
        ctx.fillStyle = this.color;
        ctx.rect(-this.size, -this.size, this.size * 2, this.size * 2);
        ctx.fill();
        break;
      case "triangle":
        ctx.fillStyle = this.color;
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size, this.size);
        ctx.lineTo(-this.size, this.size);
        ctx.closePath();
        ctx.fill();
        break;
      case "diamond":
        ctx.fillStyle = this.color;
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size, 0);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.size, 0);
        ctx.closePath();
        ctx.fill();
        break;
      case "line":
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.moveTo(-this.size, 0);
        ctx.lineTo(this.size, 0);
        ctx.stroke();
        break;
      case "cross":
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.moveTo(-this.size, 0);
        ctx.lineTo(this.size, 0);
        ctx.moveTo(0, -this.size);
        ctx.lineTo(0, this.size);
        ctx.stroke();
        break;
      case "star":
        ctx.fillStyle = this.color;
        const spikes = 5;
        const outer = this.size;
        const inner = this.size / 2;
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / spikes;
        ctx.moveTo(0, -outer);
        for (let i = 0; i < spikes; i++) {
          ctx.lineTo(Math.cos(rot) * outer, Math.sin(rot) * outer);
          rot += step;
          ctx.lineTo(Math.cos(rot) * inner, Math.sin(rot) * inner);
          rot += step;
        }
        ctx.closePath();
        ctx.fill();
        break;
      case "hexagon":
        ctx.fillStyle = this.color;
        for (let i = 0; i < 6; i++) {
          const a = ((Math.PI * 2) / 6) * i;
          ctx.lineTo(Math.cos(a) * this.size, Math.sin(a) * this.size);
        }
        ctx.closePath();
        ctx.fill();
        break;
      case "ring":
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case "spark":
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        ctx.moveTo(-this.size, 0);
        ctx.lineTo(this.size, 0);
        ctx.moveTo(0, -this.size);
        ctx.lineTo(0, this.size);
        ctx.stroke();
        break;
    }

    ctx.restore();
  }
}

function init() {
  if (inited) return;
  inited = true;
  canvas = document.createElement("canvas");
  canvas.style.cssText = `position:fixed;inset:0;pointer-events:none;z-index:9999;`;
  document.body.appendChild(canvas);
  ctx = canvas.getContext("2d");
  resize();
  window.addEventListener("resize", resize);
  animate();
}
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter((p) => p.life > 0);
  particles.forEach((p) => {
    p.update();
    p.draw(ctx);
  });
  requestAnimationFrame(animate);
}
export function explode(x, y, options = {}) {
  init();
  const { count = 36, type } = options;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, type));
  }
}
