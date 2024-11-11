import React, { useRef, useState, useEffect } from "react";
import { Float, Html } from "@react-three/drei";
import gsap from "gsap";

const ExampleSliders = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const iframeRefs = useRef([]);

  const slides = [
    { url: 'https://bruno-simon.com/html/' },
    { url: 'https://bruno-simon.com/html/' },
    { url: 'https://bruno-simon.com/html/' },
    { url: 'https://bruno-simon.com/html/' },
    { url: 'https://bruno-simon.com/html/' }
  ];

  const animateTransition = () => {
    const currentIframe = iframeRefs.current[currentIndex];
    const nextIframe = iframeRefs.current[nextIndex];
    
    if (!currentIframe || !nextIframe || isTransitioning) return;

    setIsTransitioning(true);

    // Reset next iframe position
    gsap.set(nextIframe, {
      x: -25,
      opacity: 0,
      display: 'block'
    });

    // Animate current iframe out
    gsap.to(currentIframe, {
      x: 30,
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(currentIframe, { display: 'none' });
      }
    });

    // Animate next iframe in
    gsap.to(nextIframe, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        setIsTransitioning(false);
        setCurrentIndex(nextIndex);
        setNextIndex((nextIndex + 1) % slides.length);
      }
    });
  };

  useEffect(() => {
    const timer = setInterval(animateTransition, 4000);
    return () => clearInterval(timer);
  }, [currentIndex, nextIndex]);

  return (
    <>
      {slides.map((slide, index) => (
        <Float>
        <Html
          key={index}
          ref={(el) => (iframeRefs.current[index] = el)}
          position={[0, 0, index * 0.001]}
          transform
          style={{
            display: index === currentIndex || index === nextIndex ? 'block' : 'none',
            opacity: index === currentIndex ? 1 : 0,
            transform: `translateX(${index === currentIndex ? '0' : '-25px'})`,
            overflow: 'hidden' 
          }}
        >
          <iframe
            src={slide.url}
            scrolling="no"
            style={{
              width: "463px",
              height: "540px",
              border: "none",
              pointerEvents: "auto",
              backgroundColor: 'transparent',
              overflow: 'hidden'
            }}
          />
        </Html>
        </Float>
      ))}
    </>
  );
};

export default ExampleSliders;