"use client"

import { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, MeshDistortMaterial } from "@react-three/drei"
import * as THREE from "three"

interface GlobeProps {
  glowColor: string
  scrollProgress: number
}

function Globe({ glowColor, scrollProgress }: GlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  const color = useMemo(() => new THREE.Color(glowColor), [glowColor])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1 + scrollProgress * 2
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1
    }
    if (lightRef.current) {
      lightRef.current.color = color
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.5
    }
  })

  return (
    <group>
      {/* Main marble sphere */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <MeshDistortMaterial
          color="#E8E6E1"
          roughness={0.3}
          metalness={0.1}
          distort={0.1}
          speed={1.5}
          envMapIntensity={0.5}
        />
      </Sphere>

      {/* Inner glow sphere */}
      <Sphere args={[1.95, 32, 32]}>
        <meshBasicMaterial color={glowColor} transparent opacity={0.15} />
      </Sphere>

      {/* Outer glow */}
      <Sphere args={[2.3, 32, 32]}>
        <meshBasicMaterial color={glowColor} transparent opacity={0.05} side={THREE.BackSide} />
      </Sphere>

      {/* Point light for glow effect */}
      <pointLight ref={lightRef} position={[0, 0, 0]} intensity={2} distance={10} color={glowColor} />

      {/* Ambient lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#F9F8F6" />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#C9A962" />
    </group>
  )
}

interface MarbleGlobeProps {
  glowColor?: string
  scrollProgress?: number
}

export function MarbleGlobe({ glowColor = "#C9A962", scrollProgress = 0 }: MarbleGlobeProps) {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <Globe glowColor={glowColor} scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  )
}
