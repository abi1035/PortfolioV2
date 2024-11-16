import './style.css'
import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import Introduction from './Introduction.jsx'

import Navbar from './Components/Navbar/Navbar.jsx'
import 'animate.css';

export default function Homepage() {
    const wrapperRef = useRef();

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-gradient-to-b from-[#130c27] via-[#0a0616] to-black">
                {/* Canvas Section */}
                <div 
                    ref={wrapperRef} 
                    className="
                        relative 
                        flex items-center justify-center 
                        order-1 md:order-2 
                        h-[100vh] sm:h-[100vh] md:h-[100] lg:h-[90%] xl:h-full
                        w-full md:w-[90%] lg:w-full
                        overflow-hidden
                        md:self-center md:justify-self-center
                        transform md:translate-y-8 lg:translate-y-0
                        max-h-[500px] lg:max-h-none xl:max-h-screen
                        lg:absolute lg:right-0 xl:w-[60%]
                    "
                >
                    <div className="absolute inset-0 w-full h-full">
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
                </div>

                {/* Introduction Section */}
                <div className="
                    flex items-center justify-start 
                    p-6 sm:p-8 md:p-8 lg:p-24 xl:p-32 
                    order-2 md:order-1 
                    min-h-[40vh] md:min-h-screen
                    animate__animated animate__backInUp
                    md:self-start md:mt-16
                    [&>*]:w-full
                ">
                    <Introduction />
                </div>
            </div>
        </>
    )
}