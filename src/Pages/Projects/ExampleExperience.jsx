import { useMatcapTexture, Text3D, Html, OrbitControls } from '@react-three/drei';
import { useRef,Suspense } from 'react';
import { ParticleSystem } from './ParticleSystem';
import './projectStyles.css'

const ExampleExperience = ({ currentIndex }) => {
    const textArray = ['3D Websites', 'Frontend','Fullstack', 'Custom Shaders', 'Terrain Generation','Physics-renders','Games'];
    const textExplanation = [
      'I can build engaging 3D websites and application with WebGL and Three.js, with realistic environments and models and make it interactive. I also optimize scenes for smooth performance across devices and platforms, ensuring responsive and a high-quality rendering.',
      'I build visually appealing UI and web applications, creating seamless user experiences and fun animations, with a focus on responsive design and optimal performance on all devices.',
      'I can develop full-stack applications with a responsive, user-friendly frontend and a robust backend that seamlessly integrates with a fully connected database. My work ensures smooth communication between all components, delivering an efficient and cohesive user experience across devices.',
      "I can also develop custom shaders using GLSL to make mesmirising geometries like a Raging sea or other custom geometries, to suit the client's need",
      'I can develop procedurally generated terrains for immersive world-building, leveraging GLSL to create dynamic, realistic landscapes. Write algorithms for terrain variation, texturing, and optimizing real-time rendering, providing detailed, scalable environments suitable for games, simulations, and interactive 3D applications.',
      'I can render complex geometries with integrated physics, making it fluid and realistic that respond dynamically to user interactions and environmental factors.',
      'I create interactive 3D games that run smoothly in the browser using React Three Fiber. My focus is on building engaging, responsive gameplay with optimized performance, making the most of WebGL and R3F to deliver immersive experiences that feel fluid and responsive across different devices.'
    ];

    const techStack=[
      ['WebGL','Three.js','R3F','GLSL','Drei'],
      ['HTML','CSS','Javascript','React','Next.js'],
      ['Node.js','Express','API','Jest','GraphQL','OAuth'],
      ['WebGL','Three.js','R3F','GLSL','Drei'],
      ['WebGL','Three.js','R3F','GLSL','Drei','Rapier'],
      ['WebGL','Three.js','R3F','GLSL','Drei','Rapier'],
      ['WebGL','Three.js','R3F','GLSL','Drei','Rapier'],
    ]

    
   

    const LoadingText = () => (
      <Text3D
        font="./fonts/helvetiker_regular.typeface.json"
        size={0.5}
        position={[-2, 0, 0]}
      >
        Loading...
        <meshNormalMaterial />
      </Text3D>
    );

    return (
        <>
            <group position={[-6.5, 2.5, 0]}>
        <Suspense fallback={<LoadingText />}>
          <ParticleSystem 
            text={textArray[currentIndex]}
            font="./fonts/helvetiker_regular.typeface.json"
          />
        </Suspense>
      </group>

      <Html>
        
        <div key={currentIndex} className='textExplanationDiv tracking-in-expand'>
          <h4 className="text-xl">{textExplanation[currentIndex]}</h4>          
        </div>

        <div className='techStackTextDiv'>
        <h4 className='text-xl'>Tech Stack:</h4>
        </div>
        <div className="textExplanationDiv flex space-x-2 mt-4">
            {techStack[currentIndex]?.map((button, subIndex)=>(
              <span key={subIndex}><button className='techButton'>{button}</button></span>
            ))}
          </div>
      </Html>

      <OrbitControls enableZoom={false} />
        </>
    );
};

export default ExampleExperience;
