
import { Canvas } from '@react-three/fiber';
import ProjectExperience from './ProjectExperience';
import ExampleExperience from './ExampleExperience';
import ExampleSliders from './ExampleSliders';
import React, { useRef, useState,useEffect } from 'react';
import { Html } from '@react-three/drei';

// const TRANSITION_INTERVAL=10000

export default function Projects() {
    const wrapperRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % 7); // Loop through slides
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + 7) % 7); // Allow backwards looping
    };


    // ANIMATION LOOP
    
    // useEffect(() => {
    //     const interval = setInterval(nextSlide, TRANSITION_INTERVAL);
    //     return () => clearInterval(interval);
    // }, []); 

    

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
                        <ExampleExperience currentIndex={currentIndex} />
                    </group>
                    <Html position={[0,-4.4,0]}>
                        <button onClick={nextSlide}><img src='./next.png'/></button>
                        <button onClick={prevSlide}>Back</button>
                    </Html>
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
                        <ExampleSliders currentSlideIndex={currentIndex} />
                    </group>
                </Canvas>
            </div>
        </div>
    );
}
