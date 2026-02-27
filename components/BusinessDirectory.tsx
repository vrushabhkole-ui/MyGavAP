
import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, Search, Phone, Clock, Store, 
  MapPin, MessageSquarePlus, MessageSquare, Info, X, Save, User, Hash, Plus, UploadCloud, CheckCircle
} from 'lucide-react';
import { Language, LocalBusiness, FileMetadata } from '../types.ts';
import { DICTIONARY } from '../constants.tsx';

interface BusinessDirectoryProps {
  lang: Language;
  businesses: LocalBusiness[];
  onBack: () => void;
  onRegisterBusiness: (business: Omit<LocalBusiness, 'id' | 'village' | 'subDistrict' | 'status'>) => void;
  onRaiseHelp: () => void;
}

const BusinessDirectory: React.FC<BusinessDirectoryProps> = ({ lang, businesses, onBack, onRegisterBusiness, onRaiseHelp }) => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [proof, setProof] = useState<FileMetadata | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Grocery',
    contact: '',
    hours: '9 AM - 8 PM',
    description: '',
    ownerName: ''
  });

  const t = (key: string) => DICTIONARY[key]?.[lang] || key;

  // Residents only see approved businesses
  const approvedBusinesses = businesses.filter(b => b.status === 'Approved');

  const filtered = approvedBusinesses.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = Array.from(new Set(approvedBusinesses.map(b => b.category)));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProof({
          name: file.name,
          url: reader.result as string,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proof) {
      alert("Please upload business proof for verification.");
      return;
    }
    onRegisterBusiness({ ...formData, proof });
    setShowForm(false);
    setProof(null);
    setFormData({
      name: '',
      category: 'Grocery',
      contact: '',
      hours: '9 AM - 8 PM',
      description: '',
      ownerName: ''
    });
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-slide-in overflow-hidden relative">
      <header className="flex-shrink-0 px-6 py-8 bg-indigo-600 text-white rounded-b-[40px] shadow-lg">
        <div className="flex items-center justify-between mb-6">
           <button onClick={onBack} className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
             <ChevronLeft size={24} />
           </button>
           <div className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">
             {t('localMarketplace')}
           </div>
        </div>
        <div className="space-y-1 mb-8">
           <h1 className="text-2xl font-black tracking-tight">{t('villageBusinessHub')}</h1>
           <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">{t('exploreLocalServices')}</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-md focus-within:bg-white/20 transition-all">
          <Search size={20} className="text-white/60" />
          <input 
            type="text" 
            placeholder={t('searchShops')} 
            className="bg-transparent outline-none text-white text-sm w-full font-bold placeholder:text-white/40"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32 hide-scrollbar">
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
           <button 
             onClick={() => setSearch('')}
             className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${!search ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-100'}`}
           >
             {t('all')}
           </button>
           {categories.map(cat => (
             <button 
               key={cat}
               onClick={() => setSearch(cat)}
               className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${search === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-100'}`}
             >
               {cat}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filtered.length === 0 ? (
            <div className="py-20 text-center opacity-30 flex flex-col items-center">
               <Store size={48} className="mb-4" />
               <p className="text-[10px] font-black uppercase tracking-widest">{t('noBusinesses')}</p>
            </div>
          ) : (
            filtered.map(business => (
              <div key={business.id} className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-4">
                 <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-widest">{business.category}</span>
                       <h3 className="text-lg font-black text-slate-800 tracking-tight pt-1">{business.name}</h3>
                       <p className="text-[10px] font-bold text-slate-400">{t('owner')}: {business.ownerName}</p>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                       <Store size={24} />
                    </div>
                 </div>
                 
                 <p className="text-xs font-bold text-slate-500 italic leading-relaxed">
                   "{business.description}"
                 </p>

                 <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
                       <Clock size={16} className="text-slate-400" />
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('hours')}</span>
                          <span className="text-[10px] font-bold text-slate-700">{business.hours}</span>
                       </div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl flex items-center gap-3">
                       <Phone size={16} className="text-slate-400" />
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('contact')}</span>
                          <span className="text-[10px] font-bold text-slate-700">{business.contact}</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex gap-2 pt-2">
                    <a 
                      href={`tel:${business.contact}`}
                      className="flex-1 bg-emerald-600 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                    >
                       {t('callNow')}
                    </a>
                    <button className="p-3.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                       <MessageSquare size={18} />
                    </button>
                 </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => setShowForm(true)}
            className="w-full bg-white border-2 border-dashed border-slate-200 p-8 rounded-[32px] flex flex-col items-center gap-4 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group shadow-sm"
          >
             <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus size={24} />
             </div>
             <div className="text-center">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">{t('registerBusiness')}</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-1">{t('getListed')}</p>
             </div>
          </button>

          <button 
            onClick={onRaiseHelp}
            className="w-full bg-slate-100 p-5 rounded-[32px] border border-slate-200 flex items-center gap-4 hover:bg-slate-200 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-slate-400 flex items-center justify-center shadow-sm flex-shrink-0 group-hover:text-indigo-600 transition-colors">
               <MessageSquarePlus size={20} />
            </div>
            <div className="text-left">
              <h3 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">{t('needHelp')}</h3>
              <p className="text-[9px] text-slate-400 font-bold mt-0.5 leading-tight">{t('businessIssues')}</p>
            </div>
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <header className="px-8 pt-8 pb-4 flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-800">{t('registerBusiness')}</h2>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{t('newListing')}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
                <X size={24} />
              </button>
            </header>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto hide-scrollbar">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('businessName')}</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <Store size={18} className="text-slate-400" />
                  <input required placeholder={t('shopName')} className="bg-transparent outline-none text-sm w-full font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('category')}</label>
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold outline-none" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="Grocery">{t('grocery')}</option>
                    <option value="Salon">{t('salon')}</option>
                    <option value="Medical">{t('medical')}</option>
                    <option value="Agri-Store">{t('agriStore')}</option>
                    <option value="Tailor">{t('tailor')}</option>
                    <option value="Dairy">{t('dairy')}</option>
                    <option value="Other">{t('other')}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('contact')}</label>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                    <Phone size={18} className="text-slate-400" />
                    <input required type="tel" placeholder={t('mobileNumber')} className="bg-transparent outline-none text-sm w-full font-bold" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('ownerName')}</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <User size={18} className="text-slate-400" />
                  <input required placeholder={t('fullName')} className="bg-transparent outline-none text-sm w-full font-bold" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('operatingHours')}</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <Clock size={18} className="text-slate-400" />
                  <input required placeholder="e.g. 9 AM - 8 PM" className="bg-transparent outline-none text-sm w-full font-bold" value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('description')}</label>
                <textarea required rows={2} placeholder={t('description')} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('uploadProof')}</label>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${proof ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-100'}`}
                >
                  {proof ? (
                    <>
                      <CheckCircle size={24} className="text-emerald-600" />
                      <p className="text-[10px] font-black text-emerald-800 truncate max-w-full px-2">{proof.name}</p>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={24} className="text-slate-200" />
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">{t('uploadProof')}</p>
                    </>
                  )}
                </div>
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3">
                <Save size={18} /> {t('registerBusiness')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDirectory;
