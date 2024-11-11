import './style.css'
import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import Introduction from './Introduction.jsx'
import Navbar from './Components/Navbar/Navbar.jsx'


export default function Homepage(){

    const wrapperRef = useRef(); // Ref for the Canvas wrapper div

    return (

        <>
            <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
                {/* Canvas Section - On top for mobile */}
                <div ref={wrapperRef} className="flex items-center justify-center order-1 md:order-2 h-[50vh] md:h-full">
                    <Canvas
                        className="r3f"
                        camera={{
                            fov: 45,
                            near: 0.1,
                            far: 2000,
                            position: [0.5, 0.5, 20],
                        }}
                    >
                        <Experience wrapperRef={wrapperRef} />
                    </Canvas>
                </div>
                <div className="flex items-center justify-start p-8 md:p-16 lg:p-60 order-2 md:order-1">
                    <Introduction />
                </div>
            </div>
            

        </>
    )
}