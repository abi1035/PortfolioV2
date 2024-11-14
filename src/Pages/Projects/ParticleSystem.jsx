import { useMatcapTexture, Center, Text3D, OrbitControls, Float, Html } from '@react-three/drei';
import { useState, useRef, useEffect, Suspense, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const ParticleSystem = ({ text, font }) => {
    const particlesRef = useRef();
    const textRef = useRef();
    const particleCount = 5000;
    const [isInitialized, setIsInitialized] = useState(false);

    // Memoize the Float32Arrays to prevent recreating them on every render
    const randomStartPositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
    const targetPositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);

    // Memoize the initial random positions
    useMemo(() => {
        for (let i = 0; i < particleCount * 3; i += 3) {
            randomStartPositions[i] = (Math.random() - 0.5) * 30;
            randomStartPositions[i + 1] = (Math.random() - 0.5) * 30;
            randomStartPositions[i + 2] = (Math.random() - 0.5) * 30;
        }
    }, [randomStartPositions, particleCount]);

    // Memoize triangle calculations
    const calculateTriangles = useCallback((geometry) => {
        const positions = geometry.attributes.position.array;
        const segments = [];

        for (let i = 0; i < positions.length; i += 9) {
            const triangle = {
                vertices: [
                    new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]),
                    new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]),
                    new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]),
                ]
            };

            const a = triangle.vertices[0].distanceTo(triangle.vertices[1]);
            const b = triangle.vertices[1].distanceTo(triangle.vertices[2]);
            const c = triangle.vertices[2].distanceTo(triangle.vertices[0]);
            const s = (a + b + c) / 2;
            triangle.area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

            segments.push(triangle);
        }

        return {
            segments,
            totalArea: segments.reduce((sum, segment) => sum + segment.area, 0)
        };
    }, []);

    // Memoize point calculation
    const calculatePoint = useCallback((chosenTriangle, r1, r2) => {
        const sqrtR1 = Math.sqrt(r1);
        const a = 1 - sqrtR1;
        const b = sqrtR1 * (1 - r2);
        const c = r2 * sqrtR1;

        return new THREE.Vector3()
            .addScaledVector(chosenTriangle.vertices[0], a)
            .addScaledVector(chosenTriangle.vertices[1], b)
            .addScaledVector(chosenTriangle.vertices[2], c);
    }, []);

    const updateTargetPositions = useCallback(() => {
        if (!textRef.current?.geometry) return;

        const { segments, totalArea } = calculateTriangles(textRef.current.geometry);

        requestAnimationFrame(() => {
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                let areaChoice = Math.random() * totalArea;
                let chosenTriangle;

                for (const triangle of segments) {
                    areaChoice -= triangle.area;
                    if (areaChoice <= 0) {
                        chosenTriangle = triangle;
                        break;
                    }
                }

                const point = calculatePoint(chosenTriangle, Math.random(), Math.random());
                targetPositions[i3] = point.x;
                targetPositions[i3 + 1] = point.y;
                targetPositions[i3 + 2] = point.z;
            }

            if (particlesRef.current) {
                particlesRef.current.geometry.setAttribute(
                    'position',
                    new THREE.BufferAttribute(randomStartPositions, 3)
                );
                setIsInitialized(true);
            }
        });
    }, [calculateTriangles, calculatePoint, particleCount, randomStartPositions, targetPositions]);

    useEffect(() => {
        updateTargetPositions();
        return () => {
            if (textRef.current?.geometry) {
                textRef.current.geometry.dispose();
            }
        };
    }, [text, updateTargetPositions]);

    // Memoize the animation frame callback
    const animateParticles = useCallback(() => {
        if (!isInitialized || !particlesRef.current) return;
        
        const positions = particlesRef.current.geometry.attributes.position.array;
        for (let i = 0; i < particleCount * 3; i++) {
            positions[i] += (targetPositions[i] - positions[i]) * 0.01;
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }, [isInitialized, particleCount, targetPositions]);

    useFrame(animateParticles);

    // Memoize the material properties
    const pointsMaterialProps = useMemo(() => ({
        size: 0.02,
        sizeAttenuation: true,
        color: "white",
        transparent: true,
        opacity: 0.8
    }), []);

    return (
        <>
            <Text3D
                ref={textRef}
                font={font}
                size={1.1}
                height={0.2}
                curveSegments={12}
                bevelEnabled
                bevelThickness={0.02}
                bevelSize={0.02}
                bevelOffset={0}
                bevelSegments={5}
                visible={false}
            >
                {text}
            </Text3D>

            <points ref={particlesRef}>
                <bufferGeometry />
                <pointsMaterial {...pointsMaterialProps} />
            </points>
        </>
    );
};