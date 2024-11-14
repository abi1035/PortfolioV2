import { useRef, useEffect } from 'react';
import { extend, useFrame } from '@react-three/fiber';
import { Text3D, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import {vertexShader} from './projectExperienceShaders/vertex.glsl';
import {fragmentShader} from './projectExperienceShaders/fragment.glsl';

const ProjectExperience = () => {
  const textRef = useRef();
  const shaderMaterialRef = useRef();
  const particlesRef = useRef();
  const particleCount = 5000;

  useEffect(() => {
    if (textRef.current) {
      const geometry = textRef.current.geometry;
      const positions = geometry.attributes.position.array;
      
      // Create arrays for start and target positions
      const startPositions = new Float32Array(particleCount * 3);
      const targetPositions = new Float32Array(particleCount * 3);
      
      // Calculate target positions (similar to your original code)
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

      // Fill start and target positions
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Random start positions
        startPositions[i3] = (Math.random() - 0.5) * 30;
        startPositions[i3 + 1] = (Math.random() - 0.5) * 30;
        startPositions[i3 + 2] = (Math.random() - 0.5) * 30;

        // Calculate target positions
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

      // Create geometry and set attributes
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(startPositions, 3));
      particleGeometry.setAttribute('aStartPosition', new THREE.BufferAttribute(startPositions, 3));
      particleGeometry.setAttribute('aTargetPosition', new THREE.BufferAttribute(targetPositions, 3));

      // Create shader material
      const shaderMaterial = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uTransitionSpeed: { value: 2.0 }
        }
      });

      // Update refs
      particlesRef.current.geometry = particleGeometry;
      particlesRef.current.material = shaderMaterial;
      shaderMaterialRef.current = shaderMaterial;
    }
  }, [textRef.current]);

  // Update time uniform
  useFrame((state) => {
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
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
        </points>
      </group>
      <OrbitControls enableZoom={false} />
    </>
  );
};

export default ProjectExperience;