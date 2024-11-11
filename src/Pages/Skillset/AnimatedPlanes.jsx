import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Separate component for the animated planes
const AnimatedPlanes = () => {
  const [currentPlaneIndex, setCurrentPlaneIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Array of plane configurations (you can customize these)
  const planes = [
    { color: 'greenyellow', position: [-1, 0, 0] },
    { color: 'blue', position: [0, 0, 0] },
    { color: 'red', position: [1, 0, 0] },
    { color: 'purple', position: [0, 1, 0] },
    { color: 'orange', position: [0, -1, 0] }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      
      // Wait a brief moment before changing planes
      setTimeout(() => {
        setCurrentPlaneIndex((prevIndex) => (prevIndex + 1) % planes.length);
        setIsTransitioning(false);
      }, 500);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const currentPlane = planes[currentPlaneIndex];

  return (
    <mesh
      position-y={-1.5}
      scale={10}
      style={{
        transition: 'opacity 0.5s',
        opacity: isTransitioning ? 0 : 1
      }}
    >
      <planeGeometry />
      <meshBasicMaterial color={currentPlane.color} transparent opacity={isTransitioning ? 0 : 1} />
    </mesh>
  );
};