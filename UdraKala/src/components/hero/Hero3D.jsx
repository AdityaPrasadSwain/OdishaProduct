import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';

const FloatingShape = () => {
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh>
                <torusKnotGeometry args={[1, 0.3, 100, 16]} />
                <meshStandardMaterial
                    color="#0ea5e9"
                    roughness={0.1}
                    metalness={0.8}
                />
            </mesh>
        </Float>
    );
};

const Hero3D = () => {
    return (
        <div className="w-full h-[500px] md:h-[600px] absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={1} />

                <Suspense fallback={null}>
                    <FloatingShape />
                    <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4.5} />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Hero3D;
