import React, { useRef, useEffect } from 'react';

const CanvasSequence = ({ folderName, frameCount }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const framesRef = useRef([]);
  const fps = 30; // Playback speed in frames per second

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    contextRef.current = context;
    
    let animationFrameId;
    let startTime;

    const renderFrame = (index) => {
      if (framesRef.current[index] && framesRef.current[index].complete) {
        const img = framesRef.current[index];
        const ctx = contextRef.current;
        const cWidth = canvas.width;
        const cHeight = canvas.height;
        
        // object-cover scaling inside the buffer
        const scale = Math.max(cWidth / img.width, cHeight / img.height);
        const x = (cWidth / 2) - (img.width / 2) * scale;
        const y = (cHeight / 2) - (img.height / 2) * scale;
        
        ctx.clearRect(0, 0, cWidth, cHeight);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    };
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Calculate current frame based on elapsed time and FPS (looping)
      const currentFrame = Math.floor((elapsed / 1000) * fps) % frameCount;
      
      renderFrame(currentFrame);
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const parent = canvas.parentElement;
      const pWidth = parent.clientWidth;
      const pHeight = parent.clientHeight;
      
      // Set visual size to perfectly fill parent
      canvas.style.width = pWidth + 'px';
      canvas.style.height = pHeight + 'px';
      
      // Set actual internal buffer size to match display density
      canvas.width = pWidth * dpr;
      canvas.height = pHeight * dpr;
    };

    const loadImages = () => {
      let firstLoaded = false;
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(3, '0');
        img.src = `/${folderName}/ezgif-frame-${paddedIndex}.jpg`;
        framesRef.current.push(img);
        
        img.onload = () => {
          if (!firstLoaded) {
            firstLoaded = true;
            // Start the animation loop as soon as at least one image is ready
            animationFrameId = requestAnimationFrame(animate);
          }
        };
      }
    };

    // Initialize
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    loadImages();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      framesRef.current = [];
    };
  }, [folderName, frameCount]);

  return (
    <div className="absolute inset-0 w-full h-full -z-20 bg-nature-green overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-80"
      />
      {/* Subtle overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};

export default CanvasSequence;
