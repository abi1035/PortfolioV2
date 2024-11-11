import { Canvas } from '@react-three/fiber';
import ProjectExperience from './ProjectExperience';
import ExampleExperience from './ExampleExperience';
import ExampleSliders from './ExampleSliders';
import React, { useRef } from 'react';

export default function Projects() {
    const wrapperRef = useRef();

    return (
        <div className="h-screen w-full grid grid-cols-2 gap-4 p-8">
            {/* Left Column */}
            <div className="border-2 border-red-700">
                <Canvas
                    className="r3f h-full"
                    camera={{
                        fov: 45,
                        near: 0.1,
                        far: 2000,
                        position: [0.5, 0.5, 20],
                    }}
                >
                    <group>
                        <ProjectExperience wrapperRef={wrapperRef} />
                        <ExampleExperience />
                    </group>
                </Canvas>
            </div>

            {/* Right Column */}
            <div className="border-2 border-blue-700 flex items-center justify-center">
                <Canvas
                    className="r3f h-full"
                    camera={{
                        fov: 45,
                        near: 0.1,
                        far: 2000,
                        position: [0.5, 0.5, 20],
                    }}
                >
                    <group>
                        <ExampleSliders />
                    </group>
                </Canvas>
            </div>
        </div>
    );
}
