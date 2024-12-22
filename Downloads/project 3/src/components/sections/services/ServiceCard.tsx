import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const ServiceCard = ({ title, description, icon: Icon }: ServiceCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 
                 transition-all duration-300 h-full"
    >
      {/* Icon */}
      <div className="mb-6">
        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center">
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Content */}
      <h3 className="text-xl font-semibold text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-400">
        {description}
      </p>
    </motion.div>
  );
};

export default ServiceCard;
