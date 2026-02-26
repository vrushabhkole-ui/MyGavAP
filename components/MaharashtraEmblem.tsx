
import React from 'react';

interface MaharashtraEmblemProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  showText?: boolean;
}

const MaharashtraEmblem: React.FC<MaharashtraEmblemProps> = ({ size = 'md', theme = 'dark', showText = true }) => {
  const dimensions = {
    sm: 'h-10 w-10',
    md: 'h-20 w-20',
    lg: 'h-32 w-32'
  };

  const textClass = theme === 'dark' ? 'text-slate-900' : 'text-white';
  const subTextClass = theme === 'dark' ? 'text-slate-500' : 'text-white/70';

  return (
    <div className={`flex ${size === 'sm' ? 'flex-row' : 'flex-col'} items-center gap-4`}>
      <div className={`${dimensions[size]} flex-shrink-0 flex items-center justify-center relative bg-white rounded-2xl p-1 shadow-sm border border-slate-200`}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/e/e3/Seal_of_Maharashtra.svg" 
          alt="Government of Maharashtra"
          className="w-full h-full object-contain relative z-10 filter grayscale brightness-0"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback to a text-based emblem if image fails
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
           <div className="w-full h-full rounded-full bg-slate-400 animate-pulse"></div>
        </div>
      </div>
      {showText && (
        <div className={`flex flex-col ${size === 'sm' ? 'items-start' : 'items-center text-center'}`}>
          <span className={`text-[10px] font-black uppercase tracking-[0.25em] leading-none ${textClass}`}>
            Government of Maharashtra
          </span>
          <span className={`text-[11px] font-black uppercase tracking-[0.2em] mt-2 ${subTextClass} opacity-80`}>
            महाराष्ट्र शासन
          </span>
        </div>
      )}
    </div>
  );
};

export default MaharashtraEmblem;
