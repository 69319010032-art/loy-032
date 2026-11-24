import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural 3D Thai Festivalgoer
interface PersonData {
  id: number;
  startX: number;
  endX: number;
  z: number;
  speed: number;
  colorOutfit: string;
  colorSabai: string;
  isKneeling?: boolean;
  holdsKrathong: boolean;
  facing: number; // 1 = right, -1 = left
}

export const FestivalCrowd: React.FC = () => {
  const walkersGroupRef = useRef<THREE.Group>(null!);

  // Crowd configuration along the temple pier
  const people = useMemo<PersonData[]>(() => {
    return [
      // Walkers carrying glowing krathongs along the upper pier
      { id: 1, startX: -14, endX: 14, z: 2.2, speed: 1.1, colorOutfit: '#b91c1c', colorSabai: '#fbbf24', holdsKrathong: true, facing: 1 },
      { id: 2, startX: 12, endX: -12, z: 3.0, speed: 0.9, colorOutfit: '#0284c7', colorSabai: '#fef08a', holdsKrathong: true, facing: -1 },
      { id: 3, startX: -16, endX: 10, z: 1.8, speed: 1.2, colorOutfit: '#7c3aed', colorSabai: '#f472b6', holdsKrathong: false, facing: 1 },
      { id: 4, startX: 15, endX: -15, z: 3.8, speed: 0.85, colorOutfit: '#059669', colorSabai: '#fde047', holdsKrathong: true, facing: -1 },
      { id: 5, startX: -10, endX: 12, z: 4.2, speed: 1.0, colorOutfit: '#ea580c', colorSabai: '#fed7aa', holdsKrathong: true, facing: 1 },

      // People kneeling/crouching at the left steps to float krathongs
      { id: 6, startX: -5.5, endX: -5.5, z: 0.1, speed: 0, colorOutfit: '#db2777', colorSabai: '#fef08a', isKneeling: true, holdsKrathong: true, facing: 1 },
      { id: 7, startX: -3.5, endX: -3.5, z: -0.2, speed: 0, colorOutfit: '#0d9488', colorSabai: '#fed7aa', isKneeling: true, holdsKrathong: true, facing: 1 },

      // People kneeling/crouching at the right steps
      { id: 8, startX: 3.5, endX: 3.5, z: -0.2, speed: 0, colorOutfit: '#e11d48', colorSabai: '#fef08a', isKneeling: true, holdsKrathong: true, facing: -1 },
      { id: 9, startX: 5.5, endX: 5.5, z: 0.1, speed: 0, colorOutfit: '#4f46e5', colorSabai: '#fde047', isKneeling: true, holdsKrathong: true, facing: -1 },

      // Bystanders standing and watching at the balustrade
      { id: 10, startX: -8.0, endX: -8.0, z: 1.2, speed: 0, colorOutfit: '#ca8a04', colorSabai: '#fef9c3', holdsKrathong: false, facing: 1 },
      { id: 11, startX: 8.0, endX: 8.0, z: 1.2, speed: 0, colorOutfit: '#0891b2', colorSabai: '#fed7aa', holdsKrathong: false, facing: -1 }
    ];
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!walkersGroupRef.current) return;

    walkersGroupRef.current.children.forEach((child, idx) => {
      const p = people[idx];
      if (!p) return;

      if (p.speed > 0) {
        // Walking movement back and forth
        const dist = Math.abs(p.endX - p.startX);
        const cycle = ((t * p.speed) % (dist * 2));
        let curX = cycle < dist ? p.startX + cycle : p.endX - (cycle - dist);
        const dir = cycle < dist ? 1 : -1;

        child.position.x = curX;
        child.rotation.y = dir === 1 ? Math.PI / 2 : -Math.PI / 2;

        // Walking gait bobbing
        child.position.y = (p.isKneeling ? 0.35 : 0.75) + Math.abs(Math.sin(t * 7 * p.speed)) * 0.05;

        // Arm/leg swing
        const leftArm = child.getObjectByName('leftArm');
        const rightArm = child.getObjectByName('rightArm');
        if (leftArm && rightArm) {
          const swing = Math.sin(t * 7 * p.speed) * 0.25;
          leftArm.rotation.x = swing;
          rightArm.rotation.x = -swing;
        }
      } else if (p.isKneeling) {
        // Gentle breathing motion while crouching to release krathong
        child.position.y = 0.35 + Math.sin(t * 1.5 + p.id) * 0.015;
      }
    });
  });

  return (
    <group ref={walkersGroupRef}>
      {people.map((p) => (
        <group
          key={p.id}
          position={[p.startX, p.isKneeling ? 0.35 : 0.75, p.z]}
          rotation={[0, p.facing === 1 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          {/* Head & Traditional Hair Chignon (ศีรษะและมวยผมไทย) */}
          <group position={[0, p.isKneeling ? 0.65 : 1.15, 0]}>
            {/* Face */}
            <mesh castShadow>
              <sphereGeometry args={[0.13, 12, 12]} />
              <meshStandardMaterial color="#fcd34d" roughness={0.7} />
            </mesh>
            {/* Black hair chignon with golden hairpin */}
            <mesh position={[0, 0.08, -0.05]}>
              <sphereGeometry args={[0.11, 8, 8]} />
              <meshStandardMaterial color="#171717" roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.12, -0.05]}>
              <cylinderGeometry args={[0.01, 0.01, 0.15, 6]} />
              <meshStandardMaterial color="#f59e0b" metalness={0.8} />
            </mesh>
          </group>

          {/* Torso & Traditional Sabai Scarf (เสื้อราชปะแตน / สไบเฉียง) */}
          <group position={[0, p.isKneeling ? 0.38 : 0.75, 0]}>
            {/* Torso */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.14, 0.16, 0.45, 12]} />
              <meshStandardMaterial color={p.colorOutfit} roughness={0.6} />
            </mesh>
            {/* Diagonal Sabai Scarf */}
            <mesh position={[0.02, 0.02, 0.02]} rotation={[0, 0, 0.35]}>
              <cylinderGeometry args={[0.15, 0.17, 0.44, 12]} />
              <meshStandardMaterial color={p.colorSabai} roughness={0.5} />
            </mesh>
          </group>

          {/* Arms */}
          <group position={[-0.18, p.isKneeling ? 0.45 : 0.85, 0]} name="leftArm">
            <mesh position={[0, -0.15, 0.05]}>
              <cylinderGeometry args={[0.04, 0.04, 0.32, 8]} />
              <meshStandardMaterial color="#fcd34d" roughness={0.7} />
            </mesh>
          </group>
          <group position={[0.18, p.isKneeling ? 0.45 : 0.85, 0]} name="rightArm">
            <mesh position={[0, -0.15, 0.05]}>
              <cylinderGeometry args={[0.04, 0.04, 0.32, 8]} />
              <meshStandardMaterial color="#fcd34d" roughness={0.7} />
            </mesh>
          </group>

          {/* Lower Garment (ผ้าถุง / โจงกระเบนทรงพอง) */}
          <group position={[0, p.isKneeling ? 0.15 : 0.35, 0]}>
            <mesh castShadow receiveShadow>
              {p.isKneeling ? (
                // Kneeling shape
                <boxGeometry args={[0.38, 0.3, 0.45]} />
              ) : (
                // Standing pleated sarong
                <cylinderGeometry args={[0.16, 0.22, 0.65, 12]} />
              )}
              <meshStandardMaterial color={p.colorOutfit} roughness={0.7} />
            </mesh>
          </group>

          {/* Glowing Mini Krathong in Hands */}
          {p.holdsKrathong && (
            <group position={[0, p.isKneeling ? 0.25 : 0.65, 0.28]}>
              {/* Green banana base */}
              <mesh>
                <cylinderGeometry args={[0.14, 0.15, 0.06, 12]} />
                <meshStandardMaterial color="#2d5a27" roughness={0.6} />
              </mesh>
              {/* Glowing candle tip */}
              <mesh position={[0, 0.08, 0]}>
                <coneGeometry args={[0.025, 0.06, 8]} />
                <meshBasicMaterial color="#fffbeb" />
              </mesh>
              {/* Warm light casting on the person's clothes & face */}
              <pointLight color="#fbbf24" intensity={1.2} distance={2.5} decay={2} />
            </group>
          )}
        </group>
      ))}
    </group>
  );
};
