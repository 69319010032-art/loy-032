import React, { useState, useCallback, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import * as THREE from 'three';
import { PlayerController } from './components/PlayerController';
import { FestivalEnvironment } from './components/FestivalEnvironment';
import { KrathongSystem, useKrathongSpawner } from './components/KrathongSystem';
import { DistantKrathongs } from './components/DistantKrathongs';
import { SkyBanner } from './components/SkyBanner';
import { StarrySky } from './components/StarrySky';
import { GameHUD } from './components/GameHUD';

// ─── Inner scene wrapped in Physics ───
const GameScene: React.FC = () => {
  const [nearPier, setNearPier] = useState(false);
  const { krathongs, spawnKrathong } = useKrathongSpawner();
  const [krathongCount, setKrathongCount] = useState(0);
  const playerPosRef = useRef<{ x: number; z: number }>({ x: 0, z: -3.8 });

  const handleNearPier = useCallback((near: boolean) => {
    setNearPier(near);
  }, []);

  const handlePlayerRelease = useCallback(
    (x: number, z: number) => {
      playerPosRef.current = { x, z };
      // When E is pressed, GameHUD opens the wish modal
    },
    []
  );

  const handleReleaseWithWish = useCallback(
    (wishText: string) => {
      // Spawn krathong right in front of the player (or at water's edge)
      const spawnX = playerPosRef.current.x;
      const spawnZ = Math.min(-4.6, playerPosRef.current.z - 1.0);
      spawnKrathong(spawnX, spawnZ, wishText);
      setKrathongCount((c) => c + 1);
    },
    [spawnKrathong]
  );

  return (
    <>
      {/* ── HUD overlay (HTML) with Wish Input Modal ── */}
      <GameHUD
        showPrompt={nearPier}
        krathongCount={krathongCount}
        onReleaseWithWish={handleReleaseWithWish}
      />

      {/* ── 3D Canvas ── */}
      <Canvas
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.85,
        }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Soft distant horizon fog */}
        <fog attach="fog" args={['#162540', 65, 160]} />

        {/* Deep clear twilight night sky */}
        <color attach="background" args={['#0e182e']} />

        <Suspense fallback={null}>
          {/* Twinkling Starfield in the Night Sky */}
          <StarrySky />

          {/* Radiant Golden Sky Typography: "ที่ชวนลอยหวังซอยอย่างเดียว" */}
          <SkyBanner />

          <Physics gravity={[0, -9.81, 0]}>
            {/* Player with third-person 360° camera */}
            <PlayerController
              onNearPier={handleNearPier}
              onReleaseKrathong={handlePlayerRelease}
              spawnPosition={[0, 2, 5]}
            />

            {/* Festival environment with stairs and solid colliders */}
            <FestivalEnvironment />
          </Physics>

          {/* Fleet of Krathongs drifting downstream along the river */}
          <DistantKrathongs />

          {/* Player-released floating krathongs with custom wishes */}
          <KrathongSystem krathongs={krathongs} />
        </Suspense>
      </Canvas>
    </>
  );
};

// ─── App Root ───
export default function App() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#0e182e',
      }}
    >
      <GameScene />
    </div>
  );
}
