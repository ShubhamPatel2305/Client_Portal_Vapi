import toast from 'react-hot-toast';

export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toast[type](message, {
    position: 'bottom-right',
    duration: 2000, // 1 second
    style: {
      background: '#333',
      color: '#fff',
      borderRadius: '10px',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '500',
    },
  });
};
