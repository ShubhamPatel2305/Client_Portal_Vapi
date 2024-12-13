import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  firstName: string;
}

const menuVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.2,
      ease: "easeOut"
    }
  })
};

export default function ProfileMenu({ isOpen, onClose, firstName }: ProfileMenuProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    {
      icon: Settings,
      label: 'Account Settings',
      onClick: () => {
        navigate('/settings');
        onClose();
      }
    },
    {
      icon: LogOut,
      label: 'Logout',
      onClick: handleLogout,
      className: 'text-red-600 hover:bg-red-50'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute bottom-full mb-2 right-0 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Profile Header */}
          <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={firstName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-medium">{firstName}</h3>
                <p className="text-sm text-white/80">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                className={`w-full px-4 py-2 text-sm flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                  item.className || 'text-gray-700 hover:text-gray-900'
                }`}
                onClick={item.onClick}
                variants={itemVariants}
                custom={index}
                initial="hidden"
                animate="visible"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
