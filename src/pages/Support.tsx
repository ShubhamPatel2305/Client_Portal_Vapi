import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Card } from '@tremor/react';
import { 
  Send, 
  Check,
  MessageSquare,
  Mail,
  Phone,
  MessageCircle
} from 'lucide-react';
import { auth } from '../lib/firebase';
import emailjs from '@emailjs/browser';

// Form validation schema
const supportSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits')
    .regex(/^[0-9+\-\s()]*$/, 'Please enter a valid phone number'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  urgency: z.enum(['low', 'medium', 'high']),
  requestType: z.enum(['general', 'support', 'billing', 'feature', 'other'])
});

type SupportForm = z.infer<typeof supportSchema>;

export default function Support() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<SupportForm>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      urgency: 'medium',
      requestType: 'general',
      email: auth.currentUser?.email || ''
    }
  });

  const onSubmit = async (data: SupportForm) => {
    try {
      const templateParams = {
        to_email: 'moksh2031@gmail.com',
        from_name: data.name,
        company_name: data.companyName,
        from_email: data.email,
        phone_number: data.phone,
        subject: data.subject,
        message: data.message,
        urgency: data.urgency,
        requestType: data.requestType,
        user_id: auth.currentUser?.uid || 'anonymous'
      };

      const response = await emailjs.send(
        'service_5fndngs', // Replace with your EmailJS service ID
        'template_ks6yblh', // Replace with your EmailJS template ID
        templateParams,
        'n--Yx3vL8ch_WR7vO' // Replace with your EmailJS public key
      );

      if (response.status === 200) {
        toast.success('Support request sent successfully!');
        reset();
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send support request. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            How Can We Help You?
          </motion.h1>
          <p className="text-gray-600 text-lg">
            We're here to help and answer any questions you might have
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <a 
              href="https://wa.me/919313045439" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Card 
                className="p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
                decoration="left"
                decorationColor="blue"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-blue-600" />
                  </div>
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">Chat With Us</h3>
                <p className="text-gray-600">Available 24/7 for support</p>
              </Card>
            </a>
          </motion.div>
          
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <a 
              href="mailto:acctopedge@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Card 
                className="p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
                decoration="left"
                decorationColor="green"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-green-600" />
                  </div>
                </motion.div>
                <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                <p className="text-gray-600">Get response within 24 hours</p>
              </Card>
            </a>
          </motion.div>
          
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => {
              const modal = document.getElementById('callModal');
              if (modal) modal.style.display = 'flex';
            }}
          >
            <Card 
              className="p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
              decoration="left"
              decorationColor="purple"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Phone className="w-8 h-8 text-purple-600" />
                </div>
              </motion.div>
              <h3 className="font-semibold text-lg mb-2">Call Us</h3>
              <p className="text-gray-600">Mon-Fri from 8am to 5pm</p>
            </Card>
          </motion.div>
        </div>

        {/* Call Modal */}
        <div
          id="callModal"
          className="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              const modal = document.getElementById('callModal');
              if (modal) modal.style.display = 'none';
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
          >
            <h3 className="text-2xl font-bold mb-4 text-center">Contact Numbers</h3>
            <div className="space-y-4">
              <a
                href="tel:+919313045439"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-colors"
              >
                <span className="font-medium">+91 9313 045 439</span>
                <Phone className="w-5 h-5 text-purple-600" />
              </a>
              <a
                href="tel:+919484607042"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-colors"
              >
                <span className="font-medium">+91 9484 607 042</span>
                <Phone className="w-5 h-5 text-purple-600" />
              </a>
            </div>
            <button
              onClick={() => {
                const modal = document.getElementById('callModal');
                if (modal) modal.style.display = 'none';
              }}
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </motion.div>
        </div>

        {/* Support Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          <Card
            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
            decoration="top"
            decorationColor="indigo"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Submit a Request</h2>
                  <p className="text-gray-600">We'll get back to you within 24 hours</p>
                </div>
              </div>

              {/* Name and Company Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <div className="relative">
                    <input
                      {...register("name")}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500 mt-1"
                      >
                        {errors.name.message}
                      </motion.span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <div className="relative">
                    <input
                      {...register("companyName")}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="Your company name"
                    />
                    {errors.companyName && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500 mt-1"
                      >
                        {errors.companyName.message}
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>

              {/* Email and Phone Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <input
                      {...register("email")}
                      type="email"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500 mt-1"
                      >
                        {errors.email.message}
                      </motion.span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="relative">
                    <input
                      {...register("phone")}
                      type="tel"
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                      placeholder="+91 XXXXX XXXXX"
                    />
                    {errors.phone && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500 mt-1"
                      >
                        {errors.phone.message}
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <div className="relative">
                  <textarea
                    {...register("message")}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none"
                    placeholder="Describe your issue or question..."
                  />
                  {errors.message && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-red-500 mt-1"
                    >
                      {errors.message.message}
                    </motion.span>
                  )}
                </div>
              </div>

              {/* Subject, Urgency, and Request Type Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Subject</label>
                  <div className="relative">
                    <select
                      {...register("subject")}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer hover:border-indigo-300"
                    >
                      <option value="" disabled>Choose a subject</option>
                      <option value="technical">🔧 Technical Issue</option>
                      <option value="billing">💳 Billing Question</option>
                      <option value="feature">✨ Feature Request</option>
                      <option value="bug">🐛 Bug Report</option>
                      <option value="other">📝 Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {errors.subject && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500 mt-1"
                      >
                        {errors.subject.message}
                      </motion.span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Urgency</label>
                  <div className="relative">
                    <select
                      {...register("urgency")}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer hover:border-indigo-300"
                    >
                      <option value="" disabled>Select priority</option>
                      <option value="low">🟢 Low Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="high">🔴 High Priority</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {errors.urgency && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500 mt-1"
                      >
                        {errors.urgency.message}
                      </motion.span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Request Type</label>
                  <div className="relative">
                    <select
                      {...register("requestType")}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 appearance-none cursor-pointer hover:border-indigo-300"
                    >
                      <option value="" disabled>Select type</option>
                      <option value="general">📋 General Inquiry</option>
                      <option value="support">🛠️ Technical Support</option>
                      <option value="billing">💰 Billing Support</option>
                      <option value="feature">💡 Feature Request</option>
                      <option value="other">📝 Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {errors.requestType && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-red-500 mt-1"
                      >
                        {errors.requestType.message}
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />
                      <span>Submit Request</span>
                    </div>
                  )}
                </motion.button>
              </div>
            </form>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
