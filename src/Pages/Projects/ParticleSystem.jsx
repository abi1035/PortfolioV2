import { useRef, useEffect, useMemo } from 'react';
import { Text3D } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {vertexShader} from './exampleExperienceShaders/vertex.glsl';
import {fragmentShader} from './exampleExperienceShaders/fragment.glsl';

export const ParticleSystem = ({ text, font }) => {
    const particlesRef = useRef();
    const textRef = useRef();
    const shaderMaterialRef = useRef();
    const particleCount = 5000;

    // Calculate triangles and sample points for a given geometry
    const calculateTextGeometry = (geometry) => {
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

        const totalArea = segments.reduce((sum, segment) => sum + segment.area, 0);
        const targetPositions = new Float32Array(particleCount * 3);

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

            const r1 = Math.random();
            const r2 = Math.random();
            const sqrtR1 = Math.sqrt(r1);

            const a = 1 - sqrtR1;
            const b = sqrtR1 * (1 - r2);
            const c = r2 * sqrtR1;

            const point = new THREE.Vector3()
                .addScaledVector(chosenTriangle.vertices[0], a)
                .addScaledVector(chosenTriangle.vertices[1], b)
                .addScaledVector(chosenTriangle.vertices[2], c);

            targetPositions[i3] = point.x;
            targetPositions[i3 + 1] = point.y;
            targetPositions[i3 + 2] = point.z;
        }

        return targetPositions;
    };

    // Initialize particle system
    useEffect(() => {
        if (!textRef.current?.geometry) return;

        // Generate random start positions
        const startPositions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i += 3) {
            startPositions[i] = (Math.random() - 0.5) * 30;
            startPositions[i + 1] = (Math.random() - 0.5) * 30;
            startPositions[i + 2] = (Math.random() - 0.5) * 30;
        }

        // Calculate target positions for current text
        const targetPositions = calculateTextGeometry(textRef.current.geometry);

        // Create geometry and set attributes
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(startPositions.slice(), 3));
        particleGeometry.setAttribute('aStartPosition', new THREE.BufferAttribute(startPositions, 3));
        particleGeometry.setAttribute('aTargetPosition', new THREE.BufferAttribute(targetPositions, 3));
        particleGeometry.setAttribute('aNextTargetPosition', new THREE.BufferAttribute(targetPositions, 3));

        // Create shader material
        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uTransitionProgress: { value: 0 },
                uAnimationSpeed: { value: 2.0 }
            }
        });

        // Update refs
        particlesRef.current.geometry = particleGeometry;
        particlesRef.current.material = shaderMaterial;
        shaderMaterialRef.current = shaderMaterial;

        return () => {
            particleGeometry.dispose();
            shaderMaterial.dispose();
        };
    }, []);

    // Update target positions when text changes
    useEffect(() => {
        if (!textRef.current?.geometry || !shaderMaterialRef.current) return;

        const newTargetPositions = calculateTextGeometry(textRef.current.geometry);
        
        // Update next target positions
        particlesRef.current.geometry.attributes.aNextTargetPosition.array.set(newTargetPositions);
        particlesRef.current.geometry.attributes.aNextTargetPosition.needsUpdate = true;

        // Reset transition progress
        shaderMaterialRef.current.uniforms.uTransitionProgress.value = 0;
        shaderMaterialRef.current.uniforms.uTime.value = 0;
    }, [text]);

    // Animate particles
    useFrame((state) => {
        if (!shaderMaterialRef.current) return;

        shaderMaterialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        
        // Smoothly transition to next text
        shaderMaterialRef.current.uniforms.uTransitionProgress.value = THREE.MathUtils.lerp(
            shaderMaterialRef.current.uniforms.uTransitionProgress.value,
            1,
            0.02
        );
    });

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
            </points>
        </>
    );
};