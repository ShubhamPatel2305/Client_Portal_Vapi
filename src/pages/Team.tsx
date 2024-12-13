import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Title, Text } from '@tremor/react';
import { Target, Heart, Lightbulb } from 'lucide-react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-400">
              <div className="absolute inset-0 bg-opacity-50 bg-rose-900"></div>
            </div>
            <div className="relative h-full flex items-center justify-center">
              <div className="text-center">
                <Heart className="w-12 h-12 text-white mb-2 mx-auto" />
                <h2 className="text-2xl font-bold text-white">Our Core Values</h2>
                <p className="text-rose-100">The Principles That Guide Us</p>
              </div>
            </div>
          </div>
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 10rem)' }}>
            {content}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

interface Section {
  title: string;
  icon: JSX.Element;
  bgColor: string;
  iconBg: string;
  description: string;
  modalContent: ReactNode;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
  achievements: string[];
  skills: string[];
  socialLinks: {
    linkedin: string;
    twitter: string;
    github?: string;
  };
}

const sections: Record<string, Section> = {
  vision: {
    title: "Vision",
    icon: <Target className="w-8 h-8 text-blue-600" />,
    bgColor: "bg-blue-50",
    iconBg: "bg-blue-100",
    description: "To revolutionize communication through innovative technology solutions.",
    modalContent: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-gray-900">Strategic Focus</h3>
            <p className="text-gray-600">
              Our vision is centered on revolutionizing industrial processes through cutting-edge technology and innovation. We aim to:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                <span className="text-gray-600">Lead digital transformation across industries</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                <span className="text-gray-600">Create sustainable technology solutions</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></div>
                <span className="text-gray-600">Foster innovation and continuous improvement</span>
              </li>
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-4">2024 Vision Goals</h3>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Digital Innovation</span>
                  <span className="text-blue-600">85%</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Global Expansion</span>
                  <span className="text-blue-600">70%</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  },
  values: {
    title: "Values",
    icon: <Heart className="w-8 h-8 text-rose-600" />,
    bgColor: "bg-rose-50",
    iconBg: "bg-rose-100",
    description: "Excellence, integrity, and customer-centric innovation drive everything we do.",
    modalContent: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Excellence",
              description: "Striving for the highest quality in everything we do",
              icon: "🎯",
              delay: 0.2
            },
            {
              title: "Integrity",
              description: "Maintaining honesty and transparency in all interactions",
              icon: "🤝",
              delay: 0.4
            },
            {
              title: "Innovation",
              description: "Continuously pushing boundaries and embracing new ideas",
              icon: "💡",
              delay: 0.6
            }
          ].map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: value.delay }}
              className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-2">{value.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{value.title}</h3>
              <p className="text-sm text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="bg-rose-50 rounded-xl p-4">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Living Our Values</h3>
          <p className="text-sm text-gray-600 mb-4">
            Our values aren't just words on a wall – they're the foundation of every decision we make and every action we take.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3">
              <h4 className="font-semibold text-rose-600 mb-1">Employee Development</h4>
              <p className="text-xs text-gray-600">Continuous learning and growth opportunities for all team members</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <h4 className="font-semibold text-rose-600 mb-1">Client Success</h4>
              <p className="text-xs text-gray-600">Dedicated to exceeding client expectations and delivering value</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  innovation: {
    title: "Innovation",
    icon: <Lightbulb className="w-8 h-8 text-amber-600" />,
    bgColor: "bg-amber-50",
    iconBg: "bg-amber-100",
    description: "Constantly pushing boundaries to create cutting-edge solutions.",
    modalContent: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold text-gray-900">Innovation Process</h3>
            <div className="space-y-3">
              {[
                {
                  phase: "Research & Discovery",
                  description: "Identifying opportunities and market needs",
                  progress: 100
                },
                {
                  phase: "Ideation & Design",
                  description: "Creative problem-solving and solution design",
                  progress: 85
                },
                {
                  phase: "Development",
                  description: "Bringing ideas to life with cutting-edge tech",
                  progress: 75
                }
              ].map((step, index) => (
                <motion.div
                  key={step.phase}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.2 }}
                  className="bg-white rounded-lg p-3 shadow-sm"
                >
                  <h4 className="font-semibold text-gray-900 mb-1">{step.phase}</h4>
                  <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                  <div className="w-full bg-amber-100 rounded-full h-1.5">
                    <div
                      className="bg-amber-600 h-1.5 rounded-full transition-all duration-1000"
                      style={{ width: `${step.progress}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-amber-50 rounded-xl p-4"
          >
            <h3 className="text-lg font-semibold text-amber-900 mb-4">Innovation Metrics</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mb-2">
                  <div className="text-2xl font-bold text-amber-600">85%</div>
                </div>
                <h4 className="font-medium text-gray-900 text-sm">Success Rate</h4>
                <p className="text-xs text-gray-600">Project Implementation</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-amber-600 mb-1">50+</div>
                  <p className="text-xs text-gray-600">Patents Filed</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <div className="text-xl font-bold text-amber-600 mb-1">100+</div>
                  <p className="text-xs text-gray-600">Research Papers</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }
};

const teamMembers: TeamMember[] = [
  {
    name: "Moksh Patel",
    role: "Chief Technology Officer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
    description: "Visionary tech leader with expertise in AI, cloud architecture, and digital transformation. Pioneer in developing innovative solutions that reshape industries. Driving technological excellence through strategic leadership and cutting-edge implementations.",
    achievements: [
      "Led 50+ successful enterprise projects",
      "Expert in AI/ML implementation",
      "Cloud architecture specialist",
      "Digital transformation pioneer"
    ],
    skills: ["AI/ML", "Cloud Architecture", "Innovation Leadership", "Strategic Planning"],
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/mokshpatel",
      twitter: "https://twitter.com/mokshpatel",
      github: "https://github.com/mokshpatel"
    }
  },
  {
    name: "Mox",
    role: "Chief Innovation Officer",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    description: "Revolutionary innovator driving technological breakthroughs. Specializes in emerging technologies and creating future-ready solutions. Leading the charge in digital innovation and transformative technology solutions.",
    achievements: [
      "Pioneered cutting-edge tech solutions",
      "Innovation strategy expert",
      "Digital transformation leader",
      "Tech visionary and mentor"
    ],
    skills: ["Innovation Strategy", "Digital Transformation", "Tech Leadership", "Product Vision"],
    socialLinks: {
      linkedin: "https://www.linkedin.com/in/mox",
      twitter: "https://twitter.com/mox",
      github: "https://github.com/mox"
    }
  }
];

const Team: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Text className="text-rose-500 font-semibold tracking-wider uppercase text-sm">OUR MISSION</Text>
          <Title className="mt-2 text-4xl font-bold text-gray-900 mb-6">
            Empowering Innovation Through Technology
          </Title>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are a team of passionate innovators dedicated to transforming industries through cutting-edge technology solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {Object.entries(sections).map(([key, section]) => (
            <motion.div
              key={key}
              whileHover={{ y: -5 }}
              className={`p-6 rounded-xl ${section.bgColor} cursor-pointer transition-all duration-300 hover:shadow-lg`}
              onClick={() => setActiveModal(key)}
            >
              <div className={`w-12 h-12 ${section.iconBg} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                {section.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{section.title}</h3>
              <p className="text-gray-600 text-center">{section.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Team Members Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <Text className="text-rose-500 font-semibold tracking-wider uppercase text-sm">OUR LEADERSHIP</Text>
            <Title className="mt-2 text-4xl font-bold text-gray-900 mb-4">Visionary Leaders</Title>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the innovative minds driving our technological advancement and shaping the future of digital transformation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-80 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 z-10"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                    <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                    <p className="text-rose-300 font-medium">{member.role}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-6 leading-relaxed">{member.description}</p>
                  
                  {member.achievements && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Key Achievements</h4>
                      <ul className="space-y-2">
                        {member.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-center text-gray-600">
                            <svg className="w-4 h-4 text-rose-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {member.skills && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-4 pt-4 border-t border-gray-100">
                    <a
                      href={member.socialLinks.linkedin}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                    <a
                      href={member.socialLinks.twitter}
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      aria-label="Twitter"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    {member.socialLinks.github && (
                      <a
                        href={member.socialLinks.github}
                        className="text-gray-400 hover:text-gray-900 transition-colors"
                        aria-label="GitHub"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <Modal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          content={activeModal ? sections[activeModal].modalContent : null}
        />
      </div>
    </div>
  );
};

export default Team;