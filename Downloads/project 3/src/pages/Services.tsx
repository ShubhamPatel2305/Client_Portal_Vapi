import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import ServiceShowcase from '../components/sections/services/ServiceShowcase';
import ServiceProcess from '../components/sections/services/ServiceProcess';
import ServiceTechnology from '../components/sections/services/ServiceTechnology';
import ServiceCTA from '../components/sections/services/ServiceCTA';
import ScrollIndicator from '../components/ui/ScrollIndicator';

const Services = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll();

  // Ensure video plays continuously
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.play().catch(console.log);
    };

    playVideo();
    video.addEventListener('pause', playVideo);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) playVideo();
    });

    return () => {
      video.removeEventListener('pause', playVideo);
    };
  }, []);

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.8, 0]);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-black/50 z-10" />
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            className="w-full h-full object-cover"
          >
            <source src="/src/assets/3.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-bold tracking-tight sf-pro-display"
              style={{
                background: 'linear-gradient(to right, #fff 20%, #666 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Our Services
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto sf-pro-display"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Empowering your business with cutting-edge AI solutions
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-full max-w-[100px] mx-auto">
          <ScrollIndicator />
        </div>
      </section>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Services Showcase Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ServiceShowcase />
        </motion.div>

        {/* Process Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ServiceProcess />
        </motion.div>

        {/* Technology Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ServiceTechnology />
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <ServiceCTA />
        </motion.div>
      </main>
    </div>
  );
};

export default Services;
