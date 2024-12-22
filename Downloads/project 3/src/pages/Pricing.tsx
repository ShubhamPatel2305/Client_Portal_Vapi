import { useRef } from 'react';
import { motion } from 'framer-motion';
import PricingHero from '../components/sections/pricing/PricingHero';
import PricingBenefits from '../components/sections/pricing/PricingBenefits';
import PricingPlans from '../components/sections/pricing/PricingPlans';
import PricingTestimonials from '../components/sections/pricing/PricingTestimonials';
import PricingFAQ from '../components/sections/pricing/PricingFAQ';
import PricingCTA from '../components/sections/pricing/PricingCTA';

const Pricing = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-black overflow-x-hidden"
      ref={containerRef}
    >
      <div className="space-y-8 sm:space-y-12 md:space-y-16 lg:space-y-20">
        <PricingHero />
        <PricingBenefits />
        <PricingPlans />
        <PricingFAQ />
        <PricingCTA />
      </div>
    </motion.div>
  );
};

export default Pricing;