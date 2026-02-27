
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabel = t(type);
    const dateLabel = type === 'birth' ? t('dob') : t('dod');
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
        <h1 className="text-base font-black text-slate-800 tracking-tight">{t('certificatePortal')}</h1>
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
              <FileText size={14} /> {t('birth')}
            </button>
            <button 
              type="button"
              onClick={() => setType('death')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${type === 'death' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
            >
              <FileText size={14} /> {t('death')}
            </button>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-100 space-y-4 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{t('personFullName')}</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <User size={18} className="text-slate-400" />
                <input required type="text" placeholder={t('fullName')} className="bg-transparent outline-none text-sm w-full font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{t('fatherFullName')}</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                  <User size={18} className="text-slate-400 opacity-50" />
                  <input required type="text" placeholder={t('fatherFullName')} className="bg-transparent outline-none text-sm w-full font-bold" value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{t('motherFullName')}</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                  <User size={18} className="text-slate-400 opacity-50" />
                  <input required type="text" placeholder={t('motherFullName')} className="bg-transparent outline-none text-sm w-full font-bold" value={formData.motherName} onChange={(e) => setFormData({...formData, motherName: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{type === 'birth' ? t('dob') : t('dod')}</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <Calendar size={18} className="text-slate-400" />
                <input required type="date" className="bg-transparent outline-none text-sm w-full font-bold uppercase" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{t('placeOfEvent')}</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <MapPin size={18} className="text-slate-400" />
                <input required type="text" placeholder={t('placeOfEvent')} className="bg-transparent outline-none text-sm w-full font-bold" value={formData.placeOfEvent} onChange={(e) => setFormData({...formData, placeOfEvent: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{t('mobileNumber')}</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <Phone size={18} className="text-slate-400" />
                <input required type="tel" placeholder={t('mobileNumber')} className="bg-transparent outline-none text-sm w-full font-bold" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{t('permanentAddress')}</label>
              <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                <MapPin size={18} className="text-slate-400 mt-0.5" />
                <textarea required rows={3} placeholder={t('permanentAddress')} className="bg-transparent outline-none text-sm w-full font-medium" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 shadow-sm uppercase tracking-widest active:scale-95 transition-all">
            <Send size={18} /> <span>{t('submitRequest')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CertificateForm;
