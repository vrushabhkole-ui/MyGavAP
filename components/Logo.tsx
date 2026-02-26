
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 24
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${dimensions[size]} bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50"></div>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-white relative z-10"
          style={{ width: iconSizes[size], height: iconSizes[size] }}
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
          <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
        </svg>
        <div className="absolute -bottom-1 -right-1 w-1/2 h-1/2 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all"></div>
      </div>
      <span className={`${textSizes[size]} font-black tracking-tighter text-slate-800 leading-none`}>
        My<span className="text-emerald-600">Gaav</span>
      </span>
    </div>
  );
};

export default Logo;
