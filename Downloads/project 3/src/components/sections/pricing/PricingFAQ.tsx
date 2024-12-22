import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is an AI agent?",
    answer: "An AI agent is a program designed to automate tasks and operations for humans and organizations. It leverages foundation models to make automation both contextually aware and autonomous."
  },
  {
    question: "How do AI phone agents handle unexpected scenarios during calls?",
    answer: "Advanced AI phone agents can interpret speech, think, and respond in real-time. However, their effectiveness in handling unexpected scenarios depends on the quality of their implementation and training."
  },
  {
    question: "Can AI agents be customized to fit specific business needs?",
    answer: "Yes, AI agents can be tailored to specific business requirements, including customizing greetings, conversation flows, and integrating with existing systems."
  },
  {
    question: "What happens if an AI agent cannot answer a caller's question?",
    answer: "If an AI agent cannot answer a question, it can be programmed to escalate the call to a human agent or inform the caller that their query will be forwarded to a specialist for follow-up."
  },
  {
    question: "How are AI agents trained and updated over time?",
    answer: "AI agents are trained using datasets relevant to their tasks. They can be updated by adding new data sources, refining existing data, and providing feedback to improve their performance."
  },
  {
    question: "What are the limitations of AI agents in customer service?",
    answer: "While AI agents can handle routine inquiries efficiently, they may struggle with complex or nuanced situations that require human empathy and judgment."
  },
  {
    question: "How do AI agents integrate with existing business systems?",
    answer: "AI agents can be integrated with various business systems through APIs and other integration tools, allowing them to access and process information from different platforms to perform tasks effectively."
  },
  {
    question: "What measures are in place to ensure the reliability of AI agents?",
    answer: "The reliability of AI agents depends on their design, training, and the quality of their implementation. Continuous monitoring and updates are essential to maintain their performance and handle a wide variety of inquiries effectively."
  },
  {
    question: "Can AI agents handle multiple calls simultaneously?",
    answer: "Yes, AI agents can handle multiple calls simultaneously, making them highly scalable solutions for businesses with high call volumes."
  },
  {
    question: "How do AI agents contribute to cost savings in customer service operations?",
    answer: "AI agents can reduce the need for large human support teams by handling routine inquiries, leading to significant cost savings in customer service operations."
  }
];

const FAQItem = ({ question, answer, isOpen, onToggle, index }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative group"
    >
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur"
        initial={false}
        animate={{
          opacity: isOpen ? 1 : 0
        }}
      />
      
      <motion.div
        className="relative p-6 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl cursor-pointer overflow-hidden hover:border-purple-500/30 transition-colors duration-300"
        onClick={onToggle}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex justify-between items-center gap-4">
          <h3 className="text-lg font-semibold text-white">{question}</h3>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
          >
            <ChevronDown className="w-5 h-5 text-purple-400" />
          </motion.div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <motion.p 
                className="mt-4 text-gray-400"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {answer}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const PricingFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.section
      className="relative py-24 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.1), transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <p className="text-gray-400">Everything you need to know about our AI agents</p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default PricingFAQ;
