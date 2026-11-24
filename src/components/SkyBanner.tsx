import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const SkyBanner: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const particlesRef = useRef<THREE.Points>(null!);

  // Ultra-crisp High-Res Canvas Texture for massive radiant golden Thai calligraphy
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    ctx.clearRect(0, 0, 2048, 512);

    const centerX = 1024;
    const centerY = 240;
    const mainText = 'ที่ชวนลอยหวังซอยอย่างเดียว';

    // 1. Broad outer atmospheric amber aura
    ctx.font = 'bold 102px "Charm", "Sarabun", "Prompt", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'rgba(245, 158, 11, 1.0)';
    ctx.shadowBlur = 60;
    ctx.fillStyle = 'rgba(245, 158, 11, 0.9)';
    ctx.fillText(mainText, centerX, centerY);
    ctx.fillText(mainText, centerX, centerY);

    // 2. Focused vibrant gold inner glow
    ctx.shadowColor = 'rgba(254, 240, 138, 1.0)';
    ctx.shadowBlur = 28;

    // 3. Rich Royal Gold Gradient
    const goldGrad = ctx.createLinearGradient(0, centerY - 60, 0, centerY + 60);
    goldGrad.addColorStop(0, '#ffffff');
    goldGrad.addColorStop(0.25, '#fef08a');
    goldGrad.addColorStop(0.55, '#facc15');
    goldGrad.addColorStop(0.85, '#eab308');
    goldGrad.addColorStop(1, '#ca8a04');

    ctx.fillStyle = goldGrad;
    ctx.fillText(mainText, centerX, centerY);

    // 4. Elegant Thai floral ornaments & underline
    ctx.shadowBlur = 20;
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(centerX - 540, centerY + 90);
    ctx.lineTo(centerX - 90, centerY + 90);
    ctx.moveTo(centerX + 90, centerY + 90);
    ctx.lineTo(centerX + 540, centerY + 90);
    ctx.stroke();

    // Center floral dok phikul rosette
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 90, 14, 0, Math.PI * 2);
    ctx.fill();

    const r = 24;
    [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((ang) => {
      ctx.beginPath();
      ctx.arc(centerX + Math.cos(ang) * r, centerY + 90 + Math.sin(ang) * r, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Golden celestial stardust
  const stardust = useMemo(() => {
    const count = 120;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = 18 + (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = -42 + (Math.random() - 0.5) * 10;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.position.y = 19 + Math.sin(t * 0.7) * 0.4;
      meshRef.current.position.x = Math.sin(t * 0.45) * 0.3;
    }

    if (haloRef.current && meshRef.current) {
      const pulse = 1 + Math.sin(t * 1.4) * 0.08;
      haloRef.current.scale.set(pulse, pulse, 1);
      (haloRef.current.material as THREE.MeshBasicMaterial).opacity = 0.45 + Math.sin(t * 1.4) * 0.15;
      haloRef.current.position.copy(meshRef.current.position);
      haloRef.current.position.z -= 0.5;
    }

    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 120; i++) {
        positions[i * 3 + 1] += Math.sin(t * 1.5 + i) * 0.006;
        positions[i * 3] += Math.cos(t * 1.2 + i) * 0.005;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* 1. Luminous Golden Halo Backdrop */}
      <mesh ref={haloRef} position={[0, 19, -42.5]}>
        <planeGeometry args={[44, 11]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </mesh>

      {/* 2. Main High-Res Radiant Calligraphy Mesh */}
      <mesh ref={meshRef} position={[0, 19, -42]}>
        <planeGeometry args={[40, 10]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={1.0}
          depthWrite={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </mesh>

      {/* 3. Golden Stardust */}
      <points ref={particlesRef} geometry={stardust}>
        <pointsMaterial
          size={0.4}
          color="#fef08a"
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </points>
    </group>
  );
};
