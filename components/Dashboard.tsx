
import React, { useState } from 'react';
import { Bell, Sparkles, CreditCard, ChevronRight, Info, Megaphone, ExternalLink, MapPin, X, Calendar, BadgeCheck, Sun, Droplets, Wind, Thermometer, ChevronDown, ChevronUp } from 'lucide-react';
import Logo from './Logo.tsx';
import { SERVICES, getIcon, DICTIONARY } from '../constants.tsx';
import { ServiceType, Language, UserProfile, Bill, VillageNotice } from '../types.ts';

interface DashboardProps {
  lang: Language;
  user: UserProfile;
  bills: Bill[];
  notices: VillageNotice[];
  onSetLang: (lang: Language) => void;
  onSelectService: (id: ServiceType) => void;
  onOpenNotifications: () => void;
  hasUnread: boolean;
}

const NoticeDetailModal: React.FC<{ notice: VillageNotice; onClose: () => void; lang: Language }> = ({ notice, onClose, lang }) => {
  const t = (key: string) => DICTIONARY[key]?.[lang] || key;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="bg-indigo-100 text-indigo-600 p-4 rounded-2xl">
              <Megaphone size={28} />
            </div>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-black text-indigo-600 px-3 py-1 bg-indigo-50 rounded-full uppercase tracking-widest">{notice.category}</span>
            <h2 className="text-2xl font-black text-slate-800 leading-tight pt-2">{notice.title}</h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 pt-1">
               <Calendar size={12} />
               <span>Published on {notice.date}</span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
             <p className="text-sm font-bold text-slate-600 leading-relaxed whitespace-pre-wrap">
               {notice.content}
             </p>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all"
          >
            {t('acknowledge')}
          </button>
        </div>
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
           <BadgeCheck size={12} className="text-emerald-500" />
           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{t('officialVillageAnnouncement')}</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ lang, user, bills, notices, onSetLang, onSelectService, onOpenNotifications, hasUnread }) => {
  const [selectedNotice, setSelectedNotice] = useState<VillageNotice | null>(null);
  const [isWeatherExpanded, setIsWeatherExpanded] = useState(false);
  const t = (key: string) => DICTIONARY[key]?.[lang] || key;
  const unpaidBills = bills.filter(b => b.status === 'Unpaid' && b.type !== 'Electricity');

  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) + ', ' + 
                        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const weatherForecast = [
    { day: 'Tomorrow', temp: '31°C', icon: <Sun size={14} className="text-amber-400" /> },
    { day: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short' }), temp: '29°C', icon: <Droplets size={14} className="text-blue-400" /> },
    { day: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { weekday: 'short' }), temp: '30°C', icon: <Sun size={14} className="text-amber-400" /> },
  ];

  return (
    <div className="flex flex-col h-full animate-slide-in relative">
      {/* FIXED HEADER */}
      <div className="flex-shrink-0 z-30 bg-white border-b border-slate-100 shadow-sm">
        <header className="px-5 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Logo size="md" />
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button onClick={() => onSetLang('en')} className={`px-3 py-1 rounded-lg text-[10px] font-black ${lang === 'en' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>EN</button>
                <button onClick={() => onSetLang('hi')} className={`px-3 py-1 rounded-lg text-[10px] font-black ${lang === 'hi' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>HI</button>
                <button onClick={() => onSetLang('mr')} className={`px-3 py-1 rounded-lg text-[10px] font-black ${lang === 'mr' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>MR</button>
              </div>
              <button onClick={onOpenNotifications} className="relative p-2 text-slate-400 bg-slate-50 rounded-xl">
                <Bell size={20} />
                {hasUnread && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white"></span>}
              </button>
            </div>
          </div>
          <h1 className="text-xl font-black text-slate-800 leading-none">{t('welcome')} {user.name.split(' ')[0]}!</h1>
        </header>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto pb-10 hide-scrollbar">
        {/* EXPANDABLE WEATHER WIDGET */}
        <div className="px-5 mt-4">
          <div 
            onClick={() => setIsWeatherExpanded(!isWeatherExpanded)}
            className={`bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[32px] p-6 text-white shadow-lg relative overflow-hidden transition-all duration-500 cursor-pointer ${isWeatherExpanded ? 'h-auto' : 'h-28'}`}
          >
            <div className="relative z-10 flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                   <h3 className="text-3xl font-black">28°C</h3>
                   <span className="text-xs font-bold opacity-60">Clear Sky</span>
                </div>
                <div className="flex items-center gap-1 opacity-80">
                  <MapPin size={10} />
                  <p className="text-[10px] font-bold truncate max-w-[140px] uppercase tracking-widest">{user.village}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/10 mb-2">
                  <Sun size={20} className="text-amber-300" />
                </div>
                <p className="text-[9px] uppercase font-black opacity-60 tracking-widest">{formattedDate}</p>
              </div>
            </div>

            {isWeatherExpanded && (
              <div className="relative z-10 mt-6 pt-6 border-t border-white/10 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-white/10 p-3 rounded-2xl flex flex-col items-center gap-1">
                    <Droplets size={14} className="text-blue-300" />
                    <span className="text-[10px] font-black">45%</span>
                    <span className="text-[8px] opacity-60 uppercase">Humidity</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl flex flex-col items-center gap-1">
                    <Wind size={14} className="text-slate-300" />
                    <span className="text-[10px] font-black">12 km/h</span>
                    <span className="text-[8px] opacity-60 uppercase">Wind</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl flex flex-col items-center gap-1">
                    <Thermometer size={14} className="text-rose-300" />
                    <span className="text-[10px] font-black">34°C</span>
                    <span className="text-[8px] opacity-60 uppercase">Feels Like</span>
                  </div>
                </div>

                <div className="space-y-3">
                   <p className="text-[9px] font-black uppercase tracking-widest opacity-60">3-Day Forecast</p>
                   <div className="space-y-2">
                      {weatherForecast.map((f, i) => (
                        <div key={i} className="flex items-center justify-between bg-white/5 px-4 py-2 rounded-xl">
                           <span className="text-[10px] font-bold">{f.day}</span>
                           <div className="flex items-center gap-3">
                              {f.icon}
                              <span className="text-[10px] font-black">{f.temp}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-30">
               {isWeatherExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>
        </div>

        {/* SCROLLABLE NOTICES SECTION */}
        {notices.length > 0 && (
          <div className="px-5 mt-6">
             <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-sm font-black text-slate-800 flex items-center gap-3 uppercase tracking-widest text-[11px]">
                  <Megaphone size={16} className="text-indigo-600" /> {t('recentNotices')}
                </h2>
                <button className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">View All</button>
             </div>
             <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1 hide-scrollbar">
                {notices.map(notice => (
                  <button 
                    key={notice.id} 
                    onClick={() => setSelectedNotice(notice)}
                    className="w-full text-left bg-white border border-slate-100 rounded-[28px] p-5 flex gap-4 shadow-sm hover:border-indigo-200 transition-all active:scale-[0.98] group"
                  >
                     <div className="bg-slate-50 text-indigo-600 p-3.5 rounded-2xl flex-shrink-0 h-fit group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Info size={18} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[8px] font-black px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full uppercase tracking-wider">{notice.category}</span>
                           <span className="text-[9px] text-slate-300 font-bold">{notice.date}</span>
                        </div>
                        <h4 className="text-[13px] font-black text-slate-800 leading-tight mb-1">{notice.title}</h4>
                        <p className="text-[10px] font-bold text-slate-400 line-clamp-1 italic">"{notice.content}"</p>
                        <div className="mt-2 flex items-center gap-1 text-[9px] font-black text-indigo-400 uppercase tracking-widest group-hover:text-indigo-600">
                           Read More <ChevronRight size={10} strokeWidth={3} />
                        </div>
                     </div>
                  </button>
                ))}
             </div>
          </div>
        )}

        {unpaidBills.length > 0 && (
          <div className="px-5 mt-8">
            <h2 className="text-[11px] font-black text-slate-800 mb-4 uppercase tracking-widest px-1">{t('pendingBills')}</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
              {unpaidBills.map(bill => (
                <div key={bill.id} className="min-w-[260px] bg-white rounded-[32px] p-6 border border-rose-100 shadow-sm flex flex-col h-full hover:border-rose-300 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[8px] font-black px-3 py-1 bg-rose-50 text-rose-600 rounded-full uppercase tracking-wider">{bill.type}</span>
                    <div className="text-right">
                       <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Due Date</p>
                       <p className="text-[10px] font-black text-slate-500 uppercase">{bill.dueDate}</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tighter">₹{bill.amount.toLocaleString('en-IN')}</h3>
                  {bill.description && <p className="text-[10px] font-bold text-slate-400 mt-2 line-clamp-2 leading-relaxed italic">"{bill.description}"</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-5 mt-8">
          <h2 className="text-base font-black text-slate-800 mb-5 tracking-tight uppercase tracking-widest text-[11px] px-1">{t('mainPortals')}</h2>
          <div className="grid grid-cols-1 gap-4">
            {SERVICES.map((service) => (
              <button
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className="bg-white p-6 rounded-[36px] shadow-sm border border-slate-100 text-left flex items-center gap-5 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-50 transition-all active:scale-[0.98] group"
              >
                <div className={`${service.color} w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  {getIcon(service.icon, 28)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-800 text-[15px] leading-tight">{service.title[lang]}</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tight line-clamp-1 opacity-80">
                    {service.description[lang]}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{t('enterPortal')}</span>
                    <ChevronRight size={12} strokeWidth={4} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedNotice && (
        <NoticeDetailModal 
          notice={selectedNotice} 
          lang={lang} 
          onClose={() => setSelectedNotice(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
