import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface KrathongStreamItem {
  id: number;
  initX: number;
  initZ: number;
  speed: number;
  swaySpeed: number;
  swayDist: number;
  scale: number;
  flameColor: string;
}

export const DistantKrathongs: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null!);

  // Generate 60 realistic floating krathongs spread out across the river
  const items = useMemo<KrathongStreamItem[]>(() => {
    const list: KrathongStreamItem[] = [];
    const colors = ['#f59e0b', '#fbbf24', '#f97316', '#ea580c', '#facc15'];

    for (let i = 0; i < 60; i++) {
      list.push({
        id: i,
        // Distribute across river width (X from -25 to +25)
        initX: (Math.random() - 0.5) * 50,
        // Distribute from near pier (Z = -3) to deep distance (Z = -75)
        initZ: -3 - Math.random() * 72,
        speed: 0.35 + Math.random() * 0.45,
        swaySpeed: 1.0 + Math.random() * 1.8,
        swayDist: 0.3 + Math.random() * 0.7,
        scale: 0.32 + Math.random() * 0.35,
        flameColor: colors[i % colors.length],
      });
    }
    return list;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, index) => {
      const item = items[index];
      if (!item) return;

      // Continuously drift downstream along -Z, wrapping from -3 to -75
      const totalDist = 72;
      const progress = ((item.initZ - t * item.speed) % totalDist);
      const currentZ = -3 + (progress < 0 ? progress : progress - totalDist);
      const currentX = item.initX + Math.sin(t * item.swaySpeed + item.id) * item.swayDist;
      const currentY = -0.28 + Math.sin(t * 2.0 + item.id) * 0.03;

      child.position.set(currentX, currentY, currentZ);
      child.rotation.z = Math.sin(t * 1.5 + item.id) * 0.04;
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item) => (
        <group key={item.id} scale={[item.scale, item.scale, item.scale]}>
          {/* Banana leaf trunk base */}
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.55, 0.62, 0.14, 12]} />
            <meshStandardMaterial color="#2d521e" roughness={0.7} />
          </mesh>

          {/* Banana leaf outer petals */}
          {[...Array(6)].map((_, pi) => {
            const angle = (pi / 6) * Math.PI * 2;
            return (
              <mesh
                key={`petal-${pi}`}
                position={[Math.cos(angle) * 0.5, 0.1, Math.sin(angle) * 0.5]}
                rotation={[0, -angle, -0.4]}
              >
                <coneGeometry args={[0.12, 0.25, 4]} />
                <meshStandardMaterial color="#3b6e26" roughness={0.6} />
              </mesh>
            );
          })}

          {/* Marigold flowers ring */}
          {[...Array(4)].map((_, fi) => {
            const angle = (fi / 4) * Math.PI * 2;
            return (
              <mesh
                key={`fl-${fi}`}
                position={[Math.cos(angle) * 0.25, 0.14, Math.sin(angle) * 0.25]}
              >
                <dodecahedronGeometry args={[0.08, 0]} />
                <meshStandardMaterial color="#f59e0b" roughness={0.6} />
              </mesh>
            );
          })}

          {/* Candle */}
          <mesh position={[0, 0.22, 0]}>
            <cylinderGeometry args={[0.035, 0.04, 0.2, 8]} />
            <meshStandardMaterial color="#fef08a" roughness={0.5} />
          </mesh>

          {/* Bright Glowing Candle Flame */}
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color="#fffbeb" />
          </mesh>

          {/* Warm Candle Light Aura */}
          <mesh position={[0, 0.34, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial
              color={item.flameColor}
              transparent
              opacity={0.5}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>

          {/* Golden Water Surface Glow Disk */}
          <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.1, 0.9, 12]} />
            <meshBasicMaterial
              color={item.flameColor}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
};
