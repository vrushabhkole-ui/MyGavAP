
import React, { useState } from 'react';
import { ChevronLeft, Flame, Send, Hash, Phone } from 'lucide-react';
import { Language, ServiceType } from '../types';

interface GasFormProps {
  lang: Language;
  onBack: () => void;
  onSubmit: (serviceId: ServiceType, description: string, data: any) => void;
}

const GasForm: React.FC<GasFormProps> = ({ lang, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    agency: 'HP Gas',
    consumerId: '',
    bookingType: 'Refill',
    mobile: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const description = `[Gas] ${formData.bookingType}, Agency: ${formData.agency}, ID: ${formData.consumerId}`;
    onSubmit(ServiceType.GAS, description, formData);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-slide-in">
      <header className="flex-shrink-0 px-5 py-4 bg-white border-b border-slate-100 flex items-center gap-4 z-10">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl text-slate-400"><ChevronLeft size={24} /></button>
        <h1 className="text-base font-black text-slate-800 tracking-tight">Gas Service Hub</h1>
      </header>
      <div className="flex-1 p-5 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4 pb-10">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">LPG Agency</label>
              <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm font-bold outline-none" value={formData.agency} onChange={(e) => setFormData({...formData, agency: e.target.value})}>
                <option>HP Gas (Sukhawadi)</option>
                <option>Indane Gas</option>
                <option>Bharat Gas</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Consumer Number</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <Hash size={18} className="text-slate-400" />
                <input required type="text" placeholder="Enter Consumer ID" className="bg-transparent outline-none text-sm w-full font-bold" value={formData.consumerId} onChange={(e) => setFormData({...formData, consumerId: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Service Requested</label>
              <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm font-bold outline-none" value={formData.bookingType} onChange={(e) => setFormData({...formData, bookingType: e.target.value})}>
                <option>Refill Booking</option>
                <option>New Gas Connection</option>
                <option>Safety Check / Leakage</option>
                <option>KYC Update</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Mobile Number</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <Phone size={18} className="text-slate-400" />
                <input required type="tel" placeholder="Contact Mobile" className="bg-transparent outline-none text-sm w-full font-bold" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
              </div>
            </div>
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 shadow-sm uppercase tracking-widest active:scale-95 transition-all">
            <Flame size={18} /> Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default GasForm;
