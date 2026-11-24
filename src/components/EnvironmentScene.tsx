import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createBenjarongTexture,
  createThaiRoofTexture,
  createGildedLacquerTexture
} from '../utils/proceduralTextures';

export const EnvironmentScene: React.FC = () => {
  const lanternsGroupRef = useRef<THREE.Group>(null!);

  const benjarongTexture = useMemo(() => createBenjarongTexture(), []);
  const roofTexture = useMemo(() => createThaiRoofTexture(), []);
  const lacquerTexture = useMemo(() => createGildedLacquerTexture(), []);

  // Wat Arun Glazed Benjarong Porcelain Mosaic Material
  const benjarongMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: benjarongTexture,
        roughness: 0.2,
        metalness: 0.2,
        bumpMap: benjarongTexture,
        bumpScale: 0.02
      }),
    [benjarongTexture]
  );

  // Siamese Glazed Ceramic Roof Tile Material
  const authenticRoofMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: roofTexture,
        roughness: 0.3,
        metalness: 0.18,
        bumpMap: roofTexture,
        bumpScale: 0.03
      }),
    [roofTexture]
  );

  // Gilded Lacquer & Pediment Material (ลายรดน้ำปิดทองคำเปลว)
  const gildedLacquerMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: lacquerTexture,
        roughness: 0.25,
        metalness: 0.85,
        emissive: 0x78350f,
        emissiveIntensity: 0.4
      }),
    [lacquerTexture]
  );

  // Pure 24K Glistening Royal Gold Leaf
  const royalGoldMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.14,
        emissive: 0x78350f,
        emissiveIntensity: 0.38
      }),
    []
  );

  // Polished White Marble Material
  const marbleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xfbf9f5,
        roughness: 0.32,
        metalness: 0.08
      }),
    []
  );

  // Ubosot Glowing Interior Windows
  const glowingWindowMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        emissive: 0xf59e0b,
        emissiveIntensity: 1.5,
        roughness: 0.2
      }),
    []
  );

  // 1. Royal Golden Chedi (พระศรีรัตนเจดีย์ทองคำแท้)
  const createMonumentalChedi = (scale = 1.0) => (
    <group scale={[scale, scale, scale]}>
      {/* 3-Tiered Octagonal Marble Base */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[6.5, 8.2, 3.6, 24]} />
        <primitive object={marbleMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[5.2, 6.5, 2.8, 24]} />
        <primitive object={marbleMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 6.2, 0]} castShadow>
        <cylinderGeometry args={[4.2, 5.2, 2.0, 24]} />
        <primitive object={royalGoldMaterial} attach="material" />
      </mesh>

      {/* Pure Gold Leaf Bell Dome */}
      <mesh position={[0, 9.8, 0]} castShadow receiveShadow>
        <sphereGeometry args={[3.8, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.78]} />
        <primitive object={royalGoldMaterial} attach="material" />
      </mesh>

      {/* Throne Block (บัลลังก์ประดับลายรดน้ำ) */}
      <mesh position={[0, 13.2, 0]} castShadow>
        <boxGeometry args={[3.0, 1.0, 3.0]} />
        <primitive object={gildedLacquerMaterial} attach="material" />
      </mesh>

      {/* Spire Rings (ปล้องไฉน 9 ชั้น) */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((ring) => (
        <mesh key={`chedi-ring-${ring}`} position={[0, 14.2 + ring * 0.68, 0]} castShadow>
          <cylinderGeometry args={[1.2 - ring * 0.1, 1.45 - ring * 0.1, 0.5, 16]} />
          <primitive object={royalGoldMaterial} attach="material" />
        </mesh>
      ))}

      {/* Lotus Pinnacle & Needle Spire */}
      <mesh position={[0, 21.2, 0]} castShadow>
        <coneGeometry args={[0.42, 4.0, 16]} />
        <primitive object={royalGoldMaterial} attach="material" />
      </mesh>
      <mesh position={[0, 23.5, 0]}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Golden Spotlights */}
      <pointLight position={[0, 8, 5]} color="#fbbf24" intensity={8.5} distance={38} decay={2} />
      <pointLight position={[0, 18, 4]} color="#fef08a" intensity={6.5} distance={30} decay={2} />
    </group>
  );

  // 2. Wat Arun Benjarong Grand Prang
  const watArunComplex = useMemo(() => {
    return (
      <group position={[-18, 0, 8]}>
        {/* Central Monumental Grand Prang */}
        <group position={[0, 0, 0]}>
          <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[8.5, 11.2, 6.4, 24]} />
            <primitive object={benjarongMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 8.0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[6.8, 8.5, 5.0, 24]} />
            <primitive object={benjarongMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 12.8, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[5.5, 6.8, 5.2, 24]} />
            <primitive object={benjarongMaterial} attach="material" />
          </mesh>

          {/* Stepped Prang Core Body */}
          <mesh position={[0, 19.8, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[4.2, 5.5, 9.8, 24]} />
            <primitive object={benjarongMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 26.5, 0]} castShadow>
            <coneGeometry args={[4.2, 9.0, 24]} />
            <primitive object={benjarongMaterial} attach="material" />
          </mesh>

          {/* Gilded Trident Crown (นภศูลทองคำ 7 แฉก) */}
          <mesh position={[0, 32.5, 0]} castShadow>
            <coneGeometry args={[1.0, 6.0, 16]} />
            <primitive object={royalGoldMaterial} attach="material" />
          </mesh>
          <mesh position={[0, 35.8, 0]}>
            <sphereGeometry args={[0.45, 12, 12]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>

          {/* Grand Uplighting */}
          <pointLight position={[0, 12, 7]} color="#f59e0b" intensity={12.0} distance={50} decay={2} />
          <pointLight position={[0, 24, 6]} color="#fef08a" intensity={10.0} distance={42} decay={2} />
        </group>

        {/* 2 Satellite Prangs along riverside */}
        {[
          [-7, -7],
          [7, -7]
        ].map(([px, pz], idx) => (
          <group key={`sat-prang-${idx}`} position={[px, 0, pz]} scale={[0.55, 0.55, 0.55]}>
            <mesh position={[0, 3.8, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[3.6, 5.2, 7.6, 16]} />
              <primitive object={benjarongMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 11.2, 0]} castShadow>
              <coneGeometry args={[3.4, 8.8, 16]} />
              <primitive object={benjarongMaterial} attach="material" />
            </mesh>
            <mesh position={[0, 16.8, 0]} castShadow>
              <coneGeometry args={[0.8, 4.6, 12]} />
              <primitive object={royalGoldMaterial} attach="material" />
            </mesh>
            <pointLight position={[0, 7, 3]} color="#fbbf24" intensity={5.0} distance={22} decay={2} />
          </group>
        ))}
      </group>
    );
  }, [benjarongMaterial, royalGoldMaterial]);

  // 3. Grand Ubosot Hall with Siamese Roof Tiles and Gilded Pediments
  const ubosotHall = useMemo(() => {
    return (
      <group position={[0, 0, 18]}>
        <mesh position={[0, 4.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[22, 8.4, 13]} />
          <primitive object={marbleMaterial} attach="material" />
        </mesh>
        {/* Latticed Windows with Gilded Frames */}
        {[-7, -2.5, 2.5, 7].map((wx, i) => (
          <group key={`win-front-${i}`} position={[wx, 4.6, -6.6]}>
            <mesh>
              <planeGeometry args={[1.8, 3.4]} />
              <primitive object={glowingWindowMaterial} attach="material" />
            </mesh>
            {/* Gilded Window Frame */}
            <mesh position={[0, 0, -0.02]}>
              <boxGeometry args={[2.0, 3.6, 0.04]} />
              <primitive object={gildedLacquerMaterial} attach="material" />
            </mesh>
          </group>
        ))}

        {/* Multi-Tiered Glazed Roofs with Siamese Ceramic Tiles */}
        <mesh position={[0, 10.6, 0]} castShadow>
          <coneGeometry args={[15, 5.6, 4]} />
          <primitive object={authenticRoofMaterial} attach="material" />
        </mesh>
        <mesh position={[0, 14.4, 0]} castShadow>
          <coneGeometry args={[11.5, 4.8, 4]} />
          <primitive object={authenticRoofMaterial} attach="material" />
        </mesh>

        {/* Gilded Front Pediment (หน้าบันจำหลักลายกนกปิดทอง) */}
        <mesh position={[0, 9.2, -6.4]} rotation={[0, 0, 0]}>
          <coneGeometry args={[5.5, 3.2, 3]} />
          <primitive object={gildedLacquerMaterial} attach="material" />
        </mesh>

        {/* Chofah Apex Finials */}
        <mesh position={[0, 17.5, 0]} castShadow>
          <coneGeometry args={[0.55, 3.2, 8]} />
          <primitive object={royalGoldMaterial} attach="material" />
        </mesh>

        <pointLight position={[0, 6, -7]} color="#f59e0b" intensity={9.0} distance={35} decay={2} />
      </group>
    );
  }, [marbleMaterial, glowingWindowMaterial, gildedLacquerMaterial, authenticRoofMaterial, royalGoldMaterial]);

  // 4. Floating Sky Lanterns
  const skyLanterns = useMemo(() => {
    return Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 120 + 5,
      y: 18 + Math.random() * 45,
      z: -30 - Math.random() * 70,
      scale: 0.4 + Math.random() * 0.5,
      speed: 0.2 + Math.random() * 0.3,
      sway: 0.6 + Math.random() * 1.2
    }));
  }, []);

  const starPositions = useMemo(() => {
    const count = 650;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 260;
      positions[i * 3 + 1] = 18 + Math.random() * 85;
      positions[i * 3 + 2] = -45 - Math.random() * 120;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lanternsGroupRef.current) {
      lanternsGroupRef.current.children.forEach((child, idx) => {
        const item = skyLanterns[idx];
        if (!item) return;
        const currentY = item.y + ((t * item.speed) % 50);
        const currentX = item.x + Math.sin(t * 0.5 + item.id) * item.sway;
        child.position.set(currentX, currentY, item.z);
      });
    }
  });

  return (
    <>
      <fogExp2 attach="fog" args={['#0c142b', 0.0045]} />
      <hemisphereLight args={['#60a5fa', '#f59e0b', 1.6]} />

      <directionalLight
        position={[25, 65, -30]}
        intensity={2.8}
        color="#e0e7ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={160}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
        shadow-bias={-0.0001}
      />

      <directionalLight position={[-20, 30, 25]} intensity={1.2} color="#fef08a" />

      {/* Full Moon */}
      <group position={[28, 48, -100]}>
        <mesh>
          <sphereGeometry args={[7.2, 32, 32]} />
          <meshBasicMaterial color="#fffef0" />
        </mesh>
        <mesh scale={[1.4, 1.4, 1.4]}>
          <sphereGeometry args={[7.2, 24, 24]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.38} side={THREE.BackSide} />
        </mesh>
        <mesh scale={[2.5, 2.5, 2.5]}>
          <sphereGeometry args={[7.2, 16, 16]} />
          <meshBasicMaterial color="#f59e0b" transparent opacity={0.16} side={THREE.BackSide} />
        </mesh>
        <pointLight color="#fef08a" intensity={6.0} distance={120} decay={2} />
      </group>

      <points geometry={starPositions}>
        <pointsMaterial size={0.28} color="#fef08a" transparent opacity={0.85} depthWrite={false} />
      </points>

      {/* ALL-IN-ONE TEMPLE COMPLEX */}
      {ubosotHall}
      {watArunComplex}

      <group position={[17, 0, 7]}>
        {createMonumentalChedi(1.15)}
      </group>

      {/* Distant Shoreline */}
      <group position={[0, 0, -85]}>
        <mesh position={[0, 0.4, 0]} receiveShadow>
          <boxGeometry args={[300, 1.0, 30]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
        <mesh position={[-30, 4.5, 0]}>
          <cylinderGeometry args={[2.5, 4.0, 8, 12]} />
          <meshBasicMaterial color="#080e1c" />
        </mesh>
        <mesh position={[-30, 10.5, 0]}>
          <coneGeometry args={[2.2, 6, 12]} />
          <meshBasicMaterial color="#080e1c" />
        </mesh>
        <pointLight position={[-30, 6, 2]} color="#f59e0b" intensity={2.5} distance={20} decay={2} />
      </group>

      {/* Floating Sky Lanterns */}
      <group ref={lanternsGroupRef}>
        {skyLanterns.map((l) => (
          <group key={l.id} scale={[l.scale, l.scale, l.scale]}>
            <mesh>
              <cylinderGeometry args={[0.35, 0.45, 0.85, 12]} />
              <meshBasicMaterial color="#fff3a1" />
            </mesh>
            <mesh scale={[1.3, 1.3, 1.3]}>
              <cylinderGeometry args={[0.35, 0.45, 0.85, 12]} />
              <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
            </mesh>
            <pointLight color="#fbbf24" intensity={2.0} distance={9} decay={2} />
          </group>
        ))}
      </group>
    </>
  );
};
