import React, { useRef,useEffect } from "react";
import { Float, Html } from "@react-three/drei";
import gsap from "gsap";

const ExampleSliders = ({ currentSlideIndex }) => {
    const iframeRefs = useRef([]);

    useEffect(() => {
        const currentIframe = iframeRefs.current[currentSlideIndex];
        gsap.fromTo(
            currentIframe,
            { x: -25, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" }
        );

        iframeRefs.current.forEach((iframe, index) => {
            iframe.style.display = index === currentSlideIndex ? 'block' : 'none';
        });
    }, [currentSlideIndex]);

    const slides = [
        { url: 'https://bruno-simon.com/html/' },
        { url: 'https://bruno-simon.com/html/' },
        { url: 'https://bruno-simon.com/html/' },
        { url: 'https://bruno-simon.com/html/' },
        { url: 'https://bruno-simon.com/html/' },
        { url: 'https://bruno-simon.com/html/' },
        { url: 'https://bruno-simon.com/html/' }
    ];

    return (
        <>
            {slides.map((slide, index) => (
              <Float rotationIntensity={1.1}>
                <Html
                    key={index}
                    ref={(el) => (iframeRefs.current[index] = el)}
                    position={[-1.1, 0, index * 0.001]}
                    transform
                    style={{
                        display: index === currentSlideIndex ? 'block' : 'none',
                        overflow: 'hidden'
                    }}
                >
                    <iframe
                        src={slide.url}
                        scrolling="no"
                        style={{
                            width: "430px",
                            height: "530px",
                            border: "none",
                            pointerEvents: "auto"
                        }}
                    />
                </Html>
                </Float>
                
            ))}
        </>
    );
};

export default ExampleSliders;
