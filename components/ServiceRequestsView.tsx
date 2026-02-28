
import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, Plus, Clock, CheckCircle2, AlertCircle, FileText, 
  X, Paperclip, Download, ChevronDown, ChevronUp, Award, ShieldCheck, 
  MapPin, Phone, Calendar, User, Eye, CheckCircle, Building, Hash,
  UploadCloud, UserCheck, FileBadge, ClipboardList
} from 'lucide-react';
import MaharashtraEmblem from './MaharashtraEmblem.tsx';
import { ServiceRequest, RequestStatus, ServiceType, Language, CertificateData, FileMetadata } from '../types.ts';
import { SERVICES, DICTIONARY } from '../constants.tsx';

// Fixed TS errors by moving RequestItem outside and explicitly defining props interface.
// This ensures that React's intrinsic 'key' prop is recognized correctly.
interface RequestItemProps {
  req: ServiceRequest;
  isExpanded: boolean;
  onToggle: () => void;
  onDownload: (doc: FileMetadata) => void;
  onUpdateStatus: (id: string, status: RequestStatus, report?: string) => void;
  getStatusStyle: (status: RequestStatus) => string;
}

const RequestItem: React.FC<RequestItemProps> = ({ 
  req, 
  isExpanded, 
  onToggle, 
  onDownload, 
  onUpdateStatus, 
  getStatusStyle,
  lang
}) => {
  const t = (key: string) => DICTIONARY[key]?.[lang] || key;
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden active:shadow-lg transition-all mb-4">
      <div onClick={onToggle} className="p-6 cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`text-[11px] font-black uppercase tracking-widest ${req.source === 'admin' ? 'text-indigo-600' : 'text-emerald-600'}`}>
              {req.source === 'admin' ? t('officialTask') : req.serviceTitle}
            </span>
            <h3 className="font-black text-slate-800 text-lg mt-1 tracking-tight">#{req.id.slice(0, 8)}</h3>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase ${getStatusStyle(req.status)}`}>
            <span>{req.status}</span>
          </div>
        </div>
        <p className="text-sm text-slate-600 font-bold leading-relaxed line-clamp-2">{req.description}</p>
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-widest mt-6 pt-4 border-t border-slate-50">
          <span>{req.createdAt}</span>
          <div className="flex items-center gap-1 text-emerald-600">
             <span>{isExpanded ? t('hide') : t('view')}</span>
             {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div className="px-6 pb-8 pt-4 border-t border-slate-100 bg-slate-50/50 space-y-4">
           {req.adminReport && (
             <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
               <div className="flex items-center gap-2 mb-2">
                 <ShieldCheck size={14} className="text-indigo-600" />
                 <p className="text-[10px] font-black text-indigo-600 uppercase">{t('officerResolutionReport')}</p>
               </div>
               <p className="text-sm font-bold text-slate-700 italic leading-relaxed">"{req.adminReport}"</p>
             </div>
           )}
           {req.adminDocument && (
             <button 
               onClick={() => onDownload(req.adminDocument!)}
               className="w-full bg-indigo-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg active:scale-95 transition-all"
             >
                <div className="flex items-center gap-3">
                   <FileBadge size={20} />
                   <div className="text-left">
                     <span className="text-[10px] font-black uppercase tracking-widest block opacity-70">{t('officialDoc')}</span>
                     <span className="text-xs font-black truncate max-w-[180px]">{req.adminDocument.name}</span>
                   </div>
                </div>
                <Download size={20} />
             </button>
           )}
           {req.status !== 'Resolved' && req.source === 'user' && (
             <button onClick={() => onUpdateStatus(req.id, 'Resolved', 'Marked resolved by resident')} className="w-full py-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 font-black text-[10px] uppercase tracking-widest active:scale-95">
                {t('confirmSatisfaction')}
             </button>
           )}
        </div>
      )}
    </div>
  );
};

interface ServiceRequestsViewProps {
  lang: Language;
  requests: ServiceRequest[];
  onBack: () => void;
  onNewRequest: (serviceId: ServiceType, description: string, userDoc?: FileMetadata) => void;
  onUpdateStatus: (id: string, status: RequestStatus, report?: string) => void;
}

const ServiceRequestsView: React.FC<ServiceRequestsViewProps> = ({ lang, requests, onBack, onNewRequest, onUpdateStatus }) => {
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [userDoc, setUserDoc] = useState<FileMetadata | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newReq, setNewReq] = useState({ serviceId: ServiceType.GRAMPANCHAYAT, description: '' });

  const t = (key: string) => DICTIONARY[key]?.[lang] || key;

  const adminTasks = requests.filter(r => r.source === 'admin');
  const userRequests = requests.filter(r => r.source === 'user');

  const getStatusStyle = (status: RequestStatus) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Resolved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleDownload = (doc: FileMetadata) => {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col animate-slide-in">
      <header className="px-6 pt-12 pb-6 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-5">
          <button onClick={onBack} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 active:scale-90 transition-all">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{t('myGaavTickets')}</h1>
        </div>
        {!showForm && <button onClick={() => setShowForm(true)} className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-lg active:scale-95 transition-transform"><Plus size={24} /></button>}
      </header>

      <div className="flex-1 overflow-y-auto p-5 pb-32 hide-scrollbar">
        {showForm ? (
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl space-y-6">
            <h2 className="text-xl font-black text-slate-800 text-center tracking-tight">{t('newServiceRequest')}</h2>
            <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-base font-black outline-none" value={newReq.serviceId} onChange={(e) => setNewReq({...newReq, serviceId: e.target.value as ServiceType})}>
               {SERVICES.map(s => <option key={s.id} value={s.id}>{s.title[lang]}</option>)}
            </select>
            <textarea rows={4} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold outline-none shadow-inner" placeholder={t('explainIssue')} value={newReq.description} onChange={(e) => setNewReq({...newReq, description: e.target.value})} />
            <div className="flex gap-3 pt-4">
               <button onClick={() => setShowForm(false)} className="flex-1 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">{t('cancel')}</button>
               <button onClick={() => { onNewRequest(newReq.serviceId, newReq.description, userDoc || undefined); setShowForm(false); }} className="flex-2 bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm shadow-lg">{t('submitRequest')}</button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {adminTasks.length > 0 && (
              <section>
                <div className="flex items-center gap-2 px-2 mb-4">
                  <ClipboardList size={16} className="text-indigo-600" />
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('officialTasksFromAdmin')}</h3>
                </div>
                {adminTasks.map(req => (
                  <RequestItem 
                    key={req.id} 
                    req={req} 
                    isExpanded={expandedId === req.id}
                    onToggle={() => setExpandedId(expandedId === req.id ? null : req.id)}
                    onDownload={handleDownload}
                    onUpdateStatus={onUpdateStatus}
                    getStatusStyle={getStatusStyle}
                    lang={lang}
                  />
                ))}
              </section>
            )}

            <section>
              <div className="flex items-center gap-2 px-2 mb-4">
                <FileText size={16} className="text-emerald-600" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('myServiceRequests')}</h3>
              </div>
              {userRequests.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200 opacity-40">
                   <p className="text-[10px] font-black uppercase tracking-widest">{t('noActiveRequests')}</p>
                </div>
              ) : (
                userRequests.map(req => (
                  <RequestItem 
                    key={req.id} 
                    req={req} 
                    isExpanded={expandedId === req.id}
                    onToggle={() => setExpandedId(expandedId === req.id ? null : req.id)}
                    onDownload={handleDownload}
                    onUpdateStatus={onUpdateStatus}
                    getStatusStyle={getStatusStyle}
                    lang={lang}
                  />
                ))
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceRequestsView;
