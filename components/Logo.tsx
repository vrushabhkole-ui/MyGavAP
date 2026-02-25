
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions = {
    sm: 'h-6 w-6',
    md: 'h-9 w-9',
    lg: 'h-12 w-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-2.5">
      <div className={`${dimensions[size]} bg-emerald-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-100`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-3/5 h-3/5"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
          <path d="M12 2v20" className="opacity-40" />
          <circle cx="12" cy="7" r="1.5" fill="white" stroke="none" />
        </svg>
      </div>
      <span className={`${textSizes[size]} font-extrabold tracking-tight text-slate-800`}>
        My<span className="text-emerald-600">Gaav</span>
      </span>
    </div>
  );
};

export default Logo;
