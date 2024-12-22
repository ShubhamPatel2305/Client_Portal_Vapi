import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: "John Doe",
    role: "CEO of FutureTech",
    quote: "The AI solutions transformed our customer support. Highly recommend!"
  },
  {
    name: "Sarah Smith",
    role: "CTO of InnovateCorp",
    quote: "Incredible ROI and seamless integration with our existing systems."
  }
];

const PricingTestimonials = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            What Our Clients Say
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800">
                <div className="flex items-center mb-6">
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <Star className="w-5 h-5 text-yellow-500 mr-1" />
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-gray-300 mb-6 text-lg italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTestimonials;
