import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Send, CheckCircle, Building2, MessageSquare, User, Mail, Sparkles } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { format, addHours, isBefore, startOfToday, endOfMonth } from 'date-fns';
import toast from 'react-hot-toast';
import 'react-day-picker/dist/style.css';
import { createMeeting, getBookedSlots } from '../lib/calendar';
import { sendConfirmationEmail } from '../lib/emailjs';

const services = [
  {
    id: "1",
    name: 'AI Consultation',
    description: 'Expert guidance on implementing AI solutions',
    duration: '1 hour',
    price: '$150',
    icon: '🤖'
  },
  {
    id: "2",
    name: 'Machine Learning Strategy',
    description: 'Custom ML strategy for your business needs',
    duration: '1 hour',
    price: '$200',
    icon: '🧠'
  },
  {
    id: "3",
    name: 'Data Analysis',
    description: 'In-depth analysis of your data infrastructure',
    duration: '1 hour',
    price: '$175',
    icon: '📊'
  }
];

const steps = ['Select Service', 'Choose Date & Time', 'Personal Info'];

const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="relative w-full h-1 bg-gray-800 rounded-full overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500"
        initial={{ width: '0%' }}
        animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
    </div>
  );
};

const StepIndicator = ({ step, index, currentStep }: { step: string; index: number; currentStep: number }) => {
  const isActive = index === currentStep;
  const isCompleted = index < currentStep;

  return (
    <motion.div
      className="flex flex-col items-center relative"
      initial={false}
      animate={{ scale: isActive ? 1.1 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isCompleted ? 'bg-blue-500' : isActive ? 'bg-blue-600' : 'bg-gray-800'
        } shadow-lg relative z-10`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <CheckCircle className="w-6 h-6 text-white" />
          </motion.div>
        ) : (
          <motion.span
            className={`text-lg ${isActive ? 'text-white' : 'text-gray-400'}`}
            initial={false}
            animate={{ scale: isActive ? 1.2 : 1 }}
          >
            {index + 1}
          </motion.span>
        )}
      </motion.div>
      <motion.span
        className={`mt-2 text-sm font-medium ${
          isActive ? 'text-white' : 'text-gray-400'
        }`}
        initial={false}
        animate={{ y: isActive ? -4 : 0 }}
      >
        {step}
      </motion.span>
    </motion.div>
  );
};

const FloatingParticle = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
      initial={{ 
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: 0
      }}
      animate={{ 
        y: [0, -20, 0],
        scale: [0, 1, 0],
        opacity: [0, 0.8, 0]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

const generateTimeSlots = (selectedDate?: Date) => {
  const slots = [];
  const now = new Date();
  const isToday = selectedDate && 
    selectedDate.getDate() === now.getDate() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getFullYear() === now.getFullYear();

  for (let hour = 9; hour <= 16; hour++) {
    for (let minute of [0, 30]) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const time = new Date(selectedDate || now);
      time.setHours(hour, minute, 0);

      // Skip slots that have passed if it's today
      if (isToday && time <= now) {
        continue;
      }

      const formattedTime = format(time, 'h:mm a');
      slots.push(formattedTime);
    }
  }

  return slots;
};

const Booking = () => {
  const [selected, setSelected] = useState<Date>();
  const [timeSlot, setTimeSlot] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<{ date: string; timeSlot: string; }[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const updateAvailableTimeSlots = async (selectedDate: Date) => {
    try {
      // Get all booked slots for the month
      const startDate = startOfToday();
      const endDate = endOfMonth(selectedDate);
      const slots = await getBookedSlots(startDate, endDate);
      setBookedSlots(slots);

      // Filter out booked slots for the selected date
      const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
      const bookedSlotsForDate = slots
        .filter(slot => slot.date === selectedDateStr)
        .map(slot => slot.timeSlot);

      // Generate available time slots
      const allSlots = generateTimeSlots(selectedDate);
      const availableSlots = allSlots.filter(slot => !bookedSlotsForDate.includes(slot));
      
      setAvailableTimeSlots(availableSlots);
    } catch (error) {
      console.error('Error updating time slots:', error);
      toast.error('Failed to load available time slots');
      setAvailableTimeSlots(generateTimeSlots(selectedDate));
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelected(date);
    setTimeSlot('');
    if (date) {
      updateAvailableTimeSlots(date);
    } else {
      setAvailableTimeSlots([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !timeSlot || !selectedService || !formData.name || !formData.email) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const service = services.find(s => s.id === selectedService);
      const startTime = new Date(selected);
      const [hours, minutes] = timeSlot.match(/\d+/g)?.map(Number) || [];
      if (timeSlot.includes('PM') && hours !== 12) {
        startTime.setHours(hours + 12, minutes || 0);
      } else {
        startTime.setHours(hours, minutes || 0);
      }
      const endTime = addHours(startTime, 1);

      // Create Zoom meeting and calendar event
      const result = await createMeeting(
        startTime.toISOString(),
        endTime.toISOString(),
        `${service?.name} with ${formData.name}`,
        `${formData.message}\n\nCompany: ${formData.company || 'N/A'}`,
        formData.email
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to create meeting');
      }

      // Send confirmation emails
      const emailResult = await sendConfirmationEmail({
        userEmail: formData.email,
        userName: formData.name,
        serviceName: service?.name || '',
        dateTime: `${format(startTime, 'MMMM d, yyyy')} at ${timeSlot}`,
        company: formData.company,
        message: formData.message,
        zoomLink: result.zoomMeetingUrl
      });

      if (!emailResult.success) {
        throw new Error(emailResult.error || 'Failed to send confirmation email');
      }

      // Update booked slots after successful booking
      await updateAvailableTimeSlots(selected);

      toast.custom(() => (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-3"
        >
          <Sparkles className="w-6 h-6" />
          <div>
            <p className="font-medium">Booking confirmed!</p>
            <p className="text-sm opacity-90">Check your email for meeting details</p>
          </div>
        </motion.div>
      ), { duration: 4000 });

      // Reset form
      setCurrentStep(0);
      setSelected(undefined);
      setTimeSlot('');
      setSelectedService('');
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
      });
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (currentStep === 0 && !selectedService) {
      toast.error('Please select a service');
      return;
    }
    if (currentStep === 1 && (!selected || !timeSlot)) {
      toast.error('Please select date and time');
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),rgba(0,0,0,0))]" />
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex justify-between items-center mb-8">
            {steps.map((step, index) => (
              <StepIndicator
                key={step}
                step={step}
                index={index}
                currentStep={currentStep}
              />
            ))}
          </div>
          <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
                >
                  {services.map((service) => (
                    <motion.div
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`relative p-6 rounded-xl cursor-pointer ${
                        selectedService === service.id
                          ? 'bg-blue-600 shadow-lg shadow-blue-500/20'
                          : 'bg-gray-800/50 hover:bg-gray-800'
                      } transition-all duration-300`}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-3xl mb-4">{service.icon}</div>
                      <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                      <p className="text-sm text-gray-400 mb-4">{service.description}</p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">{service.duration}</span>
                        <span className="font-bold text-blue-400">{service.price}</span>
                      </div>
                      {selectedService === service.id && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                          <CheckCircle className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5" />
                        Select Date
                      </h3>
                      <DayPicker
                        mode="single"
                        selected={selected}
                        onSelect={handleDateSelect}
                        className="bg-gray-800/50 rounded-lg p-3"
                        modifiers={{
                          disabled: { before: new Date() },
                        }}
                        modifiersStyles={{
                          disabled: { color: 'gray' },
                        }}
                      />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Select Time
                      </h3>
                      {selected ? (
                        availableTimeSlots.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {availableTimeSlots.map((slot) => (
                              <button
                                key={slot}
                                onClick={() => setTimeSlot(slot)}
                                className={`p-3 rounded-lg transition-all duration-200 ${
                                  timeSlot === slot
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800/50 hover:bg-gray-800'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                            <p>No available time slots for this date</p>
                          </div>
                        )
                      ) : (
                        <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                          <p>Please select a date first</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center text-sm font-medium mb-1">
                          <User className="w-4 h-4 mr-2" />
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-gray-800/50 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="flex items-center text-sm font-medium mb-1">
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-gray-800/50 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center text-sm font-medium mb-1">
                          <Building2 className="w-4 h-4 mr-2" />
                          Company (Optional)
                        </label>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full bg-gray-800/50 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                          placeholder="Your company"
                        />
                      </div>
                      <div>
                        <label className="flex items-center text-sm font-medium mb-1">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message (Optional)
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full bg-gray-800/50 rounded-lg p-3 focus:ring-2 focus:ring-blue-500"
                          placeholder="Any additional information..."
                          rows={4}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 0 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePrevStep}
                  className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                >
                  Previous
                </motion.button>
              )}
              {currentStep < steps.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextStep}
                  className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors ml-auto flex items-center"
                >
                  Next
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    →
                  </motion.div>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors ml-auto flex items-center"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      Processing
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="ml-2"
                      >
                        ⚡
                      </motion.div>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Book Meeting
                      <Send className="w-4 h-4 ml-2" />
                    </span>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Booking;