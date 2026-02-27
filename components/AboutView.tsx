
import React from 'react';
import { Mail, ShieldCheck, User, Code, Info, Download, Globe } from 'lucide-react';
import Logo from './Logo';
import MaharashtraEmblem from './MaharashtraEmblem';

const AboutView: React.FC = () => {
  return (
    <div className="h-full bg-slate-50 flex flex-col animate-slide-in overflow-y-auto hide-scrollbar">
      <div className="p-10 flex flex-col items-center text-center space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Logo size="lg" />
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter">MyGaav</h2>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em]">Digital Village Hub</p>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-xs font-bold">
                <div className="flex items-center gap-2 text-slate-400">
                  <Info size={16} />
                  <span>Version</span>
                </div>
                <span className="text-slate-800 font-mono">2.1.0-stable</span>
            </div>
            <div className="h-px bg-slate-50"></div>
            <div className="flex justify-between items-center text-xs font-bold">
                <div className="flex items-center gap-2 text-slate-400">
                  <Code size={16} />
                  <span>Developed by</span>
                </div>
                <span className="text-emerald-600 font-black">V.M.KOLE</span>
            </div>
          </div>

          <div className="space-y-2">
            <a 
              href="https://drive.google.com/file/d/1sAwF9oS6mBoTRiE0bsYaWidj_oHqSSwi/view?usp=drive_link" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download size={16} />
                </div>
                <span className="text-xs font-black text-slate-800">Download App</span>
              </div>
              <Download size={14} className="text-slate-300" />
            </a>

            <a 
              href="https://www.mygaav.site/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:bg-slate-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe size={16} />
                </div>
                <span className="text-xs font-black text-slate-800">Go to App Web</span>
              </div>
              <Globe size={14} className="text-slate-300" />
            </a>
          </div>

          <div className="bg-emerald-600 p-6 rounded-[32px] shadow-lg shadow-emerald-100 text-white space-y-3">
             <div className="flex items-center gap-3 justify-center">
                <Mail size={20} />
                <span className="text-sm font-black tracking-tight">vkole357@gmail.com</span>
             </div>
             <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Contact for Support</p>
          </div>
        </div>

        <div className="pt-10 flex flex-col items-center space-y-6">
           <MaharashtraEmblem size="lg" theme="dark" />
           <div className="max-w-[240px]">
             <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest">
               Empowering rural communities through decentralized digital governance.
             </p>
           </div>
        </div>

        <div className="pt-8 opacity-20">
           <ShieldCheck size={32} className="text-slate-400" />
        </div>
      </div>
    </div>
  );
};

export default AboutView;
