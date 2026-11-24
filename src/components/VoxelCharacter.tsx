import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Procedural Minecraft‑style voxel character ───
// Head, Torso, Arms, Legs — all <Box> geometry, no GLTF needed.

interface VoxelCharacterProps {
  isMoving?: boolean;
}

export interface VoxelCharacterHandle {
  group: THREE.Group | null;
}

export const VoxelCharacter = forwardRef<VoxelCharacterHandle, VoxelCharacterProps>(
  ({ isMoving = false }, ref) => {
    const groupRef = useRef<THREE.Group>(null!);
    const leftArmRef = useRef<THREE.Mesh>(null!);
    const rightArmRef = useRef<THREE.Mesh>(null!);
    const leftLegRef = useRef<THREE.Mesh>(null!);
    const rightLegRef = useRef<THREE.Mesh>(null!);

    useImperativeHandle(ref, () => ({ group: groupRef.current }));

    // Swing animation for arms & legs while walking
    useFrame((state) => {
      const t = state.clock.getElapsedTime();
      const swing = isMoving ? Math.sin(t * 8) * 0.6 : 0;

      if (leftArmRef.current) leftArmRef.current.rotation.x = swing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = -swing;
      if (leftLegRef.current) leftLegRef.current.rotation.x = -swing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = swing;
    });

    // Skin & Clothing Palette (Clear, high-contrast, authentic Thai festival vibe)
    const skin = '#dfa57b';
    const shirt = '#2563eb';     // Vibrant royal blue shirt
    const pants = '#334155';     // Slate dark trousers
    const hair = '#1c130d';      // Dark hair
    const shoe = '#0f172a';      // Dark leather shoes
    const sash = '#f59e0b';      // Golden Thai sabai/sash

    return (
      <group ref={groupRef}>
        {/* ── Head ── */}
        <group position={[0, 1.65, 0]}>
          {/* Main head */}
          <mesh castShadow>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial color={skin} roughness={0.8} />
          </mesh>
          {/* Hair (top) */}
          <mesh position={[0, 0.26, 0]} castShadow>
            <boxGeometry args={[0.52, 0.06, 0.52]} />
            <meshStandardMaterial color={hair} roughness={0.9} />
          </mesh>
          {/* Eyes */}
          <mesh position={[-0.12, 0.04, 0.251]}>
            <boxGeometry args={[0.08, 0.06, 0.01]} />
            <meshBasicMaterial color="#1a1a2e" />
          </mesh>
          <mesh position={[0.12, 0.04, 0.251]}>
            <boxGeometry args={[0.08, 0.06, 0.01]} />
            <meshBasicMaterial color="#1a1a2e" />
          </mesh>
          {/* Mouth */}
          <mesh position={[0, -0.1, 0.251]}>
            <boxGeometry args={[0.14, 0.04, 0.01]} />
            <meshBasicMaterial color="#8b4513" />
          </mesh>
        </group>

        {/* ── Torso ── */}
        <group position={[0, 1.1, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.5, 0.65, 0.3]} />
            <meshStandardMaterial color={shirt} roughness={0.6} />
          </mesh>
          {/* Golden Thai Sash (พาดบ่าสไตล์ไทย) */}
          <mesh position={[0, 0.05, 0.02]} rotation={[0, 0, -0.45]}>
            <boxGeometry args={[0.16, 0.72, 0.31]} />
            <meshStandardMaterial color={sash} roughness={0.4} metalness={0.2} />
          </mesh>
        </group>

        {/* ── Left Arm (pivot at shoulder) ── */}
        <group position={[-0.38, 1.35, 0]}>
          <mesh ref={leftArmRef} position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.2, 0.6, 0.25]} />
            <meshStandardMaterial color={skin} roughness={0.8} />
          </mesh>
        </group>

        {/* ── Right Arm (pivot at shoulder) ── */}
        <group position={[0.38, 1.35, 0]}>
          <mesh ref={rightArmRef} position={[0, -0.3, 0]} castShadow>
            <boxGeometry args={[0.2, 0.6, 0.25]} />
            <meshStandardMaterial color={skin} roughness={0.8} />
          </mesh>
        </group>

        {/* ── Left Leg (pivot at hip) ── */}
        <group position={[-0.13, 0.75, 0]}>
          <mesh ref={leftLegRef} position={[0, -0.35, 0]} castShadow>
            <boxGeometry args={[0.22, 0.6, 0.25]} />
            <meshStandardMaterial color={pants} roughness={0.8} />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.65, 0.04]}>
            <boxGeometry args={[0.24, 0.08, 0.32]} />
            <meshStandardMaterial color={shoe} roughness={0.7} />
          </mesh>
        </group>

        {/* ── Right Leg (pivot at hip) ── */}
        <group position={[0.13, 0.75, 0]}>
          <mesh ref={rightLegRef} position={[0, -0.35, 0]} castShadow>
            <boxGeometry args={[0.22, 0.6, 0.25]} />
            <meshStandardMaterial color={pants} roughness={0.8} />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.65, 0.04]}>
            <boxGeometry args={[0.24, 0.08, 0.32]} />
            <meshStandardMaterial color={shoe} roughness={0.7} />
          </mesh>
        </group>
      </group>
    );
  }
);

VoxelCharacter.displayName = 'VoxelCharacter';
