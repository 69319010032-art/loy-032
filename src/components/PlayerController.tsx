import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { VoxelCharacter } from './VoxelCharacter';

interface PlayerControllerProps {
  onNearPier: (near: boolean) => void;
  onReleaseKrathong: (x: number, z: number) => void;
  spawnPosition?: [number, number, number];
}

// Key state tracker
const useKeyboard = () => {
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Ignore game movement keys when typing in input or textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      keys.current[e.code] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return keys;
};

export const PlayerController: React.FC<PlayerControllerProps> = ({
  onNearPier,
  onReleaseKrathong,
  spawnPosition = [0, 2, 5],
}) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null!);
  const characterRef = useRef<THREE.Group>(null!);
  const [isMoving, setIsMoving] = useState(false);
  const playerPosRef = useRef({ x: 0, z: 0 });
  const isNearPierRef = useRef(false);
  const keys = useKeyboard();
  const { camera } = useThree();

  // ─── 360° Camera Orbit State ───
  // yaw: horizontal rotation angle (0 = behind player facing -Z)
  // pitch: vertical elevation angle
  // distance: camera distance from player
  const cameraOrbit = useRef({
    yaw: 0,              // 0 rad = facing forward along -Z
    pitch: 0.38,         // ~22 degrees above horizon
    distance: 7.5,       // orbit radius
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
  });

  // Movement constants
  const MOVE_SPEED = 5.5;

  // ─── Mouse 360° Drag & Scroll Listeners ───
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      // Allow drag with left or right click
      cameraOrbit.current.isDragging = true;
      cameraOrbit.current.lastMouseX = e.clientX;
      cameraOrbit.current.lastMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!cameraOrbit.current.isDragging) return;
      const deltaX = e.clientX - cameraOrbit.current.lastMouseX;
      const deltaY = e.clientY - cameraOrbit.current.lastMouseY;
      cameraOrbit.current.lastMouseX = e.clientX;
      cameraOrbit.current.lastMouseY = e.clientY;

      // Rotate camera horizontally 360° freely
      cameraOrbit.current.yaw -= deltaX * 0.007;

      // Rotate vertically (clamped to prevent flipping upside down)
      cameraOrbit.current.pitch = Math.max(
        0.08,
        Math.min(Math.PI / 2.3, cameraOrbit.current.pitch + deltaY * 0.006)
      );
    };

    const onMouseUp = () => {
      cameraOrbit.current.isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      // Zoom camera distance
      cameraOrbit.current.distance = Math.max(
        3.5,
        Math.min(16.0, cameraOrbit.current.distance + e.deltaY * 0.005)
      );
    };

    // Touch support for mobile / trackpad drag
    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - touchStartX;
        const deltaY = e.touches[0].clientY - touchStartY;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        cameraOrbit.current.yaw -= deltaX * 0.008;
        cameraOrbit.current.pitch = Math.max(
          0.08,
          Math.min(Math.PI / 2.3, cameraOrbit.current.pitch + deltaY * 0.007)
        );
      }
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  // ─── Detect E-key press for krathong release ───
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.code === 'KeyE' && isNearPierRef.current) {
        onReleaseKrathong(playerPosRef.current.x, playerPosRef.current.z - 1.2);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onReleaseKrathong]);

  useFrame(() => {
    if (!rigidBodyRef.current) return;

    const body = rigidBodyRef.current;
    const position = body.translation();
    const yaw = cameraOrbit.current.yaw;
    const pitch = cameraOrbit.current.pitch;
    const dist = cameraOrbit.current.distance;

    // ── Input Vector (local to screen) ──
    let inputForward = 0; // W / S
    let inputRight = 0;   // D / A
    let moving = false;

    if (keys.current['KeyW'] || keys.current['ArrowUp']) {
      inputForward += 1;
      moving = true;
    }
    if (keys.current['KeyS'] || keys.current['ArrowDown']) {
      inputForward -= 1;
      moving = true;
    }
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) {
      inputRight -= 1;
      moving = true;
    }
    if (keys.current['KeyD'] || keys.current['ArrowRight']) {
      inputRight += 1;
      moving = true;
    }

    setIsMoving(moving);

    // ── Transform Input based on Camera Yaw (360° Movement!) ──
    // Camera forward vector in XZ plane
    const camForwardX = -Math.sin(yaw);
    const camForwardZ = -Math.cos(yaw);
    // Camera right vector in XZ plane
    const camRightX = Math.cos(yaw);
    const camRightZ = -Math.sin(yaw);

    const worldMoveX = camForwardX * inputForward + camRightX * inputRight;
    const worldMoveZ = camForwardZ * inputForward + camRightZ * inputRight;

    const moveVector = new THREE.Vector2(worldMoveX, worldMoveZ);
    if (moveVector.lengthSq() > 0) {
      moveVector.normalize();
    }

    // Apply linear velocity
    const currentVel = body.linvel();
    body.setLinvel(
      {
        x: moveVector.x * MOVE_SPEED,
        y: currentVel.y,
        z: moveVector.y * MOVE_SPEED,
      },
      true
    );

    // ── Rotate character to face travel direction ──
    if (characterRef.current && moving) {
      const targetAngle = Math.atan2(moveVector.x, moveVector.y);
      characterRef.current.rotation.y = THREE.MathUtils.lerp(
        characterRef.current.rotation.y,
        targetAngle,
        0.2
      );
    }

    // ── 360° Camera Orbit Position & LookAt ──
    const camTarget = new THREE.Vector3(position.x, position.y + 1.2, position.z);

    const camX = position.x + dist * Math.sin(yaw) * Math.cos(pitch);
    const camY = position.y + 1.2 + dist * Math.sin(pitch);
    const camZ = position.z + dist * Math.cos(yaw) * Math.cos(pitch);

    const desiredCamPos = new THREE.Vector3(camX, camY, camZ);
    camera.position.lerp(desiredCamPos, 0.12);
    camera.lookAt(camTarget);

    // ── Pier and Water Steps proximity detection ──
    playerPosRef.current = { x: position.x, z: position.z };
    const nearPier =
      position.x >= -4.5 &&
      position.x <= 4.5 &&
      position.z <= 0.8 &&
      position.z >= -5.2;

    isNearPierRef.current = nearPier;
    onNearPier(nearPier);

    // ── Fall Protection ──
    if (position.y < -10) {
      body.setTranslation(
        { x: spawnPosition[0], y: spawnPosition[1], z: spawnPosition[2] },
        true
      );
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={spawnPosition}
      enabledRotations={[false, false, false]}
      mass={1}
      linearDamping={4}
      lockRotations
      colliders={false}
    >
      <CapsuleCollider args={[0.5, 0.3]} position={[0, 0.9, 0]} />
      <group ref={characterRef}>
        <VoxelCharacter isMoving={isMoving} />
      </group>
    </RigidBody>
  );
};
