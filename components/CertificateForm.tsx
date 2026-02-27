
import React, { useState, useRef } from 'react';
import { ChevronLeft, FileText, Send, Calendar, User, Phone, MapPin, UploadCloud, CheckCircle } from 'lucide-react';
import { Language, ServiceType, FileMetadata } from '../types';
import { DICTIONARY } from '../constants';

interface CertificateFormProps {
  lang: Language;
  onBack: () => void;
  onSubmit: (serviceId: ServiceType, description: string, userDoc?: FileMetadata) => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ lang, onBack, onSubmit }) => {
  const [type, setType] = useState<'birth' | 'death'>('birth');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userDoc, setUserDoc] = useState<FileMetadata | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    date: '',
    placeOfEvent: '',
    mobile: '',
    address: ''
  });

  const t = (key: string) => DICTIONARY[key]?.[lang] || key;

  const labels = {
    title: { en: 'Certificate', hi: 'प्रमाणपत्र', mr: 'प्रमाणपत्र' },
    birth: { en: 'Birth', hi: 'जन्म', mr: 'जन्म' },
    death: { en: 'Death', hi: 'मृत्यु', mr: 'मृत्यू' },
    fullName: { en: 'Full Name of Person', hi: 'व्यक्ति का पूरा नाम', mr: 'व्यक्तीचे पूर्ण नाव' },
    fatherName: { en: "Father's Name", hi: 'पिता का नाम', mr: 'वडिलांचे नाव' },
    motherName: { en: "Mother's Name", hi: 'माता का नाम', mr: 'आईचे नाव' },
    dob: { en: 'Date of Birth', hi: 'जन्म तिथि', mr: 'जन्मतारीख' },
    dod: { en: 'Date of Death', hi: 'मृत्यु तिथि', mr: 'मृत्यूची तारीख' },
    place: { en: 'Place of Event (Hospital/Home)', hi: 'घटना का स्थान', mr: 'घटनेचे ठिकाण' },
    mobile: { en: 'Mobile', hi: 'मोबाईल', mr: 'मोबाईल' },
    address: { en: 'Address', hi: 'पता', mr: 'पत्ता' },
    submit: { en: 'Submit Request', hi: 'जमा करें', mr: 'सादर करा' }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabel = labels[type][lang];
    const dateLabel = type === 'birth' ? labels.dob[lang] : labels.dod[lang];
    const description = `[${typeLabel}] Name: ${formData.name}, Father: ${formData.fatherName}, Mother: ${formData.motherName}, ${dateLabel}: ${formData.date}, Place: ${formData.placeOfEvent}, Mob: ${formData.mobile}`;
    onSubmit(ServiceType.GRAMPANCHAYAT, description, userDoc || undefined);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-slide-in">
      {/* FIXED HEADER */}
      <header className="flex-shrink-0 px-5 py-4 bg-white border-b border-slate-100 flex items-center gap-4 z-10">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl text-slate-400">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-base font-black text-slate-800 tracking-tight">{labels.title[lang]} Portal</h1>
      </header>

      {/* SCROLLABLE FORM AREA */}
      <div className="flex-1 p-5 overflow-y-auto">
        <form onSubmit={handleFormSubmit} className="space-y-5 pb-10">
          <div className="flex bg-slate-100 p-1.5 rounded-xl">
            <button 
              type="button"
              onClick={() => setType('birth')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${type === 'birth' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
            >
              <FileText size={14} /> {labels.birth[lang]}
            </button>
            <button 
              type="button"
              onClick={() => setType('death')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${type === 'death' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
            >
              <FileText size={14} /> {labels.death[lang]}
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{labels.fullName[lang]}</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <User size={18} className="text-slate-400" />
                <input required type="text" placeholder="Enter Full Name" className="bg-transparent outline-none text-sm w-full font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{labels.fatherName[lang]}</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                  <User size={18} className="text-slate-400 opacity-50" />
                  <input required type="text" placeholder="Father's Full Name" className="bg-transparent outline-none text-sm w-full font-bold" value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{labels.motherName[lang]}</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                  <User size={18} className="text-slate-400 opacity-50" />
                  <input required type="text" placeholder="Mother's Full Name" className="bg-transparent outline-none text-sm w-full font-bold" value={formData.motherName} onChange={(e) => setFormData({...formData, motherName: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{type === 'birth' ? labels.dob[lang] : labels.dod[lang]}</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <Calendar size={18} className="text-slate-400" />
                <input required type="date" className="bg-transparent outline-none text-sm w-full font-bold uppercase" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{labels.place[lang]}</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <MapPin size={18} className="text-slate-400" />
                <input required type="text" placeholder="Hospital Name or Home Address" className="bg-transparent outline-none text-sm w-full font-bold" value={formData.placeOfEvent} onChange={(e) => setFormData({...formData, placeOfEvent: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{labels.mobile[lang]}</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <Phone size={18} className="text-slate-400" />
                <input required type="tel" placeholder="Mobile Number" className="bg-transparent outline-none text-sm w-full font-bold" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{labels.address[lang]}</label>
              <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <MapPin size={18} className="text-slate-400 mt-0.5" />
                <textarea required rows={3} placeholder="Permanent Address" className="bg-transparent outline-none text-sm w-full font-medium" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 shadow-sm uppercase tracking-widest active:scale-95 transition-all">
            <Send size={18} /> <span>{labels.submit[lang]}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CertificateForm;
