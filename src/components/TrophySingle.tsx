import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import type { Group } from 'three'

const MODEL_PATH = '/models/trophy.glb'

function Trophy() {
  const { scene } = useGLTF(MODEL_PATH)
  const ref = useRef<Group>(null)
  const cloned = useMemo(() => scene.clone(), [scene])

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime

    // Siempre de frente: oscilación suave en Y (±12°), nunca gira completo
    ref.current.rotation.y = Math.sin(t * 0.5) * 0.21

    // Leve inclinación lateral
    ref.current.rotation.z = Math.sin(t * 0.35 + 1) * 0.06

    // Leve inclinación frontal
    ref.current.rotation.x = Math.sin(t * 0.4 + 2) * 0.05

    // Flotación vertical
    ref.current.position.y = Math.sin(t * 0.8) * 0.08
  })

  return <primitive ref={ref} object={cloned} scale={1.6} position={[0, 0, 0]} />
}

export function TrophySingle({ className = '' }: { className?: string }) {
  return (
    <div className={className} style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 6, 4]}   intensity={1.2} color="#ffffff" />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} color="#bd00ff" />
        <pointLight       position={[0, 3, 3]}   intensity={0.8} color="#00eefc" />
        <pointLight       position={[2, -2, 2]}  intensity={0.4} color="#e7006e" />

        <Suspense fallback={null}>
          <Trophy />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_PATH)
