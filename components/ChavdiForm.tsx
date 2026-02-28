
import React, { useState, useRef } from 'react';
import { ChevronLeft, FileText, Send, MapPin, Hash, User, Building, UploadCloud, CheckCircle, Info, ArrowRight } from 'lucide-react';
import { Language, ServiceType, FileMetadata } from '../types.ts';
import { DICTIONARY } from '../constants.tsx';

interface ChavdiFormProps {
  lang: Language;
  portalIdx: number;
  onBack: () => void;
  onSubmit: (serviceId: ServiceType, description: string, userDoc?: FileMetadata) => void;
}

const ChavdiForm: React.FC<ChavdiFormProps> = ({ lang, portalIdx, onBack, onSubmit }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userDoc, setUserDoc] = useState<FileMetadata | null>(null);
  
  // 0: Satbara, 1: 8A, 2: Ferfar
  const typeLabels = [
    { en: 'Satbara (7/12)', hi: 'सातबारा', mr: 'सातबारा' },
    { en: '8A Holding', hi: '8अ होल्डिंग', mr: '८अ उतारा' },
    { en: 'Ferfar (Mutation)', hi: 'फेरफार', mr: 'फेरफार' }
  ];

  const [formData, setFormData] = useState({
    district: 'Pune',
    taluka: 'Haveli',
    village: 'Sukhawadi',
    gatNumber: '',
    fullName: '',
    khateNumber: '', // For 8A
    mutationType: 'Inheritance', // For Ferfar
    mutationReason: '' // For Ferfar
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let description = '';
    const currentType = typeLabels[portalIdx][lang];

    if (portalIdx === 0) { // Satbara
      description = `[${currentType}] Gat: ${formData.gatNumber}, Village: ${formData.village}, Owner: ${formData.fullName}`;
    } else if (portalIdx === 1) { // 8A
      description = `[${currentType}] Khate No: ${formData.khateNumber}, Village: ${formData.village}, Holder: ${formData.fullName}`;
    } else { // Ferfar
      description = `[${currentType}] Type: ${formData.mutationType}, Gat: ${formData.gatNumber}, Reason: ${formData.mutationReason}`;
    }

    onSubmit(ServiceType.CHAVDI, description, userDoc || undefined);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-slide-in">
      {/* FIXED HEADER */}
      <header className="flex-shrink-0 px-5 py-4 bg-white border-b border-slate-100 flex items-center gap-4 z-10">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl text-slate-400">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-base font-black text-slate-800 tracking-tight">{typeLabels[portalIdx][lang]}</h1>
      </header>

      {/* SCROLLABLE FORM AREA */}
      <div className="flex-1 p-5 overflow-y-auto hide-scrollbar">
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          <div className="bg-indigo-50 p-4 rounded-3xl flex gap-3 border border-indigo-100">
             <Info size={20} className="text-indigo-600 shrink-0" />
             <p className="text-[10px] font-bold text-indigo-700 leading-relaxed uppercase tracking-wide">
               This request will be processed by the Talathi / Revenue Department. You will receive a digital copy once verified.
             </p>
          </div>

          <div className="bg-white rounded-[32px] p-6 border border-slate-100 space-y-5 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Village (Gaav)</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                <MapPin size={18} className="text-slate-400" />
                <input required type="text" placeholder="Village Name" className="bg-transparent outline-none text-sm w-full font-bold text-slate-800" value={formData.village} onChange={(e) => setFormData({...formData, village: e.target.value})} />
              </div>
            </div>

            {portalIdx === 1 ? (
              /* 8A Specific Field */
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Khate Number (Account No)</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <Hash size={18} className="text-slate-400" />
                  <input required type="text" placeholder="Account Number" className="bg-transparent outline-none text-sm w-full font-bold text-slate-800" value={formData.khateNumber} onChange={(e) => setFormData({...formData, khateNumber: e.target.value})} />
                </div>
              </div>
            ) : (
              /* Satbara & Ferfar use Gat Number */
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Gat / Survey Number</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <Hash size={18} className="text-slate-400" />
                  <input required type="text" placeholder="e.g. 45/A" className="bg-transparent outline-none text-sm w-full font-bold text-slate-800" value={formData.gatNumber} onChange={(e) => setFormData({...formData, gatNumber: e.target.value})} />
                </div>
              </div>
            )}

            {portalIdx === 2 ? (
              /* Ferfar Specific Fields */
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Mutation Type</label>
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none appearance-none" value={formData.mutationType} onChange={(e) => setFormData({...formData, mutationType: e.target.value})}>
                    <option value="Inheritance">Varas (Inheritance)</option>
                    <option value="Sale">Karedi (Sale Deed)</option>
                    <option value="Gift">Bakshis (Gift)</option>
                    <option value="Mortgage">Bogja (Mortgage)</option>
                    <option value="Division">Watp (Division)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Details / Remarks</label>
                  <textarea rows={3} placeholder="Describe the mutation reason..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none resize-none" value={formData.mutationReason} onChange={(e) => setFormData({...formData, mutationReason: e.target.value})} />
                </div>
              </>
            ) : (
              /* Satbara & 8A use Full Name */
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Full Name (As per records)</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <User size={18} className="text-slate-400" />
                  <input required type="text" placeholder="Full Name" className="bg-transparent outline-none text-sm w-full font-bold text-slate-800" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                </div>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Supporting Documents</label>
              <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
                 const file = e.target.files?.[0];
                 if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setUserDoc({ name: file.name, url: reader.result as string, type: file.type });
                    reader.readAsDataURL(file);
                 }
              }} />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${userDoc ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200 hover:border-indigo-300'}`}
              >
                 {userDoc ? (
                   <>
                      <CheckCircle size={32} className="text-emerald-600" />
                      <p className="text-xs font-black text-emerald-800 truncate max-w-full px-4">{userDoc.name}</p>
                   </>
                 ) : (
                   <>
                      <UploadCloud size={32} className="text-slate-200" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center leading-loose">Upload ID or Old Document</p>
                   </>
                 )}
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-amber-600 text-white py-5 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-amber-100 uppercase tracking-widest active:scale-95 transition-all">
            <Send size={18} /> Request Document
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChavdiForm;
