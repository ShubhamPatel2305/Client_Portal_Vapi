import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';

const AIAgentSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  // Ensure video plays continuously
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force play on mount
    video.play().catch(console.log);

    // Set up event listeners to ensure continuous playback
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        video.play().catch(console.log);
      }
    };

    const handleFocus = () => {
      video.play().catch(console.log);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[70vh] sm:min-h-[80vh] md:min-h-screen py-8 sm:py-12 md:py-16 lg:py-24 overflow-hidden bg-black"
    >
      <motion.div
        style={{ opacity, scale }}
        className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8"
      >
        {/* Section Title */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold tracking-tight gradient-text px-2"
          >
            AI Agent Working For You
          </motion.h2>
        </div>

        {/* Video Container */}
        <div className="relative max-w-5xl mx-auto px-2 sm:px-4">
          <div className="relative aspect-video rounded-md sm:rounded-lg md:rounded-xl lg:rounded-2xl overflow-hidden group">
            {/* Glow Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl sm:blur-2xl md:blur-3xl opacity-40 sm:opacity-50 group-hover:opacity-70 transition-opacity" />
            <div className="absolute -inset-0.5 sm:-inset-1 md:-inset-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-lg sm:blur-xl md:blur-2xl opacity-20 sm:opacity-30 group-hover:opacity-50 transition-opacity" />
            
            {/* Video Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />

            {/* Main Video */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              className="w-full h-full object-cover relative z-0"
              style={{ 
                filter: 'brightness(1.1) contrast(1.1)',
                boxShadow: '0 0 50px rgba(59, 130, 246, 0.3)'
              }}
              onContextMenu={(e) => e.preventDefault()}
              onLoadStart={(e) => {
                const video = e.target as HTMLVideoElement;
                video.play().catch(console.log);
              }}
              onLoadedData={(e) => {
                const video = e.target as HTMLVideoElement;
                video.play().catch(console.log);
              }}
              onPause={(e) => {
                const video = e.target as HTMLVideoElement;
                video.play().catch(console.log);
              }}
            >
              <source src="/src/assets/agent.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default AIAgentSection;
