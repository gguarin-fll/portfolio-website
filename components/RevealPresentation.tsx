'use client';

import { useEffect, useRef } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { useState } from 'react';

interface RevealPresentationProps {
  slidesPath: string;
  title: string;
  onClose?: () => void;
}

export default function RevealPresentation({ slidesPath, title, onClose }: RevealPresentationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    let revealInstance: any = null; // eslint-disable-line @typescript-eslint/no-explicit-any

    // Add Reveal.js CSS
    const link1 = document.createElement('link');
    link1.rel = 'stylesheet';
    link1.href = 'https://cdn.jsdelivr.net/npm/reveal.js/dist/reveal.css';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'stylesheet';
    link2.href = 'https://cdn.jsdelivr.net/npm/reveal.js/dist/theme/black.css';
    document.head.appendChild(link2);

    const loadReveal = async () => {
      const Reveal = (await import('reveal.js')).default;
      
      if (containerRef.current) {
        // Validate slidesPath to prevent XSS
        const safeSlidesPath = slidesPath.replace(/['"<>]/g, '');
        
        // Create reveal container
        const revealDiv = document.createElement('div');
        revealDiv.className = 'reveal';
        
        // Use DOM methods instead of innerHTML for security
        const slidesDiv = document.createElement('div');
        slidesDiv.className = 'slides';
        
        const section = document.createElement('section');
        section.setAttribute('data-markdown', safeSlidesPath);
        section.setAttribute('data-separator', '^---$');
        section.setAttribute('data-separator-vertical', '^--$');
        
        slidesDiv.appendChild(section);
        revealDiv.appendChild(slidesDiv);
        containerRef.current.appendChild(revealDiv);

        // Initialize Reveal.js
        revealInstance = new Reveal(revealDiv, {
          hash: true,
          controls: true,
          progress: true,
          center: true,
          transition: 'slide',
          plugins: []
        });

        await revealInstance.initialize();
      }
    };

    loadReveal();

    return () => {
      if (revealInstance) {
        revealInstance.destroy();
      }
      // Clean up CSS links
      document.head.removeChild(link1);
      document.head.removeChild(link2);
    };
  }, [slidesPath]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            title="Close presentation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-white text-xl font-semibold">{title}</h2>
      </div>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}