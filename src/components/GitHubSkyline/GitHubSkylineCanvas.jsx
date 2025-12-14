import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMediaQuery } from 'react-responsive'
import GitHubSkylineMesh from './GitHubSkylineMesh'

const GitHubSkylineCanvas = ({ data }) => {
    const isMobile = useMediaQuery({ query: '(max-width:768px)' })
    const prefersReducedMotion =
        typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches === true

    return (
        <Canvas
            camera={{ fov: 45 }}
            dpr={[1, isMobile ? 1.2 : 1.5]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: 'transparent', pointerEvents: isMobile ? 'none' : undefined }}
            onCreated={({ gl, camera }) => {
                gl.setClearColor(0, 0)
                camera.position.set(0, 0, 6)
                camera.lookAt(0, 0, 0)
            }}
        >
            <directionalLight position={[0, 10, 22]} intensity={5} />
            <directionalLight position={[-6, 8, -6]} intensity={10} color="#839cb5" />

            <OrbitControls
                enablePan={false}
                maxDistance={26}
                minDistance={4}
                enableDamping
                dampingFactor={0.08}
                autoRotate={!prefersReducedMotion}
                autoRotateSpeed={0.6}
                minPolarAngle={0.25}
                maxPolarAngle={Math.PI - 0.35}
            />

            <group
                scale={isMobile ? 0.95 : 1}
                position={[0, -1.6, 0]}
                rotation={[0, -Math.PI / 4, 0]}
            >
                <GitHubSkylineMesh data={data} />
            </group>
        </Canvas>
    )
}

export default GitHubSkylineCanvas