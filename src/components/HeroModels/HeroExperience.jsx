import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useMediaQuery } from 'react-responsive';
import { Space } from './Space';

const HeroExperience = () => {
    const isTablet = useMediaQuery({ query: '(max-width:1024px)' });
    const isMobile = useMediaQuery({ query: '(max-width:768px)' });

    return (
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
            <ambientLight intensity={0.2} color={"#1a1a40"} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            {!isTablet && (
                <OrbitControls
                    enablePan={false}
                    enableZoom={!isTablet}
                    maxDistance={100}
                    minDistance={0}
                    minPolarAngle={0}
                    maxPolarAngle={Math.PI - 0.05}
                />
            )}
            <group
                scale={isMobile ? 0.7 : 1}
                position={[0, 0, 0]}
                rotation={[0, -Math.PI / 4, 0]}
            >

                <Space />

            </group>

        </Canvas>
    )
}

export default HeroExperience