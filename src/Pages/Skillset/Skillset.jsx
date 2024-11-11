import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, } from "@react-three/drei";
import gsap from "gsap";

// Component for animated planes
const AnimatedPlanes = () => {
  const [currentPlaneIndex, setCurrentPlaneIndex] = useState(0);
  const [nextPlaneIndex, setNextPlaneIndex] = useState(1);
  const planesRef = useRef([]);

  // Array of plane configurations
  const planes = [
    { url: 'https://bruno-simon.com/html/' },
    { url: 'https://bruno-simon.com/html/' },
    { url: 'https://bruno-simon.com/html/' },
    { url: 'https://bruno-simon.com/html/' },
    { url: 'https://bruno-simon.com/html/' }

  ];

  const resetPlane = (plane, position) => {
    if (plane) {
      gsap.set(plane.position, { x: position }); // Reset position
      gsap.set(plane.material, { opacity: 1 }); // Reset opacity
    }
  };

  const animatePlaneTransition = () => {
    const currentPlane = planesRef.current[currentPlaneIndex];
    const nextPlane = planesRef.current[nextPlaneIndex];
    
    // Reset next plane to start from left
    resetPlane(nextPlane, -10);
    
    // Make next plane visible
    nextPlane.visible = true;

    // Slide the current plane out to the right and fade out
    gsap.to(currentPlane.position, {
      x: 10,
      duration: 0.8,
      ease: "power2.inOut"
    });

    gsap.to(currentPlane.material, {
      opacity: 0,
      duration: 0.8
    });

    // Slide the next plane in from the left
    gsap.to(nextPlane.position, {
      x: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        currentPlane.visible = false;
        // Update indices
        setCurrentPlaneIndex(nextPlaneIndex);
        setNextPlaneIndex((nextPlaneIndex + 1) % planes.length);
      }
    });
  };

  useEffect(() => {
    const timer = setInterval(animatePlaneTransition, 4000);
    return () => clearInterval(timer);
  }, [currentPlaneIndex, nextPlaneIndex]);

  return (
    <>
      {planes.map((plane, index) => (
        <mesh
          key={index}
          ref={(el) => (planesRef.current[index] = el)}
          position={[index === currentPlaneIndex ? 0 : -10, -1.5, 0]}
          scale={10}
          visible={index === currentPlaneIndex || index === nextPlaneIndex}
        >
          <planeGeometry />
          <meshBasicMaterial color={plane.color} transparent opacity={1} />
        </mesh>
      ))}
    </>
  );
};

export default function Skillset() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Skillset</h1>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [3, 2, 6]
        }}
      >
        <AnimatedPlanes />
        <OrbitControls />
      </Canvas>
    </div>
  );
}