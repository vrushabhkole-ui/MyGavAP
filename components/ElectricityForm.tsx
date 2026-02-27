
import React, { useState } from 'react';
import { ChevronLeft, Zap, Send, Hash, Phone, FileText } from 'lucide-react';
import { Language, ServiceType } from '../types';
import { DICTIONARY } from '../constants';

interface ElectricityFormProps {
  lang: Language;
  onBack: () => void;
  onSubmit: (serviceId: ServiceType, description: string, data: any) => void;
}

const ElectricityForm: React.FC<ElectricityFormProps> = ({ lang, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    consumerNumber: '',
    billingUnit: '',
    issueType: 'Bill Correction',
    description: '',
    mobile: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const description = `[Elec] ${formData.issueType}, No: ${formData.consumerNumber}, BU: ${formData.billingUnit}, Mob: ${formData.mobile}`;
    onSubmit(ServiceType.ELECTRICITY, description, formData);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-slide-in">
      <header className="flex-shrink-0 px-5 py-4 bg-white border-b border-slate-100 flex items-center gap-4 z-10">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl text-slate-400"><ChevronLeft size={24} /></button>
        <h1 className="text-base font-black text-slate-800 tracking-tight">Electricity Support</h1>
      </header>
      <div className="flex-1 p-5 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4 pb-10">
          <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Consumer Number</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <Hash size={18} className="text-slate-400" />
                <input required type="text" placeholder="12-digit number" className="bg-transparent outline-none text-sm w-full font-bold" value={formData.consumerNumber} onChange={(e) => setFormData({...formData, consumerNumber: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">BU Code (Billing Unit)</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <Zap size={18} className="text-slate-400" />
                <input required type="text" placeholder="Enter BU Code" className="bg-transparent outline-none text-sm w-full font-bold" value={formData.billingUnit} onChange={(e) => setFormData({...formData, billingUnit: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Problem Category</label>
              <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-sm font-bold appearance-none outline-none focus:border-blue-500 transition-all" value={formData.issueType} onChange={(e) => setFormData({...formData, issueType: e.target.value})}>
                <option>Bill Correction</option>
                <option>New Meter Connection</option>
                <option>Meter Replacement</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Contact Mobile</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <Phone size={18} className="text-slate-400" />
                <input required type="tel" placeholder="Mobile Number" className="bg-transparent outline-none text-sm w-full font-bold" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
              </div>
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 shadow-sm uppercase tracking-widest active:scale-95 transition-all">
            <Send size={18} /> Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};

export default ElectricityForm;
