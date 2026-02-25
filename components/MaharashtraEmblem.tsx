
import React from 'react';

interface MaharashtraEmblemProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  showText?: boolean;
}

const MaharashtraEmblem: React.FC<MaharashtraEmblemProps> = ({ size = 'md', theme = 'dark', showText = true }) => {
  const dimensions = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  const textClass = theme === 'dark' ? 'text-slate-900' : 'text-white';
  const subTextClass = theme === 'dark' ? 'text-slate-500' : 'text-white/70';

  return (
    <div className="flex items-center gap-3">
      <div className={`${dimensions[size]} flex-shrink-0 shadow-sm rounded-full bg-white/20 p-0.5`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill={theme === 'dark' ? '#f8fafc' : 'rgba(255,255,255,0.1)'} stroke={theme === 'dark' ? '#cbd5e1' : 'rgba(255,255,255,0.3)'} strokeWidth="2.5"/>
          <path d="M50 20V80M35 35H65M38 50H62M42 65H58" stroke="#b45309" strokeWidth="5" strokeLinecap="round"/>
          <circle cx="50" cy="30" r="6" fill="#b45309"/>
          <path d="M40 75C40 75 45 85 50 85C55 85 60 75 60 75" stroke="#b45309" strokeWidth="4" strokeLinecap="round"/>
          <text x="50" y="96" textAnchor="middle" fontSize="9" fontWeight="900" fill="#b45309">सत्यमेव जयते</text>
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`text-[10px] font-black uppercase tracking-[0.25em] leading-none ${textClass}`}>
            Government of Maharashtra
          </span>
          <span className={`text-[9px] font-black uppercase tracking-[0.2em] mt-1.5 ${subTextClass} opacity-80`}>
            महाराष्ट्र शासन
          </span>
        </div>
      )}
    </div>
  );
};

export default MaharashtraEmblem;
