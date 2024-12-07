import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Title, Text, Badge } from '@tremor/react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Twitter, 
  Globe, 
  Award,
  Briefcase,
  Users
} from 'lucide-react';

// Types
interface SocialLinks {
  linkedin: string;
  github: string;
  twitter: string;
  website?: string;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  social: SocialLinks;
  skills: string[];
  experience: string;
  projects: string[];
}

// Team member data
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Chief Technology Officer',
    bio: 'Visionary tech leader with a proven track record in building scalable solutions and fostering innovation. Passionate about mentoring and building high-performance teams.',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, USA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    social: {
      linkedin: 'https://linkedin.com/in/sarah-johnson',
      github: 'https://github.com/sarahj',
      twitter: 'https://twitter.com/sarahj',
      website: 'https://sarah-johnson.com'
    },
    skills: ['System Architecture', 'Team Leadership', 'Cloud Computing', 'Strategic Planning'],
    experience: '15+ years',
    projects: [
      'Enterprise Cloud Migration',
      'AI-Powered Analytics Platform',
      'Global Team Expansion'
    ]
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Lead Software Engineer',
    bio: 'Full-stack developer with expertise in modern web technologies. Known for solving complex technical challenges and mentoring junior developers.',
    email: 'michael.c@example.com',
    phone: '+1 (555) 234-5678',
    location: 'New York, USA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    social: {
      linkedin: 'https://linkedin.com/in/michael-chen',
      github: 'https://github.com/michaelc',
      twitter: 'https://twitter.com/michaelc',
      website: 'https://michaelchen.dev'
    },
    skills: ['React', 'Node.js', 'TypeScript', 'System Design', 'DevOps'],
    experience: '8+ years',
    projects: [
      'Real-time Analytics Dashboard',
      'Microservices Architecture',
      'Performance Optimization'
    ]
  }
];

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: { 
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const SocialIcon: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.2, rotate: 5 }}
    whileTap={{ scale: 0.95 }}
    className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
    aria-label={label}
  >
    {icon}
  </motion.a>
);

const TeamPage: React.FC = () => {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Title className="text-4xl font-bold text-gray-900 mb-4">Our Leadership Team</Title>
            <Text className="text-xl text-gray-600 max-w-3xl mx-auto">
              Meet the visionaries and technical experts who drive our innovation and success
            </Text>
          </motion.div>

          {/* Team Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card className="bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <Text className="text-gray-600">Team Size</Text>
                  <Title className="text-2xl font-bold">15+ Members</Title>
                </div>
              </div>
            </Card>
            <Card className="bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-lg">
                  <Award className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <Text className="text-gray-600">Combined Experience</Text>
                  <Title className="text-2xl font-bold">25+ Years</Title>
                </div>
              </div>
            </Card>
            <Card className="bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Briefcase className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <Text className="text-gray-600">Projects Delivered</Text>
                  <Title className="text-2xl font-bold">100+</Title>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              onHoverStart={() => setHoveredMember(member.id)}
              onHoverEnd={() => setHoveredMember(null)}
              className="h-full"
            >
              <Card 
                className={`h-full relative overflow-hidden cursor-pointer transform transition-all duration-300 ${
                  hoveredMember === member.id ? 'shadow-2xl scale-[1.02]' : 'shadow-lg'
                }`}
                onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
              >
                <div className="flex flex-col md:flex-row items-center gap-6 p-6">
                  {/* Profile Image */}
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg"
                    />
                    <motion.div 
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 mix-blend-multiply"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.2 }}
                    />
                  </motion.div>

                  {/* Member Info */}
                  <div className="flex-1 text-center md:text-left">
                    <Badge color="indigo" className="mb-2">{member.experience}</Badge>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                    
                    {/* Expandable Content */}
                    <AnimatePresence>
                      {selectedMember === member.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <Text className="text-gray-600">{member.bio}</Text>
                          
                          {/* Skills */}
                          <div className="space-y-2">
                            <Text className="font-semibold text-gray-900">Expertise</Text>
                            <div className="flex flex-wrap gap-2">
                              {member.skills.map((skill, index) => (
                                <span 
                                  key={index}
                                  className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Projects */}
                          <div className="space-y-2">
                            <Text className="font-semibold text-gray-900">Key Projects</Text>
                            <ul className="space-y-1">
                              {member.projects.map((project, index) => (
                                <li 
                                  key={index}
                                  className="flex items-center text-gray-600 text-sm"
                                >
                                  <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2" />
                                  {project}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Contact Information */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-center md:justify-start text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="text-sm">{member.email}</span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{member.phone}</span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{member.location}</span>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="mt-4 flex items-center justify-center md:justify-start space-x-4">
                      <SocialIcon 
                        href={member.social.linkedin}
                        icon={<Linkedin className="h-5 w-5" />}
                        label="LinkedIn Profile"
                      />
                      <SocialIcon 
                        href={member.social.github}
                        icon={<Github className="h-5 w-5" />}
                        label="GitHub Profile"
                      />
                      <SocialIcon 
                        href={member.social.twitter}
                        icon={<Twitter className="h-5 w-5" />}
                        label="Twitter Profile"
                      />
                      {member.social.website && (
                        <SocialIcon 
                          href={member.social.website}
                          icon={<Globe className="h-5 w-5" />}
                          label="Personal Website"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TeamPage;