import React, { useRef, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls, useTexture, Float } from "@react-three/drei";
import * as THREE from "three";
import { vertexShader } from "./shaders/vertex.glsl";
import { fragmentShader } from "./shaders/fragment.glsl";

export default function Experience({ count = 128, wrapperRef }) {
  const pointsRef = useRef();
  const mousePos = useRef(new THREE.Vector3());

  const texture = useTexture("/picture-1.png");
  const { size, viewport, camera } = useThree();
  const width = 10; // Plane width
  const height = 10; // Plane height

  // Calculate positions and UVs for each point
  const positions = useMemo(() => {
    const positions = [];
    const uvs = [];
    const stepX = width / count;
    const stepY = height / count;

    for (let xi = 0; xi < count; xi++) {
      for (let yi = 0; yi < count; yi++) {
        const x = stepX * (xi - count / 2);
        const y = stepY * (yi - count / 2);
        const z = 0;

        positions.push(x, y, z);

        const u = xi / (count - 1);
        const v = yi / (count - 1);
        uvs.push(u, v);
      }
    }

    return { positions: new Float32Array(positions), uvs: new Float32Array(uvs) };
  }, [count, width, height]);

  // Create ShaderMaterial with the texture uniform
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uResolution: { value: new THREE.Vector2(size.width * viewport.dpr, size.height * viewport.dpr) },
        uPictureTexture: { value: texture },
        uMousePosition: { value: new THREE.Vector2(0, 0) },
        uHover: { value: 0 },
        uRadius: { value: 2.5 },
        uStrength: { value: 5.0 },
      },
      transparent: true,
    });
  }, [size.width, size.height, viewport.dpr, texture]);

  // --------------Handles mouse movement------------------
  const handlePointerMove = (event) => {
    if (!pointsRef.current || pointsRef.current.material.uniforms.uHover.value === 0) return;

    // Use wrapperRef to get the bounding rectangle of the wrapper div
    const rect = wrapperRef.current.getBoundingClientRect();

    // Calculate mouse position relative to the wrapper element
    const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const mouse = new THREE.Vector3(mouseX, mouseY, 0);

    // Convert from normalized device coordinates to world space
    mouse.unproject(camera);

    // Calculate the plane depth and set mouse position in world coordinates
    const dir = mouse.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const worldPos = camera.position.clone().add(dir.multiplyScalar(distance));

    // Update the shader's mouse position uniform directly
    pointsRef.current.material.uniforms.uMousePosition.value.set(worldPos.x, worldPos.y);
    pointsRef.current.material.uniforms.uMousePosition.needsUpdate = true;
  };

  const handlePointerOver = () => {
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uHover.value = 1;
    }
  };

  const handlePointerOut = () => {
    if (pointsRef.current) {
      pointsRef.current.material.uniforms.uHover.value = 0;
    }
  };

  return (
    <>
      <OrbitControls makeDefault />

      <Float rotationIntensity={2.5}>
      <points
        ref={pointsRef}
        material={shaderMaterial}
        onPointerMove={handlePointerMove}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={positions.positions}
            count={positions.positions.length / 3}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-uv"
            array={positions.uvs}
            count={positions.uvs.length / 2}
            itemSize={2}
          />
        </bufferGeometry>
      </points>
      </Float>
    </>
  );
}
