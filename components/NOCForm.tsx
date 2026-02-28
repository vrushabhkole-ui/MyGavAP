
import React, { useState, useRef } from 'react';
import { ChevronLeft, FileText, Send, Building, Home, Droplets, Zap, ShoppingBag, Edit3, UploadCloud, CheckCircle, Hash } from 'lucide-react';
import { Language, ServiceType, FileMetadata } from '../types.ts';
import { DICTIONARY } from '../constants.tsx';

interface NOCFormProps {
  lang: Language;
  onBack: () => void;
  onSubmit: (serviceId: ServiceType, description: string, userDoc?: FileMetadata) => void;
}

const NOCForm: React.FC<NOCFormProps> = ({ lang, onBack, onSubmit }) => {
  const [category, setCategory] = useState('Construction');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userDoc, setUserDoc] = useState<FileMetadata | null>(null);
  
  const [formData, setFormData] = useState({
    propertyNo: '',
    purpose: '',
    fullName: '',
    address: ''
  });

  const t = (key: string) => DICTIONARY[key]?.[lang] || key;

  const categories = [
    { id: 'Construction', label: t('houseConstruction'), icon: Home },
    { id: 'Water', label: t('waterConnection'), icon: Droplets },
    { id: 'Electricity', label: t('electricityNoc'), icon: Zap },
    { id: 'Business', label: t('shopBusiness'), icon: ShoppingBag },
    { id: 'Other', label: t('otherPurpose'), icon: Edit3 }
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const catLabel = categories.find(c => c.id === category)?.label || category;
    const description = `[NOC: ${catLabel}] Prop No: ${formData.propertyNo}, Purpose: ${formData.purpose}, Name: ${formData.fullName}, Addr: ${formData.address}`;
    onSubmit(ServiceType.GRAMPANCHAYAT, description, userDoc || undefined);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-slide-in">
      <header className="flex-shrink-0 px-5 py-4 bg-white border-b border-slate-100 flex items-center gap-4 z-10">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl text-slate-400">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-base font-black text-slate-800 tracking-tight">{t('nocPortal')}</h1>
      </header>

      <div className="flex-1 p-5 overflow-y-auto hide-scrollbar">
        <form onSubmit={handleFormSubmit} className="space-y-6 pb-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">{t('selectNocCategory')}</label>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-4 rounded-[24px] border transition-all flex flex-col items-center gap-2 text-center ${
                      isSelected 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' 
                        : 'bg-white border-slate-100 text-slate-400'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-[10px] font-black uppercase tracking-tight leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 border border-slate-100 space-y-5 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">{t('propertyGatNumber')}</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                <Hash size={18} className="text-slate-400" />
                <input required placeholder={t('propertyGatNumber')} className="bg-transparent outline-none text-sm w-full font-bold" value={formData.propertyNo} onChange={(e) => setFormData({...formData, propertyNo: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">{t('applicantFullName')}</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                <Building size={18} className="text-slate-400" />
                <input required placeholder={t('applicantFullName')} className="bg-transparent outline-none text-sm w-full font-bold" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">{t('reasonPurpose')}</label>
              <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                <Edit3 size={18} className="text-slate-400 mt-0.5" />
                <textarea required rows={2} placeholder={t('reasonPurpose')} className="bg-transparent outline-none text-sm w-full font-bold resize-none" value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">{t('propertyDocuments')}</label>
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
                className={`w-full border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${userDoc ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-100'}`}
              >
                 {userDoc ? (
                   <>
                      <CheckCircle size={32} className="text-emerald-600" />
                      <p className="text-xs font-black text-emerald-800 truncate max-w-full px-4">{userDoc.name}</p>
                   </>
                 ) : (
                   <>
                      <UploadCloud size={40} className="text-slate-200" />
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center leading-loose">{t('uploadSupportingFile')}</p>
                   </>
                 )}
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-emerald-100 uppercase tracking-widest active:scale-95 transition-all">
            <Send size={20} /> <span>{t('submitNocRequest')}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default NOCForm;
