import React, { useRef, useState, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingKrathong {
  id: number;
  position: [number, number, number];
  speed: number;
  swayOffset: number;
  wishText?: string;
}

interface KrathongSystemProps {
  krathongs: FloatingKrathong[];
}

// ─── Floating Wish Text Billboard ───
const WishBillboard: React.FC<{ text: string; opacity: number }> = ({ text, opacity }) => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Translucent dark background pill
    ctx.fillStyle = 'rgba(10, 20, 36, 0.82)';
    ctx.beginPath();
    ctx.roundRect(10, 16, 492, 96, 28);
    ctx.fill();

    // Golden border
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(10, 16, 492, 96, 28);
    ctx.stroke();

    // Golden wish text
    ctx.font = 'bold 32px "Sarabun", "Noto Sans Thai", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#fef08a';
    ctx.fillText(text, 256, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [text]);

  return (
    <group position={[0, 0.82, 0]}>
      <mesh>
        <planeGeometry args={[1.8, 0.45]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={Math.min(1, opacity * 1.15)}
          side={THREE.DoubleSide}
          depthWrite={false}
          fog={false}
        />
      </mesh>
    </group>
  );
};

// ─── Single floating krathong with candle glow & wish text ───
const FloatingKrathongMesh: React.FC<{ krathong: FloatingKrathong; hasPointLight: boolean }> = ({
  krathong,
  hasPointLight,
}) => {
  const ref = useRef<THREE.Group>(null!);
  const [opacity, setOpacity] = useState(1);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();

    // Drift downstream along -Z
    ref.current.position.z -= krathong.speed * 0.018;

    // Gentle bob and sway
    ref.current.position.y =
      krathong.position[1] + Math.sin(t * 1.8 + krathong.swayOffset) * 0.03;
    ref.current.position.x =
      krathong.position[0] + Math.sin(t * 0.7 + krathong.swayOffset) * 0.2;
    ref.current.rotation.z = Math.sin(t * 1.3 + krathong.swayOffset) * 0.04;

    // Fade out as it drifts far away
    const dist = Math.abs(ref.current.position.z - krathong.position[2]);
    if (dist > 22) {
      setOpacity(Math.max(0, 1 - (dist - 22) / 8));
    }
  });

  return (
    <group ref={ref} position={krathong.position}>
      {/* 3D Floating Wish Text above Krathong */}
      {krathong.wishText && <WishBillboard text={krathong.wishText} opacity={opacity} />}

      {/* Banana leaf base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.38, 0.1, 14]} />
        <meshStandardMaterial color="#2d5a1e" roughness={0.7} transparent opacity={opacity} />
      </mesh>

      {/* Folded leaf petals (outer ring) */}
      {[...Array(10)].map((_, i) => {
        const angle = (i / 10) * Math.PI * 2;
        return (
          <mesh
            key={`petal-${i}`}
            position={[Math.cos(angle) * 0.27, 0.08, Math.sin(angle) * 0.27]}
            rotation={[0, -angle, -0.45]}
            castShadow
            receiveShadow
          >
            <coneGeometry args={[0.075, 0.19, 4]} />
            <meshStandardMaterial color="#3a7a2e" roughness={0.6} transparent opacity={opacity} />
          </mesh>
        );
      })}

      {/* Marigold flowers ring */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh
            key={`flower-${i}`}
            position={[Math.cos(angle) * 0.15, 0.1, Math.sin(angle) * 0.15]}
            castShadow
          >
            <dodecahedronGeometry args={[0.055, 0]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.6} transparent opacity={opacity} />
          </mesh>
        );
      })}

      {/* Candle */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.16, 8]} />
        <meshStandardMaterial color="#f5d061" roughness={0.5} transparent opacity={opacity} />
      </mesh>

      {/* Water surface golden glow reflection disk */}
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.8, 16]} />
        <meshBasicMaterial color="#ff9e2b" transparent opacity={opacity * 0.55} side={THREE.DoubleSide} />
      </mesh>

      {/* Bright glowing flame with outer halo */}
      <mesh position={[0, 0.29, 0]}>
        <coneGeometry args={[0.035, 0.09, 8]} />
        <meshBasicMaterial color="#fffbeb" transparent opacity={opacity} />
      </mesh>
      {/* Flame warm core glow */}
      <mesh position={[0, 0.28, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color="#ff9800" transparent opacity={opacity * 0.85} />
      </mesh>
      {/* Flame soft aura */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshBasicMaterial color="#ffaa33" transparent opacity={opacity * 0.35} />
      </mesh>

      {/* Warm candle point light */}
      {hasPointLight && (
        <pointLight
          position={[0, 0.4, 0]}
          color="#ffaa33"
          intensity={3.8 * opacity}
          distance={6}
          decay={2}
        />
      )}
    </group>
  );
};

export const KrathongSystem: React.FC<KrathongSystemProps> = ({ krathongs }) => {
  return (
    <group>
      {krathongs.map((k, index) => {
        const hasPointLight = index >= krathongs.length - 2;
        return (
          <FloatingKrathongMesh
            key={k.id}
            krathong={k}
            hasPointLight={hasPointLight}
          />
        );
      })}
    </group>
  );
};

// Hook to manage krathong spawning with wishText
export const useKrathongSpawner = () => {
  const [krathongs, setKrathongs] = useState<FloatingKrathong[]>([]);
  const idCounter = useRef(0);

  const spawnKrathong = useCallback((x: number, z: number, wishText?: string) => {
    const newKrathong: FloatingKrathong = {
      id: idCounter.current++,
      position: [x, -0.25, z],
      speed: 0.35 + Math.random() * 0.25,
      swayOffset: Math.random() * Math.PI * 2,
      wishText: wishText || 'ขอขมาพระแม่คงคา',
    };
    setKrathongs((prev) => [...prev.slice(-14), newKrathong]);
  }, []);

  return { krathongs, spawnKrathong };
};
