
import React, { useState } from 'react';
import { ChevronLeft, Flame, Send, Hash, Phone, User, MapPin, CreditCard, Box } from 'lucide-react';
import { Language, ServiceType } from '../types.ts';
import { DICTIONARY } from '../constants.tsx';

interface GasFormProps {
  lang: Language;
  onBack: () => void;
  onSubmit: (serviceId: ServiceType, description: string, data: any) => void;
}

const GasForm: React.FC<GasFormProps> = ({ lang, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    agency: 'HP Gas (Sukhawadi)',
    consumerId: '',
    consumerName: '',
    bookingType: 'Refill Booking',
    mobile: '',
    address: '',
    idProofType: 'Aadhaar Card',
    connectionType: 'Single Cylinder (14.2kg)'
  });

  const t = (key: string) => DICTIONARY[key]?.[lang] || key;

  const isNewConnection = formData.bookingType === 'New Gas Connection';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let description = `[Gas: ${formData.bookingType}] Agency: ${formData.agency}, Name: ${formData.consumerName}, Mobile: ${formData.mobile}`;
    
    if (isNewConnection) {
      description += `, Addr: ${formData.address}, ID: ${formData.idProofType}, Type: ${formData.connectionType}`;
    } else {
      description += `, Consumer ID: ${formData.consumerId}`;
    }
    
    onSubmit(ServiceType.GAS, description, formData);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-slide-in">
      <header className="flex-shrink-0 px-5 py-4 bg-white border-b border-slate-100 flex items-center gap-4 z-10">
        <button onClick={onBack} className="p-2 bg-slate-50 rounded-xl text-slate-400"><ChevronLeft size={24} /></button>
        <h1 className="text-base font-black text-slate-800 tracking-tight">{t('gasServiceHub')}</h1>
      </header>
      <div className="flex-1 p-5 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4 pb-10">
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 space-y-5 shadow-sm">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">{t('lpgAgency')}</label>
              <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none appearance-none" value={formData.agency} onChange={(e) => setFormData({...formData, agency: e.target.value})}>
                <option>HP Gas (Sukhawadi)</option>
                <option>Indane Gas</option>
                <option>Bharat Gas</option>
              </select>
            </div>

            {!isNewConnection && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">{t('consumerId')}</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <Hash size={18} className="text-slate-400" />
                  <input required type="text" placeholder={t('consumerId')} className="bg-transparent outline-none text-sm w-full font-bold" value={formData.consumerId} onChange={(e) => setFormData({...formData, consumerId: e.target.value})} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                {isNewConnection ? t('applicantFullName') : t('consumerName')}
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                <User size={18} className="text-slate-400" />
                <input required type="text" placeholder={t('fullNameAsPerRecords')} className="bg-transparent outline-none text-sm w-full font-bold" value={formData.consumerName} onChange={(e) => setFormData({...formData, consumerName: e.target.value})} />
              </div>
            </div>

            {isNewConnection && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">{t('fullAddress')}</label>
                  <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                    <MapPin size={18} className="text-slate-400 mt-1" />
                    <textarea required rows={3} placeholder={t('fullAddress')} className="bg-transparent outline-none text-sm w-full font-bold resize-none" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">{t('idProofType')}</label>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                      <CreditCard size={18} className="text-slate-400" />
                      <select className="bg-transparent outline-none text-sm w-full font-bold appearance-none" value={formData.idProofType} onChange={(e) => setFormData({...formData, idProofType: e.target.value})}>
                        <option>Aadhaar Card</option>
                        <option>Voter ID</option>
                        <option>PAN Card</option>
                        <option>Ration Card</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">{t('connectionType')}</label>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                      <Box size={18} className="text-slate-400" />
                      <select className="bg-transparent outline-none text-sm w-full font-bold appearance-none" value={formData.connectionType} onChange={(e) => setFormData({...formData, connectionType: e.target.value})}>
                        <option>Single Cylinder (14.2kg)</option>
                        <option>Double Cylinder (14.2kg x 2)</option>
                        <option>Small Cylinder (5kg)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">{t('serviceRequested')}</label>
              <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none appearance-none" value={formData.bookingType} onChange={(e) => setFormData({...formData, bookingType: e.target.value})}>
                <option value="Refill Booking">{t('refillBooking')}</option>
                <option value="New Gas Connection">{t('newGasConnection')}</option>
                <option value="Safety Check / Leakage">{t('safetyCheckLeakage')}</option>
                <option value="KYC Update">{t('kycUpdate')}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">{t('mobileNumber')}</label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                <Phone size={18} className="text-slate-400" />
                <input required type="tel" placeholder={t('mobileNumber')} className="bg-transparent outline-none text-sm w-full font-bold" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} />
              </div>
            </div>
          </div>
          <button type="submit" className="w-full bg-orange-600 text-white py-5 rounded-[24px] font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-orange-100 uppercase tracking-widest active:scale-95 transition-all">
            <Flame size={20} /> {t('submitRequest')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GasForm;
