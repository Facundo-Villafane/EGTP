import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment } from '@react-three/drei'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
import type { Group } from 'three'

const MODEL_PATH = '/models/trophy.glb'

interface TrophyConfig {
  position: [number, number, number]
  scale: number
  rotSpeed: number
  floatSpeed: number
  floatIntensity: number
  phase: number
  escape: [number, number]
  faceForward?: boolean   // oscila en Y en vez de girar completo
}

interface TrophyProps extends TrophyConfig {
  scrollRef: React.MutableRefObject<number>
}

function Trophy({ position, scale, rotSpeed, floatSpeed, floatIntensity, phase, escape, faceForward, scrollRef }: TrophyProps) {
  const { scene } = useGLTF(MODEL_PATH)
  const ref = useRef<Group>(null)
  const cloned = useMemo(() => scene.clone(), [scene])

  useFrame((state, delta) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    const scroll = scrollRef.current

    // flotación manual
    const floatY = Math.sin(t * floatSpeed + phase) * floatIntensity * 0.25

    // destino: posición base + escape escalado por scroll
    const tx = position[0] + escape[0] * scroll * 22
    const ty = position[1] + floatY + escape[1] * scroll * 14

    // lerp suave — más rápido al dispersar
    const speed = delta * (2.5 + scroll * 4)
    ref.current.position.x += (tx - ref.current.position.x) * speed
    ref.current.position.y += (ty - ref.current.position.y) * speed

    // giro en Y — libre o de frente según config
    if (faceForward) {
      ref.current.rotation.y = Math.sin(t * 0.5 + phase) * 0.22
    } else {
      ref.current.rotation.y += delta * (rotSpeed + scroll * 6)
    }

    // inclinación en Z — máximo ±30° al dispersar, lerp suave
    const maxTilt = Math.PI / 6
    const targetZ = escape[0] * scroll * maxTilt
    ref.current.rotation.z += (targetZ - ref.current.rotation.z) * delta * 3

    // leve oscilación en X — máximo ±10°, nunca boca abajo
    ref.current.rotation.x = Math.sin(t * floatSpeed * 0.4 + phase) * 0.12
  })

  return (
    <group ref={ref} position={position}>
      <primitive object={cloned} scale={scale} />
    </group>
  )
}

// Dirección de escape: básicamente apunta desde el centro hacia afuera
// con algo de variación para que no sea uniforme
function esc(x: number, y: number, bx = 0, by = 0): [number, number] {
  const mag = Math.max(Math.sqrt(x * x + y * y), 0.8)
  return [(x / mag) + bx, (y / mag) + by]
}

const BG_TROPHIES: TrophyConfig[] = [
  { position: [-5.5,  1.8, -2], scale: 0.65, rotSpeed:  0.30, floatSpeed: 1.2, floatIntensity: 0.8, phase: 0.0, escape: esc(-5.5,  1.8, -0.3,  0.2) },
  { position: [ 5.0,  0.5, -2], scale: 0.55, rotSpeed: -0.35, floatSpeed: 1.5, floatIntensity: 0.6, phase: 2.1, escape: esc( 5.0,  0.5,  0.4, -0.1) },
  { position: [-2.5, -1.8, -3], scale: 0.50, rotSpeed:  0.45, floatSpeed: 1.3, floatIntensity: 0.7, phase: 1.0, escape: esc(-2.5, -1.8,  0.0, -0.4) },
  { position: [ 3.5,  2.2, -4], scale: 0.45, rotSpeed: -0.28, floatSpeed: 1.7, floatIntensity: 0.9, phase: 3.5, escape: esc( 3.5,  2.2,  0.2,  0.3) },
  { position: [ 0.5, -2.5, -3], scale: 0.40, rotSpeed:  0.38, floatSpeed: 1.1, floatIntensity: 0.7, phase: 5.0, escape: esc( 0.5, -2.5, -0.5, -0.3) },
  { position: [-4.0,  0.2, -4], scale: 0.38, rotSpeed: -0.22, floatSpeed: 1.4, floatIntensity: 0.6, phase: 4.2, escape: esc(-4.0,  0.2, -0.4,  0.1) },
  { position: [ 4.5,  2.8, -5], scale: 0.32, rotSpeed:  0.50, floatSpeed: 0.9, floatIntensity: 0.5, phase: 1.7, escape: esc( 4.5,  2.8,  0.3,  0.4) },
  { position: [-6.0, -0.5, -5], scale: 0.28, rotSpeed: -0.40, floatSpeed: 1.0, floatIntensity: 0.4, phase: 0.8, escape: esc(-6.0, -0.5, -0.3, -0.2) },
  { position: [ 6.5, -1.5, -4], scale: 0.35, rotSpeed:  0.35, floatSpeed: 1.1, floatIntensity: 0.7, phase: 3.3, escape: esc( 6.5, -1.5,  0.4, -0.3) },
  { position: [-1.0, -3.0, -5], scale: 0.25, rotSpeed: -0.45, floatSpeed: 0.9, floatIntensity: 0.5, phase: 1.2, escape: esc(-1.0, -3.0, -0.2, -0.5) },
]

const FG_TROPHIES: TrophyConfig[] = [
  { position: [-5.0,  1.5, 0], scale: 1.30, rotSpeed:  0.25, floatSpeed: 1.2, floatIntensity: 0.7, phase: 0.0, escape: esc(-5.0,  1.5, -0.5,  0.2) },
  { position: [ 5.2, -0.5, 0], scale: 1.10, rotSpeed: -0.30, floatSpeed: 1.4, floatIntensity: 0.6, phase: 2.1, escape: esc( 5.2, -0.5,  0.5, -0.2) },
  { position: [ 0.0,  2.2, 0], scale: 0.85, rotSpeed:  0.20, floatSpeed: 1.0, floatIntensity: 0.6, phase: 4.0, escape: esc( 0.0,  3.0,  0.1,  0.6), faceForward: true },
]

interface TrophySceneProps {
  scrollRef: React.MutableRefObject<number>
  className?: string
}

function SceneContent({ scrollRef, trophies }: { scrollRef: React.MutableRefObject<number>; trophies: TrophyConfig[] }) {
  return (
    <Suspense fallback={null}>
      {trophies.map((t, i) => <Trophy key={i} {...t} scrollRef={scrollRef} />)}
      <Environment preset="city" />
    </Suspense>
  )
}

export function TrophyScene({ scrollRef, className = '' }: TrophySceneProps) {
  return (
    <div className={className} style={{ pointerEvents: 'none', position: 'relative' }}>
      {/* Fondo — más pequeños, con depth of field */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 65, near: 0.5, far: 100 }}
        style={{ background: 'transparent', position: 'absolute', inset: 0 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 8, 5]}  intensity={0.8} color="#ffffff" />
        <pointLight       position={[0, 0, 4]}   intensity={0.6} color="#00eefc" />
        <pointLight       position={[-5, 5, -2]} intensity={0.4} color="#bd00ff" />
        <SceneContent scrollRef={scrollRef} trophies={BG_TROPHIES} />
        <EffectComposer>
          <DepthOfField focusDistance={0.065} focalLength={0.12} bokehScale={2.5} height={480} />
        </EffectComposer>
      </Canvas>

      {/* Primer plano — grandes, nítidos */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 65 }}
        style={{ background: 'transparent', position: 'absolute', inset: 0 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 5]}  intensity={1.0} color="#ffffff" />
        <pointLight       position={[0, 0, 5]}   intensity={0.8} color="#00eefc" />
        <pointLight       position={[-5, 5, 0]}  intensity={0.5} color="#bd00ff" />
        <pointLight       position={[5, -3, 0]}  intensity={0.3} color="#e7006e" />
        <SceneContent scrollRef={scrollRef} trophies={FG_TROPHIES} />
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL_PATH)
