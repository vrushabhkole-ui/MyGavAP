
import React from 'react';

interface MaharashtraEmblemProps {
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  showText?: boolean;
}

const MaharashtraEmblem: React.FC<MaharashtraEmblemProps> = ({ size = 'md', theme = 'dark', showText = true }) => {
  const textClass = theme === 'dark' ? 'text-slate-900' : 'text-white';
  const subTextClass = theme === 'dark' ? 'text-slate-500' : 'text-white/70';

  const textSizes = {
    sm: { main: 'text-[9px]', sub: 'text-[10px]' },
    md: { main: 'text-[11px]', sub: 'text-[12px]' },
    lg: { main: 'text-[13px]', sub: 'text-[14px]' }
  };

  if (!showText) return null;

  return (
    <div className="flex flex-col items-center text-center">
      <span className={`${textSizes[size].main} font-black uppercase tracking-[0.25em] leading-none ${textClass}`}>
        Government of Maharashtra
      </span>
      <span className={`${textSizes[size].sub} font-black uppercase tracking-[0.2em] mt-2 ${subTextClass} opacity-80`}>
        महाराष्ट्र शासन
      </span>
    </div>
  );
};

export default MaharashtraEmblem;
