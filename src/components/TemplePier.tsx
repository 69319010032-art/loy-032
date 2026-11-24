import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createRoyalGraniteTexture } from '../utils/proceduralTextures';

export const TemplePier: React.FC = () => {
  const graniteTexture = useMemo(() => createRoyalGraniteTexture(), []);

  const graniteMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: graniteTexture,
        roughness: 0.35,
        metalness: 0.12,
        bumpMap: graniteTexture,
        bumpScale: 0.02
      }),
    [graniteTexture]
  );

  const royalGoldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.14,
        emissive: 0x78350f,
        emissiveIntensity: 0.35
      }),
    []
  );

  const royalRoofMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        roughness: 0.35,
        metalness: 0.15
      }),
    []
  );

  const emeraldBorderMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x065f46,
        roughness: 0.25,
        metalness: 0.2
      }),
    []
  );

  const marbleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.35,
        metalness: 0.05
      }),
    []
  );

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Expansive Continuous Near-Riverbank Promenade */}
      <group position={[0, 0, 10]}>
        <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
          <boxGeometry args={[160, 0.8, 18]} />
          <primitive object={graniteMaterial} attach="material" />
        </mesh>
        {/* Retaining River Seawall */}
        <mesh position={[0, -0.2, -9.0]} receiveShadow>
          <boxGeometry args={[160, 1.2, 0.6]} />
          <primitive object={marbleMaterial} attach="material" />
        </mesh>
      </group>

      {/* 2. Symmetrical Granite Launching Steps (บันไดท่าน้ำหินศิลาทอดยาวลงสู่น้ำอย่างเรียบร้อย) */}
      <group position={[0, 0, 0]}>
        {[
          { z: 1.0, y: 0.30, h: 0.20, w: 14, d: 0.8 },
          { z: 0.3, y: 0.18, h: 0.20, w: 12, d: 0.7 },
          { z: -0.3, y: 0.06, h: 0.20, w: 10, d: 0.7 },
          { z: -0.85, y: -0.06, h: 0.18, w: 8.5, d: 0.6 } // Lowest step touching the water
        ].map((step, idx) => (
          <mesh key={`pier-step-${idx}`} position={[0, step.y, step.z]} receiveShadow castShadow>
            <boxGeometry args={[step.w, step.h, step.d]} />
            <primitive object={graniteMaterial} attach="material" />
          </mesh>
        ))}

        {/* Flanking Marble Balustrades with Golden Lotus Posts */}
        {[-4.8, 4.8].map((sideX, i) => (
          <group key={`pier-balustrade-${i}`} position={[sideX, 0, 0.4]}>
            {[
              { z: 1.2, y: 0.85 },
              { z: 0.5, y: 0.72 },
              { z: -0.2, y: 0.58 },
              { z: -0.7, y: 0.45 }
            ].map((post, pIdx) => (
              <group key={`post-${pIdx}`} position={[0, post.y, post.z]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[0.28, 0.75, 0.28]} />
                  <primitive object={marbleMaterial} attach="material" />
                </mesh>
                <mesh position={[0, 0.45, 0]} castShadow>
                  <sphereGeometry args={[0.15, 16, 16]} />
                  <primitive object={royalGoldMaterial} attach="material" />
                </mesh>
              </group>
            ))}
          </group>
        ))}
      </group>

      {/* 3. Promenade Railing across the Riverfront */}
      {[-30, -25, -20, -15, -10, -6, 6, 10, 15, 20, 25, 30].map((posX, idx) => (
        <group key={`prom-post-${idx}`} position={[posX, 1.1, 1.1]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.26, 0.9, 0.26]} />
            <primitive object={marbleMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 0.52, 0]} castShadow>
            <sphereGeometry args={[0.13, 12, 12]} />
            <primitive object={royalGoldMaterial} attach="material" />
          </mesh>
        </group>
      ))}

      {/* 4. Royal Thai Tri-Muk Pavilion on the Left Pier Terrace */}
      <group position={[-10, 0.8, 4.5]}>
        <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
          <boxGeometry args={[6.5, 0.4, 8.5]} />
          <primitive object={graniteMaterial} attach="material" />
        </mesh>

        {[
          [-2.4, -3.2],
          [-2.4, 3.2],
          [2.4, -3.2],
          [2.4, 3.2],
          [-2.4, 0],
          [2.4, 0]
        ].map(([cx, cz], idx) => (
          <group key={`col-${idx}`} position={[cx, 2.2, cz]}>
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.22, 3.8, 16]} />
              <primitive object={marbleMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 1.85, 0]} castShadow>
              <cylinderGeometry args={[0.32, 0.18, 0.32, 16]} />
              <primitive object={royalGoldMaterial} attach="material" />
            </mesh>
          </group>
        ))}

        <group position={[0, 4.4, 0]}>
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <coneGeometry args={[5.2, 1.8, 4]} />
            <primitive object={royalRoofMaterial} attach="material" />
          </mesh>
          <mesh position={[0, -0.25, 0]}>
            <boxGeometry args={[7.5, 0.16, 9.8]} />
            <primitive object={emeraldBorderMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 1.6, 0]} castShadow>
            <coneGeometry args={[3.8, 2.0, 4]} />
            <primitive object={royalRoofMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 3.0, 0]} castShadow>
            <coneGeometry args={[0.3, 2.4, 12]} />
            <primitive object={royalGoldMaterial} attach="material" />
          </mesh>
        </group>

        <pointLight position={[0, 3.2, 0]} color="#fbbf24" intensity={8.0} distance={25} decay={2} castShadow />
      </group>

      {/* 5. Traditional Royal Brass Lanterns along the Steps */}
      {[-3.5, 3.5].map((lx, idx) => (
        <group key={`lantern-pole-${idx}`} position={[lx, 1.1, 1.6]}>
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 1.4, 8]} />
            <primitive object={royalGoldMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <octahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial color="#fef08a" emissive="#f59e0b" emissiveIntensity={1.2} />
          </mesh>
          <pointLight position={[0, 1.5, 0]} color="#fbbf24" intensity={4.5} distance={12} decay={2} />
        </group>
      ))}
    </group>
  );
};
