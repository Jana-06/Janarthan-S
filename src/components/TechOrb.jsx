import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Float, Environment } from '@react-three/drei'

// Tech stack items shown as floating 3D cards
const TECH_ITEMS = [
  { label: 'React', color: '#61dafb', pos: [0, 0.6, 0] },
  { label: 'Python', color: '#3b82f6', pos: [-1.4, -0.2, 0.5] },
  { label: 'Flutter', color: '#54c5f8', pos: [1.5, 0.2, -0.3] },
  { label: 'TypeScript', color: '#3178c6', pos: [-0.6, -1.2, 0.2] },
  { label: 'Node.js', color: '#68a063', pos: [0.8, -0.8, 0.6] },
  { label: 'FastAPI', color: '#009688', pos: [-1.6, 0.8, -0.2] },
  { label: 'Docker', color: '#2496ed', pos: [1.2, 1.1, 0.4] },
  { label: 'AI/ML', color: '#a855f7', pos: [0, -0.2, -0.8] },
]

function TechCard({ label, color, position, index }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = Math.sin(t * 0.3 + index * 0.8) * 0.15
    meshRef.current.rotation.x = Math.cos(t * 0.2 + index * 0.6) * 0.08
    meshRef.current.position.y = position[1] + Math.sin(t * 0.4 + index) * 0.06
  })

  return (
    <Float
      speed={1.2 + index * 0.15}
      rotationIntensity={0.08}
      floatIntensity={0.3 + index * 0.05}
    >
      <group ref={meshRef} position={position}>
        {/* Card backing */}
        <mesh
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <roundedBoxGeometry args={[1.1, 0.44, 0.06, 4, 0.08]} />
          <meshStandardMaterial
            color={hovered ? color : '#1a1a2e'}
            metalness={0.6}
            roughness={0.2}
            transparent
            opacity={hovered ? 0.95 : 0.75}
            envMapIntensity={1.2}
          />
        </mesh>

        {/* Glowing edge when hovered */}
        {hovered && (
          <mesh>
            <roundedBoxGeometry args={[1.14, 0.48, 0.04, 4, 0.08]} />
            <meshBasicMaterial color={color} transparent opacity={0.3} />
          </mesh>
        )}

        {/* Label text */}
        <Text
          position={[0, 0, 0.05]}
          fontSize={0.16}
          color={hovered ? '#000' : color}
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
          maxWidth={1}
        >
          {label}
        </Text>

        {/* Colored dot */}
        <mesh position={[-0.38, 0, 0.06]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </Float>
  )
}

function Scene({ scrollY }) {
  const groupRef = useRef()

  useFrame((state) => {
    if (!groupRef.current) return
    const t = state.clock.getElapsedTime()
    // Slow auto-rotate
    groupRef.current.rotation.y = t * 0.08 + scrollY * 0.002
    groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.06
    // Mouse parallax via camera
    const { pointer } = state
    state.camera.position.x += (pointer.x * 0.4 - state.camera.position.x) * 0.04
    state.camera.position.y += (pointer.y * 0.2 - state.camera.position.y) * 0.04
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[4, 4, 4]} intensity={1.5} color="#0071e3" />
      <pointLight position={[-4, -2, 2]} intensity={1} color="#7c3aed" />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#ffffff" />
      <Environment preset="night" />

      <group ref={groupRef}>
        {TECH_ITEMS.map((item, i) => (
          <TechCard
            key={item.label}
            label={item.label}
            color={item.color}
            position={item.pos}
            index={i}
          />
        ))}
      </group>
    </>
  )
}

function FallbackOrb() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 animate-pulse blur-xl" />
    </div>
  )
}

/**
 * Lazy-loaded React Three Fiber scene showing floating tech stack cards.
 * Accepts `scrollY` prop to drive rotation on scroll.
 */
export default function TechOrb({ scrollY = 0 }) {
  const [prefersReduced, setPrefersReduced] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  if (prefersReduced) return <FallbackOrb />

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene scrollY={scrollY} />
        </Suspense>
      </Canvas>
    </div>
  )
}
