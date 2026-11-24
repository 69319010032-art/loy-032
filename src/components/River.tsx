import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createWaterRippleTexture } from '../utils/proceduralTextures';

interface RiverProps {
  krathongPosition?: THREE.Vector3;
  isFloating?: boolean;
}

export const River: React.FC<RiverProps> = ({ krathongPosition, isFloating = false }) => {
  const waterMeshRef = useRef<THREE.Mesh>(null!);
  const rippleRingsRef = useRef<THREE.Group>(null!);

  const rippleTexture = useMemo(() => createWaterRippleTexture(), []);

  // Realistic Chao Phraya River Water Material (High specular, mirror reflections)
  const waterMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x050c18,
        roughness: 0.12,
        metalness: 0.88,
        bumpMap: rippleTexture,
        bumpScale: 0.04,
        transparent: true,
        opacity: 0.96
      }),
    [rippleTexture]
  );

  const ripples = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      scale: 0.3 + i * 0.4,
      opacity: 0.65 - i * 0.09
    }));
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (rippleTexture) {
      rippleTexture.offset.y = -t * 0.025;
      rippleTexture.offset.x = Math.sin(t * 0.12) * 0.005;
    }

    if (rippleRingsRef.current && krathongPosition) {
      rippleRingsRef.current.position.set(
        krathongPosition.x,
        0.02,
        krathongPosition.z
      );

      rippleRingsRef.current.children.forEach((child, idx) => {
        const ring = child as THREE.Mesh;
        const speed = 0.75;
        const progress = ((t * speed + idx * 0.35) % 2) / 2;
        const scale = 1.2 + progress * 4.5;
        ring.scale.set(scale, scale, 1);
        const mat = ring.material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - progress) * (isFloating ? 0.45 : 0.2);
      });
    }
  });

  return (
    <group>
      {/* 1. Vast Continuous Water Surface (No gaps, no void) */}
      <mesh
        ref={waterMeshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -20]}
        receiveShadow
      >
        <planeGeometry args={[600, 600, 64, 64]} />
        <primitive object={waterMaterial} attach="material" />
      </mesh>

      {/* 2. Expanding Concentric Ripples under Krathong */}
      <group ref={rippleRingsRef}>
        {ripples.map((r) => (
          <mesh key={r.id} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.9, 1.1, 36]} />
            <meshBasicMaterial
              color="#fef08a"
              transparent
              opacity={r.opacity}
              depthWrite={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
