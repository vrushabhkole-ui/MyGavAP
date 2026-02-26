
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
      <div className={`${dimensions[size]} bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100 overflow-hidden`}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Seal_of_Maharashtra.svg/512px-Seal_of_Maharashtra.svg.png" 
          alt="Maharashtra Seal"
          className="w-4/5 h-4/5 object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
      <span className={`${textSizes[size]} font-extrabold tracking-tight text-slate-800`}>
        My<span className="text-emerald-600">Gaav</span>
      </span>
    </div>
  );
};

export default Logo;
