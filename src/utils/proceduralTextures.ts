import * as THREE from 'three';

/**
 * Procedurally generates authentic organic & architectural textures
 * Avoids any external image assets or plastic AI-look.
 */

// 1. Organic Banana Leaf Texture with fibrous veins & natural imperfections
export function createBananaLeafTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, '#264218');
  grad.addColorStop(0.2, '#2f571e');
  grad.addColorStop(0.5, '#3e6f28');
  grad.addColorStop(0.8, '#325b1f');
  grad.addColorStop(1, '#233d15');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  for (let x = 0; x < 512; x += 3) {
    const alpha = 0.04 + Math.random() * 0.08;
    ctx.strokeStyle = Math.random() > 0.5 ? `rgba(20, 40, 10, ${alpha})` : `rgba(130, 180, 70, ${alpha})`;
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 8, 512);
    ctx.stroke();
  }

  for (let y = 0; y < 512; y += 8) {
    const angle = ((y / 512) - 0.5) * 10;
    ctx.strokeStyle = `rgba(15, 30, 8, ${0.03 + Math.random() * 0.04})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y + angle + (Math.random() - 0.5) * 4);
    ctx.stroke();
  }

  for (let i = 0; i < 40; i++) {
    const px = Math.random() * 512;
    const py = Math.random() * 512;
    const radius = 1 + Math.random() * 4;
    ctx.fillStyle = `rgba(70, 60, 20, ${0.1 + Math.random() * 0.15})`;
    ctx.beginPath();
    ctx.arc(px, py, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Cross-cut Banana Trunk Texture
export function createBananaTrunkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#c7be9b';
  ctx.fillRect(0, 0, 512, 512);

  const cx = 256;
  const cy = 256;
  for (let r = 10; r < 250; r += 5) {
    ctx.strokeStyle = `rgba(140, 130, 95, ${0.08 + Math.random() * 0.1})`;
    ctx.lineWidth = 2 + Math.random() * 2;
    ctx.beginPath();
    ctx.arc(cx + (Math.random() - 0.5) * 4, cy + (Math.random() - 0.5) * 4, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  for (let i = 0; i < 2000; i++) {
    const dist = Math.random() * 240;
    const angle = Math.random() * Math.PI * 2;
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist;
    ctx.fillStyle = `rgba(110, 100, 70, ${0.15 + Math.random() * 0.25})`;
    ctx.fillRect(px, py, 1.5, 1.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 3. Lotus Petal Texture
export function createLotusPetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createLinearGradient(0, 512, 0, 0);
  grad.addColorStop(0, '#fef9ea');
  grad.addColorStop(0.3, '#fbeaf0');
  grad.addColorStop(0.7, '#f48fb1');
  grad.addColorStop(1, '#c2185b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 512);

  for (let x = 0; x < 256; x += 4) {
    const alpha = 0.05 + Math.random() * 0.08;
    ctx.strokeStyle = `rgba(170, 30, 90, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 512);
    ctx.quadraticCurveTo(128, 256, x, 0);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 4. Water Ripple Texture
export function createWaterRippleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 300; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const rx = 20 + Math.random() * 60;
    const ry = 4 + Math.random() * 10;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, rx);
    grad.addColorStop(0, 'rgba(170, 170, 255, 0.4)');
    grad.addColorStop(0.7, 'rgba(128, 128, 255, 0.15)');
    grad.addColorStop(1, 'rgba(128, 128, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

// 5. Wat Arun Benjarong Porcelain Mosaic Texture (กระเบื้องเคลือบลายครามเบญจรงค์ประดับวัดอรุณ)
export function createBenjarongTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Smooth glazed white porcelain base
  ctx.fillStyle = '#fbfcf8';
  ctx.fillRect(0, 0, 512, 512);

  // Ceramic tile grid
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.2;
  const tileSize = 64;
  for (let x = 0; x <= 512; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Intricate Cobalt Blue & Gold Benjarong Rosettes (ดอกพิกุลเคลือบกระเบื้อง)
  for (let x = tileSize / 2; x < 512; x += tileSize) {
    for (let y = tileSize / 2; y < 512; y += tileSize) {
      // Cobalt blue floral petals
      ctx.fillStyle = '#1e3a8a';
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * 11, y + Math.sin(a) * 11, 7, 3.5, a, 0, Math.PI * 2);
        ctx.fill();
      }

      // Golden center jewel dot
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Emerald green accent dot
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

// 6. Royal Polished Granite Texture
export function createRoyalGraniteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#eae6df';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = 1 + Math.random() * 2;
    const roll = Math.random();
    if (roll > 0.6) {
      ctx.fillStyle = 'rgba(70, 75, 85, 0.25)';
    } else if (roll > 0.3) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    } else {
      ctx.fillStyle = 'rgba(180, 160, 130, 0.2)';
    }
    ctx.fillRect(x, y, size, size);
  }

  ctx.strokeStyle = 'rgba(120, 110, 100, 0.35)';
  ctx.lineWidth = 2;
  for (let x = 0; x <= 512; x += 128) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += 128) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// 7. NEW: Authentic Siamese Glazed Roof Tiles (กระเบื้องกาบกล้วยเคลือบสีส้มอิฐตัดเขียวมรกต)
export function createThaiRoofTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep rich terracotta crimson background
  ctx.fillStyle = '#991b1b';
  ctx.fillRect(0, 0, 512, 512);

  // Overlapping curved roof tile courses
  const rowHeight = 32;
  const colWidth = 48;
  for (let y = 0; y <= 512; y += rowHeight) {
    const offset = (y / rowHeight) % 2 === 0 ? 0 : colWidth / 2;
    for (let x = -colWidth; x <= 512 + colWidth; x += colWidth) {
      const curX = x + offset;

      // Glazed tile gradient
      const grad = ctx.createLinearGradient(curX, y, curX, y + rowHeight);
      grad.addColorStop(0, '#dc2626');
      grad.addColorStop(0.6, '#b91c1c');
      grad.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = grad;

      ctx.beginPath();
      ctx.roundRect(curX + 2, y + 2, colWidth - 4, rowHeight - 2, [0, 0, 8, 8]);
      ctx.fill();

      // Tile specular highlight
      ctx.strokeStyle = 'rgba(254, 202, 202, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 6);
  return texture;
}

// 8. NEW: Gilded Thai Lacquer & Pediment Pattern (ลายรดน้ำทองคำเปลวบนชาดสีแดง)
export function createGildedLacquerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep vermilion lacquer
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(0, 0, 512, 512);

  // Intricate Gilded Kanok Flame Curves (ลายกนกเปลวเพลิงปิดทอง)
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
  ctx.shadowBlur = 8;

  for (let y = 32; y < 512; y += 64) {
    for (let x = 32; x < 512; x += 64) {
      // Swirling golden flame motif
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 1.5);
      ctx.quadraticCurveTo(x + 20, y - 20, x + 24, y);
      ctx.stroke();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}
