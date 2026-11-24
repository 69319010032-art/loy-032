import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const StarrySky: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null!);

  const { geometry, colors } = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Hemisphere celestial dome
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0) * 0.5; // Upper half dome
      const radius = 120 + Math.random() * 40;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = Math.max(12, radius * Math.cos(phi)); // Keep above horizon
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // Star color variation: white, golden, soft cyan
      const r = Math.random();
      if (r < 0.4) {
        cols[i * 3] = 1.0;
        cols[i * 3 + 1] = 0.95;
        cols[i * 3 + 2] = 0.7; // Golden star
      } else if (r < 0.7) {
        cols[i * 3] = 0.85;
        cols[i * 3 + 1] = 0.92;
        cols[i * 3 + 2] = 1.0; // Silvery blue star
      } else {
        cols[i * 3] = 1.0;
        cols[i * 3 + 1] = 1.0;
        cols[i * 3 + 2] = 1.0; // Crisp white
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geom.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    return { geometry: geom, colors: cols };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      const t = state.clock.getElapsedTime();
      // Slow majestic celestial rotation
      pointsRef.current.rotation.y = t * 0.005;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={1.1}
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        fog={false}
      />
    </points>
  );
};
