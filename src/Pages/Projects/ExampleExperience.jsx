import { useMatcapTexture, Center, Text3D, OrbitControls, Float } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ExampleExperience = () => {
  const [matcapTexture] = useMatcapTexture('7B5254_E9DCC7_B19986_C8AC91', 256);
  const textRef = useRef();
  const particlesRef = useRef();
  const particleCount = 5000;
  const randomStartPositions = useRef(new Float32Array(particleCount * 3));
  const targetPositions = useRef(new Float32Array(particleCount * 3));
  const [textArrayIndex, setTextArrayIndex] = useState(0);
  const textArray = ['Terrain Maps', 'Custom Webpages','Custom APIs', 'Animation', 'Custom Shaders'];
  const textExplanation=['Terrain Maps Lorem', 'Custom Webpages Ipsum', 'Animation Lorem', 'Custom Shaders Ipsum']

  // Function to update particle target positions to form the current text
  const updateTargetPositions = () => {
    if (textRef.current) {
      // Dispose of the previous geometry to prevent memory leaks
      if (textRef.current.geometry) {
        textRef.current.geometry.dispose();
      }

      // Generate new geometry based on the current text
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
  };

  useEffect(() => {
    updateTargetPositions();

    // Cleanup function to dispose of previous geometries
    return () => {
      if (textRef.current && textRef.current.geometry) {
        textRef.current.geometry.dispose();
      }
    };
  }, [textArrayIndex]);

  // Animate particles from random positions to target positions
  useFrame(() => {
    const positions = particlesRef.current.geometry.attributes.position.array;
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] += (targetPositions.current[i] - positions[i]) * 0.01;
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  //--------------------- Handles next text automatically----------------------------------------
  useEffect(() => {
    
    const interval = setInterval(() => {
      setTextArrayIndex((prevIndex) => (prevIndex + 1) % textArray.length);
    }, 8000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(interval);
  }, []); 

  return (
    <>
    
      <group position={[-6.5,-3.5,0]}>
        <Text3D
          ref={textRef}
          font="./fonts/helvetiker_regular.typeface.json"
          size={1.1}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
          visible={false} // Hide the actual text geometry
        >
          {textArray[textArrayIndex]} {/* Display the text based on the current index */}
          <meshMatcapMaterial matcap={matcapTexture} />
        </Text3D>

        <points ref={particlesRef}>
          <bufferGeometry />
          <pointsMaterial
            size={0.02}
            sizeAttenuation={true}
            color="white"
            transparent={true}
            opacity={0.8}
          />
        </points>
      </group>
      
    

      
      
      

      <OrbitControls enableZoom={false} />
    </>
  );
};

export default ExampleExperience;
