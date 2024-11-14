import { useMatcapTexture, Center, Text3D, OrbitControls } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';


const ProjectExperience = () => {
  
  const textRef = useRef();
  const particlesRef = useRef();
  const particleCount = 5000;
  const randomStartPositions = useRef(new Float32Array(particleCount * 3));
  const targetPositions = useRef(new Float32Array(particleCount * 3));


  useEffect(() => {
    if (textRef.current) {
      const geometry = textRef.current.geometry;
      const positions = geometry.attributes.position.array;

      // Fill targetPositions with points on the text shape using weighted sampling
      const segments = [];
      for (let i = 0; i < positions.length; i += 9) {
        const triangle = {
          vertices: [
            new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]),
            new THREE.Vector3(positions[i + 3], positions[i + 4], positions[i + 5]),
            new THREE.Vector3(positions[i + 6], positions[i + 7], positions[i + 8]),
          ],
          area: 0,
        };

        const a = triangle.vertices[0].distanceTo(triangle.vertices[1]);
        const b = triangle.vertices[1].distanceTo(triangle.vertices[2]);
        const c = triangle.vertices[2].distanceTo(triangle.vertices[0]);
        const s = (a + b + c) / 2;
        triangle.area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

        segments.push(triangle);
      }

      const totalArea = segments.reduce((sum, segment) => sum + segment.area, 0);

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

        targetPositions.current[i3] = point.x;
        targetPositions.current[i3 + 1] = point.y;
        targetPositions.current[i3 + 2] = point.z;

        // Set random start positions
        randomStartPositions.current[i3] = (Math.random() - 0.5) * 30;
        randomStartPositions.current[i3 + 1] = (Math.random() - 0.5) * 30;
        randomStartPositions.current[i3 + 2] = (Math.random() - 0.5) * 30;
      }

      if (particlesRef.current) {
        particlesRef.current.geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(randomStartPositions.current, 3)
        );
      }
    }
  }, [textRef.current]);

  // Animate particles from random positions to target positions
  useFrame((state, delta) => {
    const positions = particlesRef.current.geometry.attributes.position.array;
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] += (targetPositions.current[i] - positions[i]) * 0.09; // adjust 0.05 to control animation speed
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <group position={[-6.3, 5.5, 0]}>
        <Text3D
          ref={textRef}
          font="./fonts/helvetiker_regular.typeface.json"
          size={1.5}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          visible={false}
        >
          Projects
        </Text3D>

        <points ref={particlesRef}>
          <bufferGeometry />
          <pointsMaterial
            size={0.02}
            sizeAttenuation={true}
            color="white"
            transparent={true}
            opacity={1.8}
          />
        </points>
      </group>
      <OrbitControls enableZoom={false} />
    </>
  );
};

export default ProjectExperience;
