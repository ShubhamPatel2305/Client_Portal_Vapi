import React, { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {  Mail, Phone, MapPin, Award, Briefcase, Book } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  description: string;
  expertise: string[];
  contact: {
    email: string;
    phone: string;
    location: string;
  };
  socialLinks: {
    linkedin: string;
    twitter: string;
    github?: string;
  };
  achievements: {
    icon: ReactNode;
    title: string;
    description: string;
  }[];
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Moksh Patel",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    description: "Visionary leader with expertise in technology innovation and business strategy.",
    expertise: ["Business Strategy", "Technology Innovation", "Team Leadership", "Product Vision"],
    contact: {
      email: "moksh2031@gmail.com",
      phone: "+91 9313045439",
      location: "Vapi, Gujarat"
    },
    socialLinks: {
      linkedin: "https://linkedin.com/in/mokshpatel",
      twitter: "https://twitter.com/mokshpatel",
      github: "https://github.com/mokshpatel"
    },
    achievements: [
      {
        icon: <Award className="w-6 h-6 text-purple-500" />,
        title: "Innovation Award 2023",
        description: "Recognized for groundbreaking technological solutions"
      },
      {
        icon: <Briefcase className="w-6 h-6 text-blue-500" />,
        title: "Business Excellence",
        description: "Led company to 200% growth in 2023"
      },
      {
        icon: <Book className="w-6 h-6 text-green-500" />,
        title: "Industry Recognition",
        description: "Featured in top tech publications"
      }
    ]
  },
  {
    id: 2,
    name: "Smit Tilva",
    role: "CTO & Co-Founder",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
    description: "Tech innovator with expertise in AI and automation solutions.",
    expertise: ["Artificial Intelligence", "Automation", "Cloud Architecture", "Tech Strategy"],
    contact: {
      email: "smit.tilva@topedge.in",
      phone: "+91 94846 07042",
      location: "Vapi, Gujarat"
    },
    socialLinks: {
      linkedin: "https://linkedin.com/in/smittilva",
      twitter: "https://twitter.com/smittilva",
      github: "https://github.com/smittilva"
    },
    achievements: [
      {
        icon: <Award className="w-6 h-6 text-purple-500" />,
        title: "Tech Excellence 2023",
        description: "Pioneer in AI implementation"
      },
      {
        icon: <Briefcase className="w-6 h-6 text-blue-500" />,
        title: "Innovation Leader",
        description: "Developed cutting-edge automation solutions"
      },
      {
        icon: <Book className="w-6 h-6 text-green-500" />,
        title: "Tech Influencer",
        description: "Regular speaker at tech conferences"
      }
    ]
  }
];

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
      >
        <div className="relative h-[400px]">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
            <p className="text-gray-200 font-medium">{member.role}</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {member.expertise.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
          
          <p className="text-gray-600 mb-6 line-clamp-3">{member.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a
                href={member.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a
                href={member.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              View Details →
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative h-full">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 text-white">
                    <h3 className="text-3xl font-bold mb-2">{member.name}</h3>
                    <p className="text-xl mb-4">{member.role}</p>
                    <div className="flex items-center space-x-4">
                      <Mail className="w-5 h-5" />
                      <span>{member.contact.email}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <Phone className="w-5 h-5" />
                      <span>{member.contact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <MapPin className="w-5 h-5" />
                      <span>{member.contact.location}</span>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="mb-8">
                    <h4 className="text-xl font-semibold mb-4">About</h4>
                    <p className="text-gray-600">{member.description}</p>
                  </div>
                  <div className="mb-8">
                    <h4 className="text-xl font-semibold mb-4">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Achievements</h4>
                    <div className="space-y-4">
                      {member.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="mt-1">{achievement.icon}</div>
                          <div>
                            <h5 className="font-medium">{achievement.title}</h5>
                            <p className="text-sm text-gray-600">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const VisionMissionSection = () => {
  return (
    <div className="mb-24">
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white pointer-events-none"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">Vision & Mission</h2>
            <div className="w-24 h-1 bg-gray-900 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Vision Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 border border-gray-200 rounded-xl"></div>
                <div className="relative p-6">
                  <div className="flex items-center mb-8">
                    <div className="mr-6">
                      <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">Our Vision</h3>
                      <div className="w-16 h-0.5 bg-gray-900"></div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    To revolutionize industries through cutting-edge technology solutions, 
                    becoming the global leader in digital transformation and innovation.
                  </p>

                  <div className="space-y-4">
                    {["Innovation First", "Global Impact", "Future Ready"].map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mission Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 border border-gray-200 rounded-xl"></div>
                <div className="relative p-6">
                  <div className="flex items-center mb-8">
                    <div className="mr-6">
                      <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">Our Mission</h3>
                      <div className="w-16 h-0.5 bg-gray-900"></div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-lg leading-relaxed mb-8">
                    To deliver exceptional value through innovative technology solutions, 
                    empowering businesses to thrive in the digital age.
                  </p>

                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { label: "Client Success", value: "100%" },
                      { label: "Innovation Rate", value: "95%" },
                      { label: "Team Growth", value: "200%" },
                      { label: "Global Reach", value: "50+" }
                    ].map((stat, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 pt-16 border-t border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: "⚡️",
                  title: "Innovation",
                  description: "Pushing boundaries with cutting-edge solutions"
                },
                {
                  icon: "🎯",
                  title: "Excellence",
                  description: "Delivering the highest quality in everything we do"
                },
                {
                  icon: "🤝",
                  title: "Integrity",
                  description: "Building trust through transparency and honesty"
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.2 }}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-4">{value.icon}</div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h4>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default function Team() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        

        {/* Vision & Mission Section */}
        <VisionMissionSection />
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Our Team
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Meet the passionate individuals behind our success
          </motion.p>
        </div>
        {/* Team Members Section */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}