import React, { useState, useEffect, useCallback } from 'react';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [droplets, setDroplets] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showRipple, setShowRipple] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  
  // Brand colors
  const colors = {
    darkest: '#241b20',
    dark: '#3e1a26',
    medium: '#611424',
    bright: '#97114c',
    lightest: '#c23e78'
  };

  // Generate random droplets
  useEffect(() => {
    const generateDroplets = () => {
      const newDroplets = [];
      const count = Math.max(Math.floor(window.innerWidth / 30), 15); // Responsive count
      
      for (let i = 0; i < count; i++) {
        const size = Math.random() * 12 + 4; // 4px to 16px
        newDroplets.push({
          id: i,
          x: Math.random() * 100, // % position
          y: Math.random() * 100, // % position
          size,
          opacity: Math.random() * 0.25 + 0.15, // 0.15 to 0.4
          delay: Math.random() * 4, // 0 to 4s
          duration: Math.random() * 5 + 8, // 8 to 13s (faster)
          color: i % 3 === 0 ? colors.bright : 
                i % 3 === 1 ? colors.medium : colors.lightest
        });
      }
      
      setDroplets(newDroplets);
    };
    
    generateDroplets();
    
    // Regenerate on resize for responsiveness
    window.addEventListener('resize', generateDroplets);
    return () => window.removeEventListener('resize', generateDroplets);
  }, [colors.bright, colors.medium, colors.lightest]);

  // Noise effect for background
  const createNoisePattern = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    const imageData = ctx.createImageData(200, 200);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const value = Math.floor(Math.random() * 255 * 0.08); // Very subtle noise
      data[i] = value;
      data[i + 1] = value;
      data[i + 2] = value;
      data[i + 3] = 255;
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
  };

  const [noisePattern, setNoisePattern] = useState('');
  
  useEffect(() => {
    setNoisePattern(createNoisePattern());
    setIsLoaded(true);
  }, []);

  // Interactivity for ripple effects
  const handleClick = useCallback((e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    setRipplePosition({ x, y });
    setShowRipple(true);
    
    setTimeout(() => {
      setShowRipple(false);
    }, 1000);
  }, []);

  // Track mouse position for hover effects
  const handleMouseMove = useCallback((e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener('click', handleClick);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [handleClick, handleMouseMove]);

  // Typewriter effect for tagline
  const [displayText, setDisplayText] = useState('');
  const fullText = 'FiveM Scripts & Server Development';
  
  useEffect(() => {
    if (!isLoaded) return;
    
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);
    
    return () => clearInterval(typingInterval);
  }, [isLoaded, fullText]);

  return (
    <div 
      className="min-h-screen relative overflow-hidden flex flex-col justify-center items-center" 
      style={{ 
        backgroundColor: colors.darkest,
        backgroundImage: noisePattern ? `url(${noisePattern})` : 'none',
      }}
    >
      {/* Water droplet effect */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {droplets.map((droplet) => (
          <div
            key={droplet.id}
            className="absolute rounded-full animate-fallingSlow"
            style={{
              width: `${droplet.size}px`,
              height: `${droplet.size * 1.5}px`, // Slightly elongated for droplet feel
              left: `${droplet.x}%`,
              top: `${-droplet.size * 2}px`, // Start above viewport
              background: `radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.4), ${droplet.color}${Math.floor(droplet.opacity * 255).toString(16).padStart(2, '0')})`,
              boxShadow: `0 0 ${droplet.size / 2}px rgba(255, 255, 255, ${droplet.opacity / 2})`,
              animationDelay: `${droplet.delay}s`,
              animationDuration: `${droplet.duration}s`,
              opacity: droplet.opacity,
              transform: 'translateY(0px)', // Initial position
            }}
          ></div>
        ))}
      </div>
      
      {/* Interactive ripple effect on click */}
      {showRipple && (
        <div 
          className="absolute pointer-events-none z-10 animate-ripple"
          style={{
            width: '300px',
            height: '300px',
            left: ripplePosition.x - 150,
            top: ripplePosition.y - 150,
            borderRadius: '50%',
            border: `2px solid ${colors.lightest}`,
            boxShadow: `0 0 20px ${colors.lightest}50`,
            opacity: 0.5,
          }}
        ></div>
      )}
      
      {/* Card container - positioned relative to handle perspective */}
      <div className="relative z-10 perspective-1000">
        {/* Card with 3D tilt effect */}
        <div 
          className={`relative backdrop-blur-sm bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-10 transition-transform duration-200 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            boxShadow: `0 25px 50px -12px ${colors.darkest}`,
            transform: `perspective(1000px) rotateX(${(mousePosition.y - window.innerHeight / 2) / 50}deg) rotateY(${-(mousePosition.x - window.innerWidth / 2) / 50}deg)`,
          }}
        >
          <div className="text-center">
            {/* Logo/Brand Element with glow */}
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 rounded-full filter blur-xl opacity-50"
                   style={{ backgroundColor: colors.lightest }}></div>
              <div className="relative h-24 w-24 rounded-full mx-auto overflow-hidden flex items-center justify-center"
                   style={{ 
                     background: `linear-gradient(135deg, ${colors.lightest}, ${colors.bright})`,
                     boxShadow: `0 0 30px ${colors.lightest}88`
                   }}>
                {/* Code icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </div>
            
            {/* Brand Name with text shadow */}
            <div className="relative mb-4">
              <div className="absolute inset-0 blur-md opacity-40" style={{ color: colors.brightest || colors.lightest }}>
                Overstim Studios
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text relative"
                  style={{ 
                    backgroundImage: `linear-gradient(135deg, white, #ffffffaa)`,
                    textShadow: `0 0 40px ${colors.lightest}50`
                  }}>
                Overstim Studios
              </h1>
            </div>
            
            {/* Tagline with typewriter effect */}
            <p className="text-xl text-gray-300 mb-10 opacity-80 h-8 flex items-center justify-center">
              {displayText}
              <span className="animate-blink ml-0.5 h-5 w-0.5 bg-gray-300"></span>
            </p>
            
            {/* Call to action buttons with glass effect */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="https://github.com/overstim-studios" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-sm border border-white border-opacity-10 hover:border-opacity-25 hover:shadow-lg group"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.medium}cc, ${colors.medium}99)`,
                  boxShadow: `0 4px 20px ${colors.medium}50`
                }}
              >
                {/* GitHub icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span className="relative">
                  GitHub
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
              <a 
                href="https://discord.gg/overstim-studios" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all duration-300 backdrop-blur-sm border border-white border-opacity-10 hover:border-opacity-25 hover:shadow-lg group"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.bright}cc, ${colors.bright}99)`,
                  boxShadow: `0 4px 20px ${colors.bright}50`
                }}
              >
                {/* Discord icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
                <span className="relative">
                  Discord
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </span>
              </a>
            </div>
          </div>
          
          {/* Extra Large Shimmer Effect - positioned absolute and extended far beyond the bounds */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
            <div className="shimmer-sweep"></div>
          </div>
        </div>
      </div>

      {/* Subtle footer */}
      <div className="absolute bottom-4 text-gray-500 text-xs opacity-50 z-10">
        © {new Date().getFullYear()} Overstim Studios
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fallingSlow {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--opacity, 0.3);
          }
          100% {
            transform: translateY(100vh) rotate(20deg);
            opacity: 0;
          }
        }
        
        .animate-fallingSlow {
          animation: fallingSlow linear infinite;
          --opacity: 0.3;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        @keyframes ripple {
          0% { 
            transform: scale(0); 
            opacity: 0.7;
          }
          100% { 
            transform: scale(1); 
            opacity: 0;
          }
        }
        
        .animate-ripple {
          animation: ripple 1s ease-out forwards;
        }
        
        @keyframes shimmer-sweep {
          0% {
            transform: translateX(-200%) rotate(30deg);
          }
          100% {
            transform: translateX(200%) rotate(30deg);
          }
        }
        
        .shimmer-sweep {
          position: absolute;
          top: -200%;
          left: -200%;
          width: 500%;
          height: 500%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.05) 25%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 75%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-200%) rotate(30deg);
          animation: shimmer-sweep 6s infinite linear;
          pointer-events: none;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;