import React, { useEffect, useRef } from 'react';
import SecretForm from '../components/SecretForm';

function Home() {
  const canvasRef = useRef(null);

  // Particle effect
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 60;
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = window.innerHeight;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,0,0,0.4)';
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > width) p.dx = -p.dx;
        if (p.y < 0 || p.y > height) p.dy = -p.dy;
      });
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Black matte background */}
      <div className="absolute inset-0 bg-black" />

      {/* Moving red gradient glow overlays */}
      <div className="absolute inset-0">
        <div className="absolute w-[800px] h-[800px] bg-red-700/20 rounded-full top-[-200px] left-[-200px] blur-[150px] animate-glow-1" />
        <div className="absolute w-[600px] h-[600px] bg-red-500/15 rounded-full bottom-[-150px] right-[-150px] blur-[120px] animate-glow-2" />
      </div>

      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Secret form container */}
      <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
        <div className="w-full max-w-lg backdrop-blur-xl bg-black/40 border border-red-600/40 rounded-2xl shadow-2xl p-6 animate-fade-in">
          <SecretForm />
        </div>
      </div>

      {/* Styles for animations */}
      <style>
        {`
          @keyframes glow-1 {
            0% { transform: translate(0,0) scale(1); }
            50% { transform: translate(50px,50px) scale(1.1); }
            100% { transform: translate(0,0) scale(1); }
          }
          @keyframes glow-2 {
            0% { transform: translate(0,0) scale(1); }
            50% { transform: translate(-50px,-50px) scale(1.05); }
            100% { transform: translate(0,0) scale(1); }
          }
          .animate-glow-1 { animation: glow-1 20s ease-in-out infinite; }
          .animate-glow-2 { animation: glow-2 25s ease-in-out infinite; }
          @keyframes fade-in { from {opacity:0; transform: translateY(20px);} to {opacity:1; transform: translateY(0);} }
          .animate-fade-in { animation: fade-in 1.2s ease forwards; }
        `}
      </style>
    </div>
  );
}

export default Home;