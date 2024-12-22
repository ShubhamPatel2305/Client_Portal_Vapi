import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AboutHero from '../components/sections/about/AboutHero';
import AboutMission from '../components/sections/about/AboutMission';
import AboutValues from '../components/sections/about/AboutValues';
import AboutTimeline from '../components/sections/about/AboutTimeline';
import AboutStats from '../components/sections/about/AboutStats';
import AboutTeam from '../components/sections/about/AboutTeam';
import AboutAwards from '../components/sections/about/AboutAwards';
import AboutLocations from '../components/sections/about/AboutLocations';

const About: React.FC = () => {
  useEffect(() => {
    // Add scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-on-scroll');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    // Observe all elements with animation classes
    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll();
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <main className="bg-black min-h-screen relative">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-500 transform origin-left z-50"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Hero Section - Fade and Scale */}
      <div className="animate-on-scroll scale-in">
        <AboutHero />
      </div>

      {/* Mission Section - Slide from Left */}
      <div className="animate-on-scroll slide-from-left">
        <AboutMission />
      </div>

      {/* Values Section - Rotate In */}
      <div className="animate-on-scroll rotate-in">
        <AboutValues />
      </div>

      {/* Timeline Section - Clip Path */}
      <div className="animate-on-scroll clip-path-in">
        <AboutTimeline />
      </div>

      {/* Stats Section - Bounce In */}
      <div className="animate-on-scroll bounce-in">
        <AboutStats />
      </div>

      {/* Awards Section - Slide from Right */}
      {/* <div className="animate-on-scroll slide-from-right">
        <AboutAwards />
      </div> */}

      {/* Team Section - Blur In */}
      <div className="animate-on-scroll blur-in">
        <AboutTeam />
      </div>

      {/* Locations Section - Fade Slide Up */}
      {/* <div className="animate-on-scroll fade-slide-up">
        <AboutLocations />
      </div> */}

      {/* Floating Navigation Dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 space-y-4 z-40">
        {['hero', 'mission', 'values', 'timeline', 'stats', 'awards', 'team', 'locations'].map((section, index) => (
          <motion.a
            key={section}
            href={`#${section}`}
            className="block w-3 h-3 rounded-full bg-white/20 hover:bg-white/50 transition-colors duration-300"
            whileHover={{ scale: 1.5 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          />
        ))}
      </div>
    </main>
  );
};

export default About;