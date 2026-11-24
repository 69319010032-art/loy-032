import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  createBananaLeafTexture,
  createBananaTrunkTexture,
  createLotusPetalTexture
} from '../utils/proceduralTextures';

interface KrathongProps {
  isFloating?: boolean;
  wishText?: string;
  minecraftMode?: boolean;
}

export const Krathong: React.FC<KrathongProps> = ({
  isFloating = false,
  wishText = '',
  minecraftMode = false,
}) => {
  const [pos, setPos] = React.useState<[number, number, number]>([0, 0.04, -2]);
  // Minecraft‑style movement (WASD + Space/Shift)
  React.useEffect(() => {
    if (!minecraftMode) return;
    const step = 0.05;
    const onKey = (e: KeyboardEvent) => {
      setPos((p) => {
        const [x, y, z] = p;
        switch (e.key) {
          case 'w':
          case 'ArrowUp':
            return [x, y, z - step];
          case 's':
          case 'ArrowDown':
            return [x, y, z + step];
          case 'a':
          case 'ArrowLeft':
            return [x - step, y, z];
          case 'd':
          case 'ArrowRight':
            return [x + step, y, z];
          case ' ': // space up
            return [x, y + step, z];
          case 'Shift':
          case 'ShiftLeft':
          case 'ShiftRight':
            return [x, y - step, z];
          default:
            return p;
        }
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [minecraftMode]);

  const krathongGroup = useRef<THREE.Group>(null!);
  const flameLightRef = useRef<THREE.PointLight>(null!);
  const flameMeshRef = useRef<THREE.Mesh>(null!);
  const smokeParticlesRef = useRef<THREE.Points>(null!);

  // Procedural textures
  const leafTexture = useMemo(() => createBananaLeafTexture(), []);
  const trunkTexture = useMemo(() => createBananaTrunkTexture(), []);
  const lotusTexture = useMemo(() => createLotusPetalTexture(), []);

  // Banana trunk materials
  const leafMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: leafTexture,
        roughness: 0.6,
        metalness: 0.08,
        bumpMap: leafTexture,
        bumpScale: 0.015,
        side: THREE.DoubleSide
      }),
    [leafTexture]
  );

  const trunkPithMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: trunkTexture,
        roughness: 0.8,
        metalness: 0.02
      }),
    [trunkTexture]
  );

  const lotusMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: lotusTexture,
        roughness: 0.5,
        metalness: 0.05,
        side: THREE.DoubleSide
      }),
    [lotusTexture]
  );

  // Beeswax candle material
  const candleMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0xf5d061,
        roughness: 0.45,
        metalness: 0.05
      }),
    []
  );

  // Folded Banana Petal Geometry (Curved cone with sharp tip)
  const petalGeometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(0.24, 0.65, 5);
    geom.scale(1, 1, 0.4); // Flatten to create authentic folded leaf profile
    geom.translate(0, 0.3, 0);
    return geom;
  }, []);

  // Lotus Petal Geometry (Graceful cupped curve)
  const lotusPetalGeometry = useMemo(() => {
    const geom = new THREE.SphereGeometry(0.3, 8, 8, 0, Math.PI, 0, Math.PI * 0.7);
    geom.scale(0.8, 1.4, 0.3);
    geom.rotateX(Math.PI * 0.15);
    return geom;
  }, []);

  // Outer & Inner folded banana petals
  const outerPetals = useMemo(() => {
    const petals = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      petals.push({
        id: `outer-${i}`,
        x: Math.cos(angle) * 1.25,
        z: Math.sin(angle) * 1.25,
        rotationY: -angle - Math.PI / 2,
        rotationZ: -0.32 // Angle outward
      });
    }
    return petals;
  }, []);

  const innerPetals = useMemo(() => {
    const petals = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = ((i + 0.5) / count) * Math.PI * 2;
      petals.push({
        id: `inner-${i}`,
        x: Math.cos(angle) * 1.05,
        z: Math.sin(angle) * 1.05,
        rotationY: -angle - Math.PI / 2,
        rotationZ: -0.18 // Steeper angle
      });
    }
    return petals;
  }, []);

  // Lotus petals in center
  const lotusPetals = useMemo(() => {
    const petals = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      petals.push({
        id: `lotus-${i}`,
        x: Math.cos(angle) * 0.62,
        z: Math.sin(angle) * 0.62,
        rotationY: -angle - Math.PI / 2,
        rotationX: 0.35
      });
    }
    return petals;
  }, []);

  // Smoke particles geometry for incense
  const smokePoints = useMemo(() => {
    const count = 30;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.05 + 0.1;
      positions[i * 3 + 1] = 1.05 + i * 0.035;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.05 - 0.12;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, []);

  // Frame animation: candle flame flicker + incense smoke drift + water bobbing
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Natural candlelight flicker (organic, non-linear)
    if (flameLightRef.current) {
      const noise =
        Math.sin(t * 11) * 0.12 +
        Math.cos(t * 19) * 0.08 +
        Math.sin(t * 31) * 0.05;
      flameLightRef.current.intensity = 2.4 + noise;
      flameLightRef.current.distance = 4.5 + noise * 0.5;
    }

    if (flameMeshRef.current) {
      const scaleFlicker = 1 + Math.sin(t * 14) * 0.07;
      flameMeshRef.current.scale.set(scaleFlicker, 1 + Math.cos(t * 18) * 0.12, scaleFlicker);
      flameMeshRef.current.rotation.y = Math.sin(t * 6) * 0.1;
    }

    // Incense smoke subtle rise
    if (smokeParticlesRef.current) {
      const positions = smokeParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 30; i++) {
        positions[i * 3 + 1] += 0.003;
        positions[i * 3] += Math.sin(t * 3 + i) * 0.0008;
        if (positions[i * 3 + 1] > 2.2) {
          positions[i * 3 + 1] = 1.05;
          positions[i * 3] = 0.1 + (Math.random() - 0.5) * 0.03;
        }
      }
      smokeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Gentle buoyancy water bobbing when floating
    if (isFloating && krathongGroup.current) {
      krathongGroup.current.position.y = Math.sin(t * 1.5) * 0.03;
      krathongGroup.current.rotation.z = Math.sin(t * 1.2) * 0.02;
      krathongGroup.current.rotation.x = Math.cos(t * 1.1) * 0.02;
    }
  });

  return (
    <group ref={krathongGroup} position={pos} dispose={null}>
      {/* 1. Banana Trunk Core Base (หยวกกล้วย) */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.25, 0.28, 36]} />
        {/* Multi-material: sides with banana leaf, top/bottom with pith rings */}
        <primitive object={leafMaterial} attach="material-0" />
        <primitive object={trunkPithMaterial} attach="material-1" />
        <primitive object={trunkPithMaterial} attach="material-2" />
      </mesh>

      {/* 2. Outer Tier Folded Banana Leaf Petals (กลีบชั้นนอก) */}
      {outerPetals.map((petal) => (
        <group
          key={petal.id}
          position={[petal.x, 0.22, petal.z]}
          rotation={[0, petal.rotationY, petal.rotationZ]}
        >
          <mesh geometry={petalGeometry} material={leafMaterial} castShadow receiveShadow />
          {/* Small bamboo pin (ไม้กลัด) pinning petal to base */}
          <mesh position={[0, 0.08, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.14, 6]} />
            <meshStandardMaterial color="#8b7355" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* 3. Inner Tier Folded Banana Leaf Petals (กลีบชั้นใน) */}
      {innerPetals.map((petal) => (
        <group
          key={petal.id}
          position={[petal.x, 0.25, petal.z]}
          rotation={[0, petal.rotationY, petal.rotationZ]}
        >
          <mesh geometry={petalGeometry} material={leafMaterial} castShadow receiveShadow />
        </group>
      ))}

      {/* 4. Center Lotus Blossom (ดอกบัวพับกลีบ) */}
      {lotusPetals.map((petal) => (
        <group
          key={petal.id}
          position={[petal.x, 0.28, petal.z]}
          rotation={[petal.rotationX, petal.rotationY, 0]}
        >
          <mesh geometry={lotusPetalGeometry} material={lotusMaterial} castShadow />
        </group>
      ))}

      {/* 5. Golden Marigold Florets (ดอกดาวเรืองโปรยในกระทง) */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + 0.2;
        const rad = 0.35;
        return (
          <mesh
            key={`marigold-${i}`}
            position={[Math.cos(angle) * rad, 0.3, Math.sin(angle) * rad]}
            castShadow
          >
            <dodecahedronGeometry args={[0.08, 1]} />
            <meshStandardMaterial
              color="#f59e0b"
              roughness={0.7}
              bumpScale={0.05}
            />
          </mesh>
        );
      })}

      {/* 6. Traditional Beeswax Candle (เทียนขี้ผึ้งธรรมชาติ) */}
      <group position={[0, 0.58, 0.08]}>
        {/* Candle body */}
        <mesh material={candleMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.055, 0.52, 16]} />
        </mesh>
        {/* Charred wick */}
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.007, 0.007, 0.06, 6]} />
          <meshBasicMaterial color="#1a1a1a" />
        </mesh>
        {/* Candle Flame Teardrop Mesh */}
        <mesh ref={flameMeshRef} position={[0, 0.35, 0]}>
          <coneGeometry args={[0.04, 0.12, 12]} />
          <meshBasicMaterial color="#fff3a1" />
        </mesh>
        {/* Flame Warm Glow Core */}
        <mesh position={[0, 0.33, 0]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshBasicMaterial color="#ff9800" transparent opacity={0.65} />
        </mesh>
        {/* Dynamic Warm Candlelight */}
        <pointLight
          ref={flameLightRef}
          position={[0, 0.36, 0]}
          color="#ffb347"
          intensity={2.8}
          distance={5.5}
          decay={2}
          castShadow
          shadow-bias={-0.0002}
        />
      </group>

      {/* 7. Three Incense Sticks (ธูป 3 ดอก) */}
      <group position={[0.1, 0.72, -0.1]} rotation={[0.08, 0.05, -0.06]}>
        {[-0.03, 0, 0.03].map((offsetX, idx) => (
          <group key={`incense-${idx}`} position={[offsetX, 0, 0]}>
            {/* Dyed lower stick */}
            <mesh position={[0, -0.22, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.22, 6]} />
              <meshStandardMaterial color="#b91c1c" roughness={0.7} />
            </mesh>
            {/* Fragrant incense powder body */}
            <mesh position={[0, 0.12, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.46, 6]} />
              <meshStandardMaterial color="#6b5b45" roughness={0.9} />
            </mesh>
            {/* Burning red ember tip */}
            <mesh position={[0, 0.36, 0]}>
              <sphereGeometry args={[0.015, 6, 6]} />
              <meshBasicMaterial color="#ff3b00" />
            </mesh>
          </group>
        ))}
      </group>

      {/* 8. Incense Smoke Particle Wisps */}
      <points ref={smokeParticlesRef} geometry={smokePoints}>
        <pointsMaterial
          size={0.06}
          color="#cfd8dc"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* 9. Inscribed Wish Parchment Roll (คำอธิษฐานพับในกระทง) */}
      {wishText && (
        <group position={[-0.25, 0.29, 0.2]} rotation={[0.1, 0.4, -0.05]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.32, 12]} />
            <meshStandardMaterial color="#fef3c7" roughness={0.8} />
          </mesh>
          {/* Gold ribbon wrap */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.042, 0.042, 0.04, 12]} />
            <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}
    </group>
  );
};
