import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { createWaterRippleTexture } from '../utils/proceduralTextures';

// ─── Procedural Wood Texture ───
function createWoodTexture(baseColor: string = '#8b6914'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 128, 128);

  for (let i = 0; i < 40; i++) {
    const y = Math.random() * 128;
    ctx.strokeStyle = `rgba(0,0,0,${0.08 + Math.random() * 0.12})`;
    ctx.lineWidth = 0.5 + Math.random() * 1.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(128, y + (Math.random() - 0.5) * 10);
    ctx.stroke();
  }

  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = `rgba(50,25,0,${0.2 + Math.random() * 0.15})`;
    ctx.beginPath();
    ctx.arc(Math.random() * 128, Math.random() * 128, 3 + Math.random() * 6, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

// ─── Single Festival Stall (With Solid Physics Collider) ───
const FestivalStall: React.FC<{
  position: [number, number, number];
  rotation?: number;
  roofColor: string;
  name: string;
}> = ({ position, rotation = 0, roofColor }) => {
  const woodTex = useMemo(() => createWoodTexture('#805a2e'), []);

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Solid Collider: Player CANNOT walk through stall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 1.1, 0]} visible={false}>
          <boxGeometry args={[2.7, 2.3, 2.0]} />
        </mesh>
      </RigidBody>

      {/* Posts (4 corners) */}
      {[
        [-1.1, 1.2, -0.7],
        [1.1, 1.2, -0.7],
        [-1.1, 1.2, 0.7],
        [1.1, 1.2, 0.7],
      ].map((pos, i) => (
        <mesh key={`post-${i}`} position={pos as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 2.4, 0.1]} />
          <meshStandardMaterial map={woodTex} roughness={0.85} />
        </mesh>
      ))}

      {/* Counter / Table top */}
      <mesh position={[0, 0.85, -0.7]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.1, 0.9]} />
        <meshStandardMaterial map={woodTex} roughness={0.8} color="#9e7b3c" />
      </mesh>

      {/* Front Skirt / Banner */}
      <mesh position={[0, 0.42, -1.14]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.75, 0.04]} />
        <meshStandardMaterial color={roofColor} roughness={0.85} />
      </mesh>

      {/* Canvas Roof (tilted & arched) */}
      <mesh position={[0, 2.5, 0]} rotation={[0.12, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.06, 2.1]} />
        <meshStandardMaterial color={roofColor} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.3, 0.73]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 2.0, 0.06]} />
        <meshStandardMaterial map={woodTex} roughness={0.9} color="#6b4423" />
      </mesh>

      {/* Hanging Thai festival lantern */}
      <group position={[0, 2.05, -0.2]}>
        <mesh>
          <sphereGeometry args={[0.14, 12, 12]} />
          <meshBasicMaterial color="#fff0a0" />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.2, 0.26, 0.24, 12]} />
          <meshStandardMaterial color="#f97316" roughness={0.4} emissive="#f97316" emissiveIntensity={0.6} transparent opacity={0.85} />
        </mesh>
      </group>

      {/* Colorful festival items on counter */}
      {[...Array(5)].map((_, i) => (
        <mesh
          key={`item-${i}`}
          position={[-0.8 + i * 0.4, 0.98, -0.7]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[0.22, 0.16, 0.22]} />
          <meshStandardMaterial
            color={['#fbbf24', '#ef4444', '#10b981', '#a855f7', '#f97316'][i]}
            roughness={0.5}
            emissive={['#fbbf24', '#ef4444', '#10b981', '#a855f7', '#f97316'][i]}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
};

// ─── String Lights (Enhanced Glowing Festoons) ───
const StringLights: React.FC<{
  from: [number, number, number];
  to: [number, number, number];
  count?: number;
}> = ({ from, to, count = 10 }) => {
  const lights = useMemo(() => {
    const result = [];
    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const x = THREE.MathUtils.lerp(from[0], to[0], t);
      const y = THREE.MathUtils.lerp(from[1], to[1], t) - Math.sin(t * Math.PI) * 0.45;
      const z = THREE.MathUtils.lerp(from[2], to[2], t);
      result.push([x, y, z] as [number, number, number]);
    }
    return result;
  }, [from, to, count]);

  return (
    <group>
      {/* Wire */}
      {lights.map((pos, i) =>
        i < lights.length - 1 ? (
          <mesh
            key={`wire-${i}`}
            position={[
              (pos[0] + lights[i + 1][0]) / 2,
              (pos[1] + lights[i + 1][1]) / 2,
              (pos[2] + lights[i + 1][2]) / 2,
            ]}
          >
            <boxGeometry args={[0.02, 0.02, 0.6]} />
            <meshBasicMaterial color="#1f1f1f" />
          </mesh>
        ) : null
      )}

      {/* Bulbs with bright glowing halo */}
      {lights.map((pos, i) => (
        <group key={`bulb-${i}`} position={pos}>
          <mesh>
            <sphereGeometry args={[0.08, 10, 10]} />
            <meshBasicMaterial color="#fffbe6" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.15, 10, 10]} />
            <meshBasicMaterial color="#ffa834" transparent opacity={0.45} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ─── Rotating Ferris Wheel ───
const AnimatedFerrisWheel: React.FC = () => {
  const wheelRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.z += delta * 0.25;
    }
  });

  return (
    <group position={[18, 9, -24]}>
      <group ref={wheelRef}>
        <mesh>
          <torusGeometry args={[7, 0.18, 8, 36]} />
          <meshBasicMaterial color="#ff5722" />
        </mesh>
        <mesh>
          <torusGeometry args={[4.2, 0.12, 8, 28]} />
          <meshBasicMaterial color="#ffb300" />
        </mesh>
        <mesh>
          <cylinderGeometry args={[0.8, 0.8, 0.4, 16]} />
          <meshBasicMaterial color="#00e5ff" />
        </mesh>
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh
              key={`spoke-${i}`}
              position={[Math.cos(angle) * 3.5, Math.sin(angle) * 3.5, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.09, 7, 0.09]} />
              <meshBasicMaterial color="#ffd54f" />
            </mesh>
          );
        })}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const colors = ['#f43f5e', '#10b981', '#3b82f6', '#fbbf24', '#a855f7', '#06b6d4'];
          const color = colors[i % colors.length];
          return (
            <group key={`gondola-${i}`} position={[Math.cos(angle) * 7, Math.sin(angle) * 7, 0]}>
              <mesh>
                <boxGeometry args={[0.65, 0.75, 0.65]} />
                <meshBasicMaterial color={color} />
              </mesh>
              <mesh position={[0, 0.45, 0]}>
                <sphereGeometry args={[0.16, 8, 8]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Stand */}
      {[-1, 1].map((side) => (
        <group key={`stand-${side}`}>
          <mesh position={[side * 3, -4.5, side * 0.4]} rotation={[0, 0, -side * 0.35]}>
            <boxGeometry args={[0.25, 10, 0.25]} />
            <meshStandardMaterial color="#374151" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ─── Floating Sky Lanterns ───
const SkyLanterns: React.FC = () => {
  const lanterns = useMemo(() => {
    return [...Array(22)].map((_, i) => ({
      id: i,
      x: (Math.sin(i * 1.5) * 0.5 + 0.5) * 44 - 22,
      initialY: 8 + (i * 1.6),
      z: -14 - (i * 2.4),
      speedY: 0.15 + (i % 5) * 0.06,
      swayFreq: 0.5 + (i % 3) * 0.3,
    }));
  }, []);

  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const l = lanterns[i];
      if (l) {
        child.position.y = l.initialY + ((t * l.speedY) % 38);
        child.position.x = l.x + Math.sin(t * l.swayFreq + i) * 0.8;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {lanterns.map((l) => (
        <group key={l.id} position={[l.x, l.initialY, l.z]}>
          <mesh>
            <cylinderGeometry args={[0.22, 0.28, 0.55, 10]} />
            <meshBasicMaterial color="#ffaa33" />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial color="#fff3a0" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// ─── Broad Reflective River Water Surface (Clear, Vibrant Tropical Water) ───
const RiverWater: React.FC = () => {
  const waterRef = useRef<THREE.Mesh>(null!);
  const rippleTex = useMemo(() => {
    const tex = createWaterRippleTexture();
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 6);
    return tex;
  }, []);

  useFrame((state, delta) => {
    if (waterRef.current) {
      const t = state.clock.getElapsedTime();
      waterRef.current.position.y = -0.28 + Math.sin(t * 1.3) * 0.012;
      if (rippleTex) {
        rippleTex.offset.x += delta * 0.02;
        rippleTex.offset.y += delta * 0.035;
      }
    }
  });

  return (
    <group>
      {/* 1. Main River Water Plane - Clearly colored deep serene cyan-blue water with ripple map */}
      <mesh ref={waterRef} receiveShadow position={[0, -0.28, -35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[140, 80, 48, 48]} />
        <meshStandardMaterial
          color="#104a75"
          roughness={0.25}
          metalness={0.35}
          bumpMap={rippleTex}
          bumpScale={0.05}
        />
      </mesh>

      {/* 2. Water Surface Glow & Highlight Layer */}
      <mesh position={[0, -0.27, -35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[140, 80]} />
        <meshBasicMaterial
          color="#155e8c"
          transparent
          opacity={0.32}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Shoreline Foam & Riverbank Water Edge (Showing clearly where the land meets the water!) */}
      <mesh position={[0, -0.26, -2.72]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[45, 0.45]} />
        <meshBasicMaterial color="#a5f3fc" transparent opacity={0.65} depthWrite={false} />
      </mesh>
      {/* Wet shoreline sand / mud strip */}
      <mesh position={[0, -0.27, -2.52]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[45, 0.45]} />
        <meshStandardMaterial color="#2d1f14" roughness={0.9} />
      </mesh>

      {/* 4. Water Ripple Foam around Pier Steps */}
      <mesh position={[0, -0.26, -4.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 1.2]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.35} depthWrite={false} />
      </mesh>
    </group>
  );
};

// ─── Main Festival Environment ───
export const FestivalEnvironment: React.FC = () => {
  const dirtTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#423023';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 800; i++) {
      ctx.fillStyle = `rgba(${90 + Math.random() * 45},${60 + Math.random() * 35},${30 + Math.random() * 25},${0.35 + Math.random() * 0.3})`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 1 + Math.random() * 3, 1 + Math.random() * 3);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8);
    return tex;
  }, []);

  const woodTex = useMemo(() => createWoodTexture(), []);

  return (
    <group>
      {/* ══════ GROUND (dirt path) ══════ */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[0, -0.05, 8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[35, 22]} />
          <meshStandardMaterial map={dirtTexture} roughness={0.92} color="#523d2c" />
        </mesh>
      </RigidBody>

      {/* ══════ WOODEN PIER / BOARDWALK FLOOR ══════ */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow castShadow position={[0, 0.15, -0.5]}>
          <boxGeometry args={[9, 0.32, 4.4]} />
          <meshStandardMaterial map={woodTex} roughness={0.78} color="#9e7721" />
        </mesh>
      </RigidBody>

      {/* ══════ PIER STAIRS (บันไดท่าน้ำเดินลงไปริมน้ำ) ══════ */}
      {/* Step 1 (Top Step) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow castShadow position={[0, 0.03, -3.1]}>
          <boxGeometry args={[3.2, 0.22, 0.8]} />
          <meshStandardMaterial map={woodTex} roughness={0.8} color="#96721d" />
        </mesh>
      </RigidBody>

      {/* Step 2 (Middle Step) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow castShadow position={[0, -0.11, -3.8]}>
          <boxGeometry args={[3.2, 0.22, 0.8]} />
          <meshStandardMaterial map={woodTex} roughness={0.8} color="#8c6a1b" />
        </mesh>
      </RigidBody>

      {/* Step 3 (Lowest Step touching water surface!) */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow castShadow position={[0, -0.23, -4.5]}>
          <boxGeometry args={[3.4, 0.22, 0.8]} />
          <meshStandardMaterial map={woodTex} roughness={0.82} color="#7c5d17" />
        </mesh>
      </RigidBody>

      {/* ── Solid Colliders: Pier Front Railings (Left & Right of stairs) ── */}
      {/* Left Front Railing Collider */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-3.05, 0.8, -2.6]} visible={false}>
          <boxGeometry args={[3.0, 1.6, 0.3]} />
        </mesh>
      </RigidBody>
      {/* Right Front Railing Collider */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[3.05, 0.8, -2.6]} visible={false}>
          <boxGeometry args={[3.0, 1.6, 0.3]} />
        </mesh>
      </RigidBody>

      {/* ── Solid Colliders: Stair Side Guards (Prevent falling off sides of steps) ── */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-1.75, 0.5, -3.8]} visible={false}>
          <boxGeometry args={[0.3, 1.6, 2.3]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[1.75, 0.5, -3.8]} visible={false}>
          <boxGeometry args={[0.3, 1.6, 2.3]} />
        </mesh>
      </RigidBody>

      {/* ── Solid Collider: End of Step 3 Water Safety Barrier ── */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 0.2, -4.95]} visible={false}>
          <boxGeometry args={[3.6, 0.9, 0.2]} />
        </mesh>
      </RigidBody>

      {/* ── Solid Colliders: Pier Left & Right Edges ── */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-4.55, 0.8, -0.5]} visible={false}>
          <boxGeometry args={[0.35, 1.6, 4.5]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[4.55, 0.8, -0.5]} visible={false}>
          <boxGeometry args={[0.35, 1.6, 4.5]} />
        </mesh>
      </RigidBody>

      {/* ── Solid Colliders: Festival Outer Boundary Walls ── */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[0, 2, 19]} visible={false}>
          <boxGeometry args={[36, 4, 0.5]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[-17, 2, 8]} visible={false}>
          <boxGeometry args={[0.5, 4, 24]} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh position={[17, 2, 8]} visible={false}>
          <boxGeometry args={[0.5, 4, 24]} />
        </mesh>
      </RigidBody>

      {/* Pier railing posts (Left side) */}
      {[-4.0, -2.8, -1.6].map((x, i) => (
        <mesh key={`rail-l-${i}`} position={[x, 0.72, -2.6]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 1.05, 0.12]} />
          <meshStandardMaterial map={woodTex} roughness={0.85} color="#784f22" />
        </mesh>
      ))}
      <mesh position={[-2.8, 1.15, -2.6]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.1, 0.1]} />
        <meshStandardMaterial map={woodTex} roughness={0.85} color="#784f22" />
      </mesh>

      {/* Pier railing posts (Right side) */}
      {[1.6, 2.8, 4.0].map((x, i) => (
        <mesh key={`rail-r-${i}`} position={[x, 0.72, -2.6]} castShadow receiveShadow>
          <boxGeometry args={[0.12, 1.05, 0.12]} />
          <meshStandardMaterial map={woodTex} roughness={0.85} color="#784f22" />
        </mesh>
      ))}
      <mesh position={[2.8, 1.15, -2.6]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.1, 0.1]} />
        <meshStandardMaterial map={woodTex} roughness={0.85} color="#784f22" />
      </mesh>

      {/* Stair Decorative Handrails & Posts */}
      {[-1.65, 1.65].map((x, sideIdx) => (
        <group key={`stair-rail-${sideIdx}`}>
          {/* Top Post */}
          <mesh position={[x, 0.75, -2.7]} castShadow>
            <boxGeometry args={[0.14, 1.1, 0.14]} />
            <meshStandardMaterial map={woodTex} roughness={0.85} color="#6b4423" />
          </mesh>
          {/* Bottom Post right by water */}
          <mesh position={[x, 0.35, -4.5]} castShadow>
            <boxGeometry args={[0.14, 1.0, 0.14]} />
            <meshStandardMaterial map={woodTex} roughness={0.85} color="#6b4423" />
          </mesh>
          {/* Angled Handrail */}
          <mesh position={[x, 0.55, -3.6]} rotation={[0.42, 0, 0]} castShadow>
            <boxGeometry args={[0.08, 0.08, 2.1]} />
            <meshStandardMaterial map={woodTex} roughness={0.85} color="#784f22" />
          </mesh>
          {/* Warm Golden Lantern on stair post */}
          <mesh position={[x, 1.35, -2.7]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          <mesh position={[x, 0.9, -4.5]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      ))}

      {/* Pier support pillars into river */}
      {[-3.5, -1.2, 1.2, 3.5].map((x, i) => (
        <mesh key={`pillar-${i}`} position={[x, -0.8, -1.5]} castShadow receiveShadow>
          <boxGeometry args={[0.28, 2.2, 0.28]} />
          <meshStandardMaterial map={woodTex} roughness={0.9} color="#5a3e1c" />
        </mesh>
      ))}

      {/* ══════ RIVER ══════ */}
      <RiverWater />

      {/* ══════ FESTIVAL STALLS (With Solid Colliders) ══════ */}
      <FestivalStall position={[-5.2, 0, 6]} rotation={Math.PI / 5.5} roofColor="#dc2626" name="ร้านส้มตำไก่ย่าง" />
      <FestivalStall position={[5.2, 0, 7]} rotation={-Math.PI / 5.5} roofColor="#2563eb" name="ร้านปาลูกโป่ง" />
      <FestivalStall position={[-3.8, 0, 12]} rotation={0} roofColor="#f59e0b" name="ร้านขนมไทย" />
      <FestivalStall position={[4.2, 0, 13]} rotation={Math.PI / 7} roofColor="#059669" name="ร้านกระทงวิจิตร" />

      {/* ══════ STRING LIGHTS (Multi-Tier Warm Glow) ══════ */}
      <StringLights from={[-5.5, 3.6, 5]} to={[5.5, 3.6, 5]} count={12} />
      <StringLights from={[-6.5, 3.9, 9]} to={[6.5, 3.9, 9]} count={14} />
      <StringLights from={[-4.5, 3.4, 1]} to={[4.5, 3.4, 1]} count={10} />
      <StringLights from={[-4.0, 3.2, -1.2]} to={[4.0, 3.2, -1.2]} count={10} />

      {/* ══════ ROTATING FERRIS WHEEL ══════ */}
      <AnimatedFerrisWheel />

      {/* ══════ FLOATING SKY LANTERNS ══════ */}
      <SkyLanterns />

      {/* ══════ POWERFUL CINEMATIC & HIGH-VISIBILITY LIGHTING ══════ */}
      {/* 1. Natural Hemisphere Light (Fills all shadows softly with sky & ground bounce, 0 texture cost) */}
      <hemisphereLight
        skyColor="#a8cbfa"
        groundColor="#5c442c"
        intensity={1.2}
      />

      {/* 2. Silvery Moonlight (Only shadow-casting directional light) */}
      <directionalLight
        position={[15, 28, -10]}
        color="#c8e0ff"
        intensity={1.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0003}
      />

      {/* 3. Rich Ambient Base Light */}
      <ambientLight color="#3b527a" intensity={0.9} />

      {/* 4. Golden Festival Tungsten Glow (High-energy warm area lights) */}
      {/* Pier Deck & Stairs Light (Directly illuminates the wooden steps and river surface) */}
      <pointLight position={[0, 2.5, -3.8]} color="#ffba54" intensity={8.5} distance={16} decay={2} />
      <pointLight position={[0, 4.0, -0.6]} color="#ffb547" intensity={7.0} distance={18} decay={2} />
      {/* Market stalls front left & right */}
      <pointLight position={[-3.5, 4.2, 5.8]} color="#ffa338" intensity={7.0} distance={20} decay={2} />
      <pointLight position={[3.5, 4.2, 6.2]} color="#ffa338" intensity={7.0} distance={20} decay={2} />
      {/* Mid-path festival glow */}
      <pointLight position={[0, 4.5, 11.5]} color="#ffad42" intensity={6.5} distance={22} decay={2} />

      {/* 5. Giant Glowing Full Moon with Halo */}
      <group position={[14, 26, -38]}>
        <mesh>
          <sphereGeometry args={[3.2, 20, 20]} />
          <meshBasicMaterial color="#fffbeb" />
        </mesh>
        <mesh>
          <sphereGeometry args={[5.2, 16, 16]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.25} />
        </mesh>
        <mesh>
          <sphereGeometry args={[8.0, 16, 16]} />
          <meshBasicMaterial color="#93c5fd" transparent opacity={0.12} />
        </mesh>
      </group>

      {/* 6. Fireflies (Bright, magical floating particles) */}
      {[...Array(30)].map((_, i) => (
        <group
          key={`firefly-${i}`}
          position={[
            (Math.sin(i * 1.9) * 0.5 + 0.5) * 26 - 13,
            0.6 + ((i * 0.35) % 3.0),
            (Math.cos(i * 2.5) * 0.5 + 0.5) * 22 - 6,
          ]}
        >
          <mesh>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshBasicMaterial color="#d9f99d" />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.12, 6, 6]} />
            <meshBasicMaterial color="#84cc16" transparent opacity={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
