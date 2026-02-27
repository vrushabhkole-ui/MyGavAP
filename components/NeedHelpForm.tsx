
import React, { useState } from 'react';
import { ChevronLeft, Send, Info, AlertCircle } from 'lucide-react';
import { Language, ServiceType, ServiceInfo } from '../types.ts';
import { DICTIONARY } from '../constants.tsx';

interface NeedHelpFormProps {
  lang: Language;
  service: ServiceInfo;
  onBack: () => void;
  onSubmit: (serviceId: ServiceType, description: string) => void;
}

const NeedHelpForm: React.FC<NeedHelpFormProps> = ({ lang, service, onBack, onSubmit }) => {
  const [description, setDescription] = useState('');
  const t = (key: string) => DICTIONARY[key]?.[lang] || key;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit(service.id, `[HELP REQUEST] ${description}`);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-slide-in">
      <header className="flex-shrink-0 px-6 py-6 bg-white border-b border-slate-100 flex items-center gap-4 z-10 shadow-sm">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl text-slate-400 active:scale-90 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-base font-black text-slate-800 tracking-tight">{t('needHelp')}</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{service.title[lang]}</p>
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto hide-scrollbar">
        <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-3xl mb-8 flex gap-4">
          <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
             <Info size={20} />
          </div>
          <p className="text-[11px] font-bold text-indigo-700 leading-relaxed uppercase tracking-tight">
            {t('helpDescriptionInfo')} {service.title[lang]} {t('helpDescriptionInfoSuffix')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          <div className="space-y-3">
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">{t('issueDescription')}</label>
             <div className="bg-white rounded-[32px] p-2 border border-slate-100 shadow-sm focus-within:border-emerald-400 transition-all">
                <textarea 
                  rows={8} 
                  required
                  className="w-full bg-transparent p-4 text-sm font-bold outline-none resize-none placeholder:text-slate-300"
                  placeholder={t('helpDescriptionPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
             </div>
          </div>

          <div className="p-4 bg-slate-100 rounded-2xl flex items-center gap-3 text-slate-400">
             <AlertCircle size={16} />
             <p className="text-[9px] font-black uppercase tracking-widest">{t('avgResponseTime')}</p>
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-5 rounded-[28px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Send size={20} /> {t('sendHelpRequest')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NeedHelpForm;
