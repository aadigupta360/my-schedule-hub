import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import * as THREE from 'three';

function AnimatedSphere({ position, color, speed, distort }: { 
  position: [number, number, number]; 
  color: string; 
  speed: number;
  distort: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
      
      <AnimatedSphere position={[-3, 2, -5]} color="#8b5cf6" speed={0.3} distort={0.4} />
      <AnimatedSphere position={[3, -2, -8]} color="#0ea5e9" speed={0.2} distort={0.5} />
      <AnimatedSphere position={[0, 3, -10]} color="#eab308" speed={0.25} distort={0.3} />
      <AnimatedSphere position={[-4, -3, -12]} color="#22c55e" speed={0.15} distort={0.6} />
      <AnimatedSphere position={[4, 1, -6]} color="#ec4899" speed={0.35} distort={0.4} />
    </>
  );
}

export function Background3D() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background via-background to-background">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
