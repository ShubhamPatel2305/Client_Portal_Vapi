import React from 'react';

const TopedgeLogo: React.FC = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <img
        src="/topedge-logo.png"
        alt="Topedge Logo"
        className="h-10 w-auto"
        onError={(e) => {
          // Fallback if image fails to load
          const target = e.target as HTMLElement;
          target.style.display = 'none';
        }}
      />
      <span className="text-3xl font-bold text-white">Topedge</span>
    </div>
  );
};

export default TopedgeLogo;
