import React, { useRef, useEffect } from 'react';

const CanvasSequence = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const framesRef = useRef([]);
  const frameCount = 120;
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
        
        // object-cover scaling
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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // renderFrame will be continuously called by the animate loop
    };

    const getFileName = (i) => {
      const paddedIndex = i.toString().padStart(3, '0');
      if (i <= 10) return `enhanced_${paddedIndex}.jpg`;
      if (i <= 20) return `enhanced_${paddedIndex}_1080p.jpg`;
      const v = Math.floor((i - 1) / 10);
      return `enhanced_${paddedIndex}_1080p_v${v}.jpg`;
    };

    const loadImages = () => {
      let firstLoaded = false;
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = `/image_sequence/${getFileName(i)}`;
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
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[100vh] -z-20 bg-nature-green">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover opacity-80"
      />
      {/* Subtle overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/20" />
    </div>
  );
};

export default CanvasSequence;
