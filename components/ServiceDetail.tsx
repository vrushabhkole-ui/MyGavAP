
import React, { useState } from 'react';
import { 
  ChevronLeft, ExternalLink, HelpCircle, MessageSquarePlus, Receipt, 
  CreditCard, Droplets, Home as HomeIcon, AlertCircle, X, 
  Calendar, Info, Hash, FileText, ArrowRight, ShieldCheck, Download,
  CheckCircle, History, BadgeCheck
} from 'lucide-react';
import { ServiceInfo, Language, Bill, ServiceType, BillType } from '../types';
import { getIcon, DICTIONARY } from '../constants';

interface ServiceDetailProps {
  lang: Language;
  service: ServiceInfo;
  bills: Bill[];
  onBack: () => void;
  onAskAI: () => void;
  onRaiseRequest: (portalIdx?: number) => void;
}

const BillDetailModal: React.FC<{ bill: Bill; onClose: () => void; lang: Language }> = ({ bill, onClose, lang }) => {
  const isPaid = bill.status === 'Paid';
  const t = (key: string) => DICTIONARY[key]?.[lang] || key;
  
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              bill.type === 'Home Tax' ? 'bg-amber-100 text-amber-600' :
              bill.type === 'Water' ? 'bg-blue-100 text-blue-600' :
              'bg-emerald-100 text-emerald-600'
            }`}>
              {bill.type === 'Home Tax' ? <HomeIcon size={28}/> : 
               bill.type === 'Water' ? <Droplets size={28}/> : 
               <Receipt size={28} />}
            </div>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {isPaid ? t('paymentReceipt') : t('taxInvoice')}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <h2 className="text-2xl font-black text-slate-800">{bill.type}</h2>
              {isPaid && <BadgeCheck className="text-emerald-500" size={24} />}
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-2"><Hash size={12}/> {isPaid ? t('receiptNo') : t('transactionId')}</div>
              <span className="text-slate-800 font-mono">{bill.id}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-2"><Calendar size={12}/> {isPaid ? t('paidOn') : t('issueDate')}</div>
              <span className="text-slate-800">{isPaid ? bill.issuedAt : bill.issuedAt}</span>
            </div>
            {!isPaid && (
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="flex items-center gap-2"><Calendar size={12}/> {t('dueDate')}</div>
                <span className="text-rose-600">{bill.dueDate}</span>
              </div>
            )}
            
            <div className="pt-3 border-t border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('detailedRemarks')}</p>
              <div className="bg-white p-4 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-700 leading-relaxed italic">
                  {bill.description || 'General maintenance and property development taxes as per Gram Panchayat resolution.'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isPaid ? t('totalPaid') : t('amountDue')}</p>
              <p className={`text-3xl font-black ${isPaid ? 'text-emerald-600' : 'text-slate-800'}`}>₹{bill.amount}</p>
            </div>
            {isPaid ? (
              <button 
                className="bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <Download size={18} /> {t('receipt')}
              </button>
            ) : (
              <div className="bg-rose-50 text-rose-600 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center">
                {t('paymentPending')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceDetail: React.FC<ServiceDetailProps> = ({ lang, service, bills, onBack, onAskAI, onRaiseRequest }) => {
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showTaxCenter, setShowTaxCenter] = useState(false);
  
  const t = (key: string) => DICTIONARY[key]?.[lang] || key;

  const isBillRelatedToService = (billType: BillType, serviceId: ServiceType) => {
    if (serviceId === ServiceType.GRAMPANCHAYAT) {
      return ['Home Tax', 'Water', 'GS Bill', 'Other Service'].includes(billType);
    }
    if (serviceId === ServiceType.ELECTRICITY) {
      return billType === 'Electricity';
    }
    if (serviceId === ServiceType.GAS) {
      return billType === 'Gas';
    }
    return false;
  };

  const taxBills = bills.filter(b => (b.type === 'Home Tax' || b.type === 'Water') && service.id === ServiceType.GRAMPANCHAYAT);
  const pendingTaxes = taxBills.filter(b => b.status === 'Unpaid');
  const completedTaxes = taxBills.filter(b => b.status === 'Paid');
  
  const activeUnpaidBills = bills.filter(b => 
    b.status === 'Unpaid' && isBillRelatedToService(b.type, service.id)
  );

  const handlePortalClick = (idx: number) => {
    if (service.id === ServiceType.GRAMPANCHAYAT && idx === 1) {
      setShowTaxCenter(true);
    } else {
      onRaiseRequest(idx);
    }
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-slide-in overflow-hidden relative">
      <div className={`flex-shrink-0 ${service.color} pt-6 pb-6 px-6 text-white shadow-md z-20`}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={showTaxCenter ? () => setShowTaxCenter(false) : onBack} className="bg-white/10 p-2 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-md">
            <ChevronLeft size={20} />
          </button>
          {showTaxCenter && (
            <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">
               <span className="text-[9px] font-black uppercase tracking-widest">{t('gaavTaxRecords')}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-black tracking-tight leading-none">
              {showTaxCenter ? t('taxCenterTitle') : service.title[lang]}
            </h1>
            <p className="text-white/80 mt-1 text-[10px] font-black uppercase tracking-widest opacity-90">
              {showTaxCenter ? t('taxCenterSub') : service.description[lang]}
            </p>
          </div>
          <div className="bg-white/20 p-2.5 rounded-2xl backdrop-blur-sm border border-white/10 flex-shrink-0 shadow-inner">
            {showTaxCenter ? <Receipt size={24} className="text-white" /> : getIcon(service.icon, 24, "text-white")}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-10 pb-32 hide-scrollbar">
        {showTaxCenter ? (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('activeAssessments')}</h3>
                {pendingTaxes.length > 0 && (
                  <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full text-[9px] font-black">{t('actionRequired')}</span>
                )}
              </div>
              
              {pendingTaxes.length === 0 ? (
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-[32px] p-8 text-center">
                  <BadgeCheck size={32} className="text-emerald-500 mx-auto mb-3" />
                  <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">{t('allTaxesPaid')}</p>
                  <p className="text-[10px] text-emerald-600/70 font-bold mt-1">{t('noPendingDues')}</p>
                </div>
              ) : (
                pendingTaxes.map(bill => (
                  <button 
                    key={bill.id} 
                    onClick={() => setSelectedBill(bill)}
                    className="w-full bg-white rounded-[24px] p-4 border border-rose-100 shadow-sm flex items-center justify-between transition-all hover:border-rose-300 text-left active:scale-[0.98]"
                  >
                     <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          bill.type === 'Home Tax' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                           {bill.type === 'Home Tax' ? <HomeIcon size={24}/> : <Droplets size={24}/>}
                        </div>
                        <div>
                           <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{bill.type}</p>
                           <p className="text-lg font-black text-slate-800 leading-none">₹{bill.amount}</p>
                           <div className="flex items-center gap-1.5 mt-1">
                              <Calendar size={10} className="text-rose-400" />
                              <p className="text-[9px] font-bold text-rose-500 uppercase">{bill.dueDate}</p>
                           </div>
                        </div>
                     </div>
                     <div className="bg-rose-50 text-rose-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        {t('pay')}
                     </div>
                  </button>
                ))
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('recentSettlements')}</h3>
                <History size={14} className="text-slate-300" />
              </div>

              {completedTaxes.length === 0 ? (
                <div className="bg-white rounded-[32px] p-8 text-center border border-dashed border-slate-200 opacity-60">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('noRecentPayments')}</p>
                </div>
              ) : (
                completedTaxes.map(bill => (
                  <button 
                    key={bill.id} 
                    onClick={() => setSelectedBill(bill)}
                    className="w-full bg-white rounded-[24px] p-4 border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:border-emerald-200 text-left active:scale-[0.98]"
                  >
                     <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400`}>
                           {bill.type === 'Home Tax' ? <HomeIcon size={24}/> : <Droplets size={24}/>}
                        </div>
                        <div>
                           <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{bill.type}</p>
                           <p className="text-lg font-black text-slate-400 line-through decoration-slate-300 leading-none">₹{bill.amount}</p>
                           <div className="flex items-center gap-1.5 mt-1">
                              <BadgeCheck size={10} className="text-emerald-500" />
                              <p className="text-[9px] font-bold text-emerald-500 uppercase">{t('completed')}</p>
                           </div>
                        </div>
                     </div>
                     <div className="bg-slate-50 text-slate-400 p-2 rounded-lg">
                        <ArrowRight size={18} />
                     </div>
                  </button>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {activeUnpaidBills.length > 0 && (
              <div className="space-y-3">
                 <div className="flex items-center justify-between px-2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {service.id === ServiceType.ELECTRICITY ? t('payMonthlyBill') : t('pendingBills')}
                    </h3>
                    <span className="text-[10px] font-black text-rose-500 uppercase flex items-center gap-1">
                       <AlertCircle size={12} /> {activeUnpaidBills.length} {t('totalPending')}
                    </span>
                 </div>

                 {activeUnpaidBills.map(bill => (
                    <button 
                      key={bill.id} 
                      onClick={() => setSelectedBill(bill)}
                      className="w-full bg-white rounded-[24px] p-4 border border-rose-100 shadow-sm flex items-center justify-between transition-all hover:border-rose-300 text-left active:scale-[0.98]"
                    >
                       <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                            bill.type === 'Home Tax' ? 'bg-amber-100 text-amber-600' :
                            bill.type === 'Water' ? 'bg-blue-100 text-blue-600' :
                            bill.type === 'GS Bill' ? 'bg-emerald-100 text-emerald-600' :
                            'bg-rose-100 text-rose-600'
                          }`}>
                             {bill.type === 'Home Tax' ? <HomeIcon size={24}/> : 
                              bill.type === 'Water' ? <Droplets size={24}/> : 
                              <Receipt size={24} />}
                          </div>
                          <div>
                             <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{bill.type}</p>
                             <p className="text-xl font-black text-slate-800 leading-none">₹{bill.amount}</p>
                             <div className="flex items-center gap-1.5 mt-1.5">
                                <Calendar size={12} className="text-slate-300" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{bill.dueDate}</p>
                             </div>
                          </div>
                       </div>
                       <div className="bg-slate-50 text-slate-400 p-2.5 rounded-xl">
                          <ArrowRight size={20} />
                       </div>
                    </button>
                 ))}
              </div>
            )}

            <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-6 space-y-4">
                <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] text-center border-b border-slate-50 pb-4">{t('availablePortals')}</h2>
                <div className="space-y-3">
                  {service.details.map((item, idx) => (
                    <button 
                      key={idx}
                      onClick={() => handlePortalClick(idx)}
                      className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-[24px] border border-slate-100 hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-lg transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-white rounded-[16px] flex items-center justify-center text-slate-400 group-hover:text-emerald-600 shadow-sm transition-colors flex-shrink-0">
                          <FileText size={20} />
                        </div>
                        <span className="text-[14px] font-black text-slate-700 group-hover:text-emerald-800 flex-1 leading-tight">{item[lang]}</span>
                      </div>
                      <div className="bg-white p-2 rounded-xl text-slate-300 group-hover:text-emerald-500 shadow-sm transition-all flex-shrink-0">
                        <ExternalLink size={16} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col items-center gap-4">
              <button 
                onClick={onAskAI}
                className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-full shadow-lg text-slate-500 hover:text-emerald-600 transition-all active:scale-95"
              >
                <HelpCircle size={18} className="text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('aiConsult')}</span>
                <ArrowRight size={14} className="opacity-50" />
              </button>

              <button 
                onClick={() => onRaiseRequest()}
                className="w-full max-w-[320px] bg-white p-5 rounded-[32px] border-2 border-dashed border-slate-100 flex items-center gap-4 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group shadow-sm"
              >
                <div className="w-12 h-12 rounded-[18px] bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner flex-shrink-0">
                   <MessageSquarePlus size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">{t('needHelp')}</h3>
                  <p className="text-[9px] text-slate-400 font-bold mt-0.5 leading-tight">{t('reportIssue')}</p>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      {selectedBill && (
        <BillDetailModal 
          bill={selectedBill} 
          lang={lang}
          onClose={() => setSelectedBill(null)} 
        />
      )}
    </div>
  );
};

export default ServiceDetail;
