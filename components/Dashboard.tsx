
import React, { useState } from 'react';
import { Bell, Sparkles, CreditCard, ChevronRight, Info, Megaphone, ExternalLink, MapPin, X, Calendar, BadgeCheck, Sun, Droplets, Wind, Thermometer, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import Logo from './Logo.tsx';
import { SERVICES, getIcon, DICTIONARY } from '../constants.tsx';
import { ServiceType, Language, UserProfile, Bill, VillageNotice } from '../types.ts';
import LiveWeather from './LiveWeather.tsx';

interface DashboardProps {
  lang: Language;
  user: UserProfile;
  bills: Bill[];
  notices: VillageNotice[];
  selectedVillages: string[];
  onSetLang: (lang: Language) => void;
  onSelectService: (id: ServiceType) => void;
  onOpenNotifications: () => void;
  onAddVillage: (village: string) => void;
  onRemoveVillage: (village: string) => void;
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

const Dashboard: React.FC<DashboardProps> = ({ 
  lang, user, bills, notices, selectedVillages, 
  onSetLang, onSelectService, onOpenNotifications, onAddVillage, onRemoveVillage, 
  hasUnread 
}) => {
  const [expandedWeatherIdx, setExpandedWeatherIdx] = useState<number | null>(null);
  const [showAddVillage, setShowAddVillage] = useState(false);
  const [newVillageName, setNewVillageName] = useState('');
  const [showAllServices, setShowAllServices] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<VillageNotice | null>(null);

  const t = (key: string) => DICTIONARY[key]?.[lang] || key;
  const unpaidBills = bills.filter(b => b.status === 'Unpaid' && b.type !== 'Electricity');

  const handleAddVillage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVillageName.trim()) {
      onAddVillage(newVillageName.trim());
      setNewVillageName('');
      setShowAddVillage(false);
    }
  };

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
        {/* LIVE WEATHER SECTION */}
        <div className="px-5 mt-4 space-y-4">
          <div className="flex items-center justify-between px-1">
             <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('liveWeather')}</h2>
             <button 
               onClick={() => setShowAddVillage(true)}
               className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
               title={t('addVillage')}
             >
               <Plus size={14} />
             </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x">
            {selectedVillages.map((v, idx) => (
              <div key={v} className="min-w-[280px] snap-center relative group">
                <LiveWeather 
                  village={v} 
                  lang={lang}
                  isExpanded={expandedWeatherIdx === idx} 
                  onToggle={() => setExpandedWeatherIdx(expandedWeatherIdx === idx ? null : idx)} 
                />
                {selectedVillages.length > 1 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveVillage(v);
                    }}
                    className="absolute -top-2 -right-2 bg-white text-rose-500 p-1.5 rounded-full shadow-md border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {showAddVillage && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[32px] p-8 w-full max-w-xs shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
              <div className="text-center space-y-1">
                <h3 className="text-xl font-black text-slate-800">{t('addVillage')}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('trackWeather')}</p>
              </div>
              <form onSubmit={handleAddVillage} className="space-y-4">
                <input 
                  autoFocus
                  type="text" 
                  placeholder={t('enterVillageName')} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-emerald-500 transition-colors"
                  value={newVillageName}
                  onChange={(e) => setNewVillageName(e.target.value)}
                />
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddVillage(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest"
                  >
                    {t('cancel')}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100"
                  >
                    {t('add')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
          <div className="flex items-center justify-between mb-5 px-1">
            <h2 className="text-base font-black text-slate-800 tracking-tight uppercase tracking-widest text-[11px]">{t('mainPortals')}</h2>
            <button 
              onClick={() => setShowAllServices(!showAllServices)}
              className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
            >
              {showAllServices ? (
                <>
                  {t('lessServices')} <ChevronUp size={12} strokeWidth={3} />
                </>
              ) : (
                <>
                  {t('moreServices')} <ChevronDown size={12} strokeWidth={3} />
                </>
              )}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {(showAllServices ? SERVICES : SERVICES.slice(0, 3)).map((service) => (
              <button
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className="bg-white p-6 rounded-[36px] shadow-sm border border-slate-100 text-left flex items-center gap-5 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-50 transition-all active:scale-[0.98] group animate-in fade-in slide-in-from-bottom-2 duration-300"
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
