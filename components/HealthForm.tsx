
import React, { useState } from 'react';
import { ChevronLeft, HeartPulse, Send, User, Phone, Calendar, Info, Activity } from 'lucide-react';
import { Language, ServiceType } from '../types';
import { DICTIONARY } from '../constants';

interface HealthFormProps {
  lang: Language;
  portalIdx: number;
  onBack: () => void;
  onSubmit: (serviceId: ServiceType, description: string, data: any) => void;
}

const HealthForm: React.FC<HealthFormProps> = ({ lang, portalIdx, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: 'Male',
    mobile: '',
    symptoms: '',
    preferredDate: '',
    healthId: ''
  });

  const t = (key: string) => DICTIONARY[key]?.[lang] || key;

  const typeLabels = [
    { en: 'OPD Registration', hi: 'ओपीडी पंजीकरण', mr: 'ओपीडी नोंदणी' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentType = typeLabels[0][lang];
    const description = `[${currentType}] Patient: ${formData.patientName}, Age: ${formData.age}, Symptoms/Reason: ${formData.symptoms}`;
    onSubmit(ServiceType.HEALTH, description, formData);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-slide-in">
      <header className="flex-shrink-0 px-5 py-4 bg-white border-b border-slate-100 flex items-center gap-4 z-10">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl text-slate-400">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-base font-black text-slate-800 tracking-tight">{typeLabels[portalIdx][lang]}</h1>
      </header>

      <div className="flex-1 p-5 overflow-y-auto hide-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          <div className="bg-rose-50 p-4 rounded-3xl flex gap-3 border border-rose-100">
             <Info size={20} className="text-rose-600 shrink-0" />
             <p className="text-[10px] font-bold text-rose-700 leading-relaxed uppercase tracking-wide">
               Your request will be sent to the Primary Health Center (PHC). You will receive a confirmation message shortly.
             </p>
          </div>

          <div className="bg-white rounded-[32px] p-6 border border-slate-100 space-y-5 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Patient Full Name</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                <User size={18} className="text-slate-400" />
                <input required placeholder="Full Name" className="bg-transparent outline-none text-sm w-full font-bold text-slate-800" value={formData.patientName} onChange={(e) => setFormData({...formData, patientName: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Age</label>
                <input required type="number" placeholder="Years" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Gender</label>
                <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none appearance-none" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Mobile Number</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                <Phone size={18} className="text-slate-400" />
                <input required type="tel" placeholder="Contact Mobile" className="bg-transparent outline-none text-sm w-full font-bold text-slate-800" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                Symptoms / Reason
              </label>
              <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                <Activity size={18} className="text-slate-400 mt-1" />
                <textarea required rows={3} placeholder="Provide details here..." className="bg-transparent outline-none text-sm w-full font-bold resize-none text-slate-800" value={formData.symptoms} onChange={(e) => setFormData({...formData, symptoms: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Preferred Date</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                <Calendar size={18} className="text-slate-400" />
                <input required type="date" className="bg-transparent outline-none text-sm w-full font-bold text-slate-800" value={formData.preferredDate} onChange={(e) => setFormData({...formData, preferredDate: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-rose-600 text-white py-5 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-rose-100 uppercase tracking-widest active:scale-95 transition-all">
            <HeartPulse size={20} /> Submit Health Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default HealthForm;
