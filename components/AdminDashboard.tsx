
import React, { useState, useRef } from 'react';
import { 
  X, CheckCircle, Receipt, Plus, Calendar, Megaphone, Clock, MapPin, 
  FileText, ShieldCheck, History as HistoryIcon, Trash2, Download, 
  FileBadge, Users, TrendingUp, ChevronRight, User as UserIcon,
  ClipboardList, CreditCard, Search, IndianRupee, Phone, Mail, Globe, Building2, UserCheck,
  UploadCloud, FileCheck, Save, MessageSquare, Store, Send, Check, Filter
} from 'lucide-react';
import { ServiceRequest, Language, RequestStatus, ServiceType, UserProfile, Bill, BillType, VillageNotice, FileMetadata, Transaction, LocalBusiness } from '../types.ts';
import { SERVICES, DICTIONARY } from '../constants.tsx';

interface AdminDashboardProps {
  lang: Language;
  user: UserProfile;
  requests: ServiceRequest[];
  residents: UserProfile[];
  bills: Bill[];
  notices: VillageNotice[];
  transactions: Transaction[];
  businesses: LocalBusiness[];
  onUpdateBusinesses: (biz: LocalBusiness[]) => void;
  onUpdateResidents: (residents: UserProfile[]) => void;
  onUpdateStatus: (id: string, status: RequestStatus, report?: string, adminDoc?: FileMetadata) => void;
  onIssueBill: (bill: Bill) => void;
  onMarkBillPaid: (id: string) => void;
  onDeleteBill: (id: string) => void;
  onIssueNotice: (notice: VillageNotice) => void;
  onDeleteNotice: (id: string) => void;
  onLogout: () => void;
}

const ProcessRequestModal: React.FC<{ 
  request: ServiceRequest; 
  lang: Language;
  onClose: () => void;
  onUpdate: (id: string, status: RequestStatus, report: string, adminDoc?: FileMetadata) => void;
}> = ({ request, lang, onClose, onUpdate }) => {
  const [status, setStatus] = useState<RequestStatus>(request.status);
  const [report, setReport] = useState(request.adminReport || '');
  const [file, setFile] = useState<FileMetadata | null>(request.adminDocument || null);
  const fileRef = useRef<HTMLInputElement>(null);

  const t = (key: string) => DICTIONARY[key]?.[lang] || key;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFile({
          name: selected.name,
          type: selected.type,
          url: reader.result as string
        });
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleFinalize = () => {
    onUpdate(request.id, status, report, file || undefined);
    onClose();
  };

  const handleDownloadUserDoc = () => {
    if (request.userDocument) {
      const link = document.createElement('a');
      link.href = request.userDocument.url;
      link.download = request.userDocument.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <ClipboardList size={28} />
            </div>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{t('processRequest')}</h2>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID: {request.id}</span>
              <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{request.userName}</span>
            </div>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 hide-scrollbar">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-3">
               <div className="flex items-center gap-2 text-slate-400">
                  <MessageSquare size={14} />
                  <span className="text-[9px] font-black uppercase tracking-[0.15em]">{t('citizenRequest')}</span>
               </div>
               <div className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm">
                  <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                    "{request.description}"
                  </p>
               </div>
               {request.userDocument && (
                 <button 
                  onClick={handleDownloadUserDoc}
                  className="w-full flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                 >
                    <div className="flex items-center gap-2">
                      <FileBadge size={16} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-slate-500 group-hover:text-emerald-700 truncate max-w-[140px]">{request.userDocument.name}</span>
                    </div>
                    <Download size={14} className="text-slate-300 group-hover:text-emerald-500" />
                 </button>
               )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('updateStatus')}</label>
              <div className="grid grid-cols-2 gap-2">
                {(['Pending', 'In Progress', 'Resolved', 'Cancelled'] as RequestStatus[]).map(s => (
                  <button 
                    key={s} 
                    onClick={() => setStatus(s)}
                    className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${status === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-slate-50 text-slate-400 border-slate-100'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('officialReport')}</label>
              <textarea 
                rows={4}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-indigo-200 transition-all resize-none shadow-inner"
                placeholder={t('officialReport')}
                value={report}
                onChange={(e) => setReport(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('attachDocument')}</label>
              <input type="file" ref={fileRef} className="hidden" onChange={handleFileChange} />
              <div 
                onClick={() => fileRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${file ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-100'}`}
              >
                 {file ? (
                   <>
                     <FileCheck size={28} className="text-emerald-600" />
                     <p className="text-[11px] font-black text-emerald-800 truncate max-w-full px-2">{file.name}</p>
                   </>
                 ) : (
                   <>
                     <UploadCloud size={28} className="text-slate-200" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">{t('attachDocument')}</p>
                   </>
                 )}
              </div>
            </div>
          </div>

          <button 
            onClick={handleFinalize}
            className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Save size={18} /> {t('finalizeResolution')}
          </button>
        </div>
      </div>
    </div>
  );
};

const ResidentDetailModal: React.FC<{ resident: UserProfile; onClose: () => void }> = ({ resident, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-16 h-16 bg-slate-100 rounded-[24px] flex items-center justify-center text-slate-400">
              <UserIcon size={32} />
            </div>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-500 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{resident.name}</h2>
              <UserCheck size={20} className="text-emerald-500" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Citizen ID: {resident.id}</p>
          </div>

          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 hide-scrollbar">
            <div className="space-y-3">
              <h4 className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] border-b border-indigo-50 pb-1">Identity & Contact</h4>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                <Mail size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-700">{resident.email}</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl">
                <Phone size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-700">{resident.mobile || 'Not Provided'}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] border-b border-emerald-50 pb-1">Residential Address</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-3 rounded-2xl flex flex-col gap-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase">District</span>
                  <span className="text-[11px] font-bold text-slate-700">{resident.district}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl flex flex-col gap-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase">Taluka</span>
                  <span className="text-[11px] font-bold text-slate-700">{resident.subDistrict}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl flex items-start gap-3">
                <MapPin size={16} className="text-slate-400 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-700">{resident.village}</span>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed mt-1">{resident.address}</p>
                  <span className="text-[9px] font-black text-slate-400 mt-1">Pincode: {resident.pincode}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 pb-2">
              <h4 className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] border-b border-amber-50 pb-1">System Records</h4>
              <div className="flex justify-between items-center text-[11px] font-bold px-1">
                <span className="text-slate-400">Joined Portal</span>
                <span className="text-slate-700">{resident.joinedAt}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold px-1">
                <span className="text-slate-400">Account Role</span>
                <span className="text-slate-700 capitalize">{resident.role}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold px-1">
                <span className="text-slate-400">Status</span>
                <span className={`capitalize ${resident.status === 'approved' ? 'text-emerald-600' : resident.status === 'pending' ? 'text-amber-600' : 'text-rose-600'}`}>
                  {resident.status || 'Approved'}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  lang, user, requests, residents, bills, notices, transactions, businesses, onUpdateBusinesses,
  onUpdateResidents, onUpdateStatus, onIssueBill, onMarkBillPaid, onDeleteBill, onIssueNotice, onDeleteNotice, onLogout 
}) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'peoples' | 'billing' | 'notices' | 'history' | 'businesses' | 'approvals'>('requests');
  const [selectedResident, setSelectedResident] = useState<UserProfile | null>(null);
  const [processingRequest, setProcessingRequest] = useState<ServiceRequest | null>(null);
  const [noticeData, setNoticeData] = useState({ title: '', content: '', category: 'General' as VillageNotice['category'] });
  const [showBizForm, setShowBizForm] = useState(false);
  const [showBizNoticeForm, setShowBizNoticeForm] = useState(false);
  const [bizData, setBizData] = useState({ name: '', category: 'Grocery', contact: '', hours: '9 AM - 8 PM', description: '', ownerName: '' });
  const [bizNoticeData, setBizNoticeData] = useState({ title: '', content: '' });
  
  // Advanced Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [requestStatusFilter, setRequestStatusFilter] = useState<'All' | RequestStatus>('All');
  const [billStatusFilter, setBillStatusFilter] = useState<'All' | 'Paid' | 'Unpaid'>('All');

  const dept = user.department;
  const managedState = user.state;
  const managedDistrict = user.district;
  const managedVillage = user.village;
  const managedTaluka = user.subDistrict;
  const managedPincode = user.pincode;

  // Helper to strictly filter bill types per department
  const isBillTypeForDept = (type: BillType, currentDept?: ServiceType) => {
    if (!currentDept) return true;
    switch (currentDept) {
      case ServiceType.GRAMPANCHAYAT:
        return ['Home Tax', 'Water', 'GS Bill', 'Other Service'].includes(type);
      case ServiceType.ELECTRICITY:
        return type === 'Electricity';
      case ServiceType.GAS:
        return type === 'Gas';
      case ServiceType.BUSINESS:
        return type === 'Business License';
      case ServiceType.MARKET:
        return type === 'Mandi Fee';
      default:
        return false;
    }
  };

  // Citizens list filtered by search
  const villageCitizens = residents.filter(r => 
    (managedState === 'All' || r.state === managedState) &&
    (managedDistrict === 'All' || r.district === managedDistrict) &&
    (managedVillage === 'All' || r.village === managedVillage) && 
    (managedTaluka === 'All' || r.subDistrict === managedTaluka) &&
    (managedPincode === 'All' || managedPincode === '000000' || r.pincode === managedPincode) &&
    (searchTerm === '' || r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const villageBusinesses = businesses.filter(b => 
    (managedState === 'All' || b.state === managedState) &&
    (managedDistrict === 'All' || b.district === managedDistrict) &&
    (managedVillage === 'All' || b.village === managedVillage) && 
    (managedTaluka === 'All' || b.subDistrict === managedTaluka) &&
    (managedPincode === 'All' || managedPincode === '000000' || b.pincode === managedPincode)
  );

  // Filtered requests with status and search
  const filteredRequests = requests.filter(r => 
    ((managedState === 'All' || r.state === managedState) && 
     (managedDistrict === 'All' || r.district === managedDistrict) && 
     (managedVillage === 'All' || r.village === managedVillage) && 
     (managedTaluka === 'All' || r.subDistrict === managedTaluka) && 
     (managedPincode === 'All' || managedPincode === '000000' || r.pincode === managedPincode)) &&
    (!dept || r.serviceId === dept) &&
    (requestStatusFilter === 'All' || r.status === requestStatusFilter) &&
    (searchTerm === '' || r.userName.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTransactions = transactions.filter(t => 
    ((managedState === 'All' || t.state === managedState) && 
     (managedDistrict === 'All' || t.district === managedDistrict) && 
     (managedVillage === 'All' || t.village === managedVillage) && 
     (managedTaluka === 'All' || t.subDistrict === managedTaluka) && 
     (managedPincode === 'All' || managedPincode === '000000' || t.pincode === managedPincode)) &&
    isBillTypeForDept(t.type, dept) &&
    (searchTerm === '' || t.userName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filtered bills with status and search
  const filteredBills = bills.filter(b => 
    ((managedState === 'All' || b.state === managedState) && 
     (managedDistrict === 'All' || b.district === managedDistrict) && 
     (managedVillage === 'All' || b.village === managedVillage) && 
     (managedTaluka === 'All' || b.subDistrict === managedTaluka) && 
     (managedPincode === 'All' || managedPincode === '000000' || b.pincode === managedPincode)) &&
    isBillTypeForDept(b.type, dept) &&
    (billStatusFilter === 'All' || b.status === billStatusFilter) &&
    (searchTerm === '' || b.userId.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const filteredNotices = notices.filter(n => 
    (managedState === 'All' || n.state === managedState) &&
    (managedDistrict === 'All' || n.district === managedDistrict) &&
    (managedVillage === 'All' || n.village === managedVillage) && 
    (managedTaluka === 'All' || n.subDistrict === managedTaluka) &&
    (managedPincode === 'All' || managedPincode === '000000' || n.pincode === managedPincode)
  );

  const [billingData, setBillingData] = useState({ 
    residentId: '', 
    type: (dept === ServiceType.ELECTRICITY ? 'Electricity' : dept === ServiceType.GAS ? 'Gas' : dept === ServiceType.BUSINESS ? 'Business License' : 'Home Tax') as BillType, 
    amount: '', 
    description: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] 
  });

  const totalRevenue = transactions.filter(t => 
    (managedState === 'All' || t.state === managedState) && 
    (managedDistrict === 'All' || t.district === managedDistrict) && 
    (managedVillage === 'All' || t.village === managedVillage) && 
    (managedTaluka === 'All' || t.subDistrict === managedTaluka) && 
    (managedPincode === 'All' || managedPincode === '000000' || t.pincode === managedPincode) &&
    t.status === 'Success' && 
    isBillTypeForDept(t.type, dept)
  ).reduce((acc, t) => acc + t.amount, 0);
  const themeBg = (SERVICES.find(s => s.id === user.department)?.color || 'bg-slate-900');

  const handlePostNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeData.title || !noticeData.content) return;
    onIssueNotice({
      id: `NT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      state: managedState,
      district: managedDistrict,
      village: managedVillage,
      subDistrict: managedTaluka,
      pincode: managedPincode,
      title: noticeData.title,
      content: noticeData.content,
      category: noticeData.category,
      date: new Date().toLocaleDateString('en-IN')
    });
    setNoticeData({ title: '', content: '', category: 'General' });
  };

  const handlePostBizNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizNoticeData.title || !bizNoticeData.content) return;
    onIssueNotice({
      id: `NT-BIZ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      state: managedState,
      district: managedDistrict,
      village: managedVillage,
      subDistrict: managedTaluka,
      pincode: managedPincode,
      title: bizNoticeData.title,
      content: bizNoticeData.content,
      category: 'Business',
      date: new Date().toLocaleDateString('en-IN')
    });
    setBizNoticeData({ title: '', content: '' });
    setShowBizNoticeForm(false);
  };

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billingData.residentId || !billingData.amount) return;
    onIssueBill({
      id: `BL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: billingData.residentId,
      state: managedState,
      district: managedDistrict,
      village: managedVillage,
      subDistrict: managedTaluka,
      pincode: managedPincode,
      type: billingData.type,
      amount: parseFloat(billingData.amount),
      description: billingData.description,
      dueDate: new Date(billingData.dueDate).toLocaleDateString('en-IN'),
      issuedAt: new Date().toLocaleDateString('en-IN'),
      status: 'Unpaid'
    });
    setBillingData({ ...billingData, residentId: '', amount: '', description: '' });
  };

  const handleAddBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    const newBiz: LocalBusiness = {
      ...bizData,
      id: `BZ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      state: managedState,
      district: managedDistrict,
      village: managedVillage,
      subDistrict: managedTaluka,
      pincode: managedPincode,
      status: 'Approved'
    };
    onUpdateBusinesses([...businesses, newBiz]);
    setShowBizForm(false);
    setBizData({ name: '', category: 'Grocery', contact: '', hours: '9 AM - 8 PM', description: '', ownerName: '' });
  };

  const handleApproveBusiness = (id: string) => {
    const updated = businesses.map(b => b.id === id ? { ...b, status: 'Approved' } as LocalBusiness : b);
    onUpdateBusinesses(updated);
  };

  const handleApproveUser = (id: string) => {
    const updated = residents.map(r => r.id === id ? { ...r, status: 'approved' } as UserProfile : r);
    onUpdateResidents(updated);
  };

  const handleRejectUser = (id: string) => {
    const updated = residents.map(r => r.id === id ? { ...r, status: 'rejected' } as UserProfile : r);
    onUpdateResidents(updated);
  };

  const handleDownloadProof = (proof: FileMetadata) => {
    const link = document.createElement('a');
    link.href = proof.url;
    link.download = proof.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const historyItems = [
    ...filteredRequests.map(r => ({
      id: r.id,
      userName: r.userName,
      action: `Ticket: ${r.serviceTitle}`,
      date: r.createdAt,
      type: 'request',
      status: r.status
    })),
    ...filteredTransactions.map(t => ({
      id: t.id,
      userName: t.userName,
      action: `Paid ${t.type}`,
      date: t.timestamp,
      type: 'payment',
      status: t.status
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-slate-50 h-full flex flex-col animate-slide-in overflow-hidden relative">
      <header className={`z-20 px-4 pt-4 pb-4 ${themeBg} text-white rounded-b-[40px] shadow-2xl sticky top-0 transition-colors duration-500`}>
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/10 rounded-[14px] flex items-center justify-center border border-white/10 backdrop-blur-md">
                <ShieldCheck size={22} className="text-emerald-400" />
             </div>
             <div>
               <h1 className="text-[13px] font-black tracking-tight leading-none">
                 {(SERVICES.find(s => s.id === dept)?.title[lang] || 'Officer Portal')}
               </h1>
               <p className="text-[8px] font-black text-white/50 uppercase tracking-widest mt-1">
                 {managedVillage} • Admin
               </p>
             </div>
          </div>
          <button onClick={onLogout} className="p-2.5 bg-white/10 border border-white/10 rounded-xl active:scale-90 transition-all backdrop-blur-md">
            <X size={18} />
          </button>
        </div>

        {/* Compressed Global Search Bar */}
        <div className="px-2 mb-4">
          <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-md focus-within:bg-white/20 transition-all">
            <Search size={16} className="text-white/60" />
            <input 
              type="text" 
              placeholder="Search citizens..." 
              className="bg-transparent outline-none text-white text-[13px] w-full font-bold placeholder:text-white/40"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/10 border border-white/5 rounded-2xl p-3 flex flex-col justify-between h-20">
            <TrendingUp size={14} className="text-emerald-400" />
            <div>
              <p className="text-[7px] font-black text-white/50 uppercase tracking-widest">Revenue</p>
              <span className="text-[12px] font-black tracking-tight">₹{totalRevenue.toLocaleString()}</span>
            </div>
          </div>
          <div className="bg-white/10 border border-white/5 rounded-2xl p-3 flex flex-col justify-between h-20">
            <Clock size={14} className="text-amber-400" />
            <div>
              <p className="text-[7px] font-black text-white/50 uppercase tracking-widest">Tickets</p>
              <span className="text-[12px] font-black">{filteredRequests.length}</span>
            </div>
          </div>
          <div className="bg-white/10 border border-white/5 rounded-2xl p-3 flex flex-col justify-between h-20">
            <Receipt size={14} className="text-blue-400" />
            <div>
              <p className="text-[7px] font-black text-white/50 uppercase tracking-widest">Active Bills</p>
              <span className="text-[12px] font-black">{filteredBills.length}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 mt-4 flex-shrink-0">
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex overflow-x-auto hide-scrollbar sticky top-4 z-10">
          {[
            { id: 'requests', label: 'Tickets', icon: FileText },
            { id: 'businesses', label: 'Directory', icon: Store },
            { id: 'billing', label: 'Billing', icon: Receipt },
            { id: 'notices', label: 'Notices', icon: Megaphone },
            { id: 'peoples', label: 'Residents', icon: Users },
            dept === ServiceType.GRAMPANCHAYAT && { id: 'approvals', label: 'Approvals', icon: UserCheck },
            { id: 'history', label: 'History', icon: HistoryIcon }
          ].filter(Boolean).map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
            >
              <tab.icon size={12} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 mt-5 pb-32 hide-scrollbar">
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2 px-1">
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Filter by Status</h3>
                <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  {(['All', 'Pending', 'In Progress', 'Resolved', 'Cancelled'] as const).map(s => (
                    <button 
                      key={s}
                      onClick={() => setRequestStatusFilter(s)}
                      className={`flex-shrink-0 px-3 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${requestStatusFilter === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-400 border-slate-100'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredRequests.length === 0 ? (
                  <div className="bg-white p-10 rounded-[28px] border border-dashed border-slate-200 text-center opacity-40">
                     <p className="text-[9px] font-black uppercase tracking-widest">No matching tickets</p>
                  </div>
                ) : (
                  filteredRequests.map(req => (
                    <button 
                      key={req.id} 
                      onClick={() => setProcessingRequest(req)}
                      className="w-full text-left bg-white p-4 rounded-[28px] border border-slate-100 flex items-center gap-4 shadow-sm hover:border-indigo-200 active:scale-95 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        {req.userName.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-[13px] text-slate-800 truncate">{req.userName}</h4>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">{req.serviceTitle}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                         <div className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full border ${req.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : req.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                            {req.status}
                         </div>
                         <ChevronRight size={12} className="text-slate-200 group-hover:text-indigo-400" />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[32px] p-6 shadow-lg border border-slate-100 space-y-5">
                 <div className="text-center">
                    <h3 className="text-lg font-black text-slate-800">Issue New Bill</h3>
                 </div>
                 <form onSubmit={handleCreateBill} className="space-y-3">
                    <select required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none" value={billingData.residentId} onChange={(e) => setBillingData({...billingData, residentId: e.target.value})}>
                       <option value="">Choose Citizen...</option>
                       {villageCitizens.map(r => <option key={r.id} value={r.id}>{r.name} ({r.id})</option>)}
                    </select>
                    <input required type="number" placeholder="Amount (₹)" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none" value={billingData.amount} onChange={(e) => setBillingData({...billingData, amount: e.target.value})} />
                    <select required className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none" value={billingData.type} onChange={(e) => setBillingData({...billingData, type: e.target.value as BillType})}>
                       {dept === ServiceType.GRAMPANCHAYAT ? (
                         <>
                           <option value="Home Tax">Property Tax</option>
                           <option value="Water">Water Bill</option>
                           <option value="GS Bill">Gram Sabha Fee</option>
                         </>
                       ) : (
                         dept === ServiceType.ELECTRICITY ? <option value="Electricity">Electricity Bill</option> :
                         dept === ServiceType.GAS ? <option value="Gas">Gas Bill</option> :
                         dept === ServiceType.BUSINESS ? <option value="Business License">Business License Fee</option> :
                         <option value="Other Service">Departmental Fee</option>
                       )}
                    </select>
                    <button type="submit" className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">
                       Send Official Bill
                    </button>
                 </form>
              </div>

              <div className="space-y-4">
                 <div className="flex flex-col gap-3 px-1">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Departmental Ledger</h3>
                    <div className="flex gap-2">
                       {(['All', 'Paid', 'Unpaid'] as const).map(s => (
                         <button 
                           key={s}
                           onClick={() => setBillStatusFilter(s)}
                           className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${billStatusFilter === s ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-white text-slate-400 border-slate-100'}`}
                         >
                           {s}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-3">
                   {filteredBills.length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-[28px] border border-dashed border-slate-200 opacity-40">
                         <p className="text-[9px] font-black uppercase tracking-widest">No matching bills</p>
                      </div>
                   ) : (
                      filteredBills.map(b => (
                         <div key={b.id} className={`bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm ${b.status === 'Paid' ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-rose-500'}`}>
                            <div className="flex items-center gap-3">
                               <div className={`${b.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} p-2 rounded-lg`}>
                                 {b.status === 'Paid' ? <CheckCircle size={14}/> : <Clock size={14}/>}
                               </div>
                               <div>
                                  <p className="text-[11px] font-black text-slate-800">{b.type}</p>
                                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">{b.userId} • {b.status}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className={`font-black text-[12px] ${b.status === 'Paid' ? 'text-emerald-600' : 'text-slate-800'}`}>₹{b.amount}</span>
                               {b.status === 'Unpaid' && (
                                 <button 
                                   onClick={() => onMarkBillPaid(b.id)}
                                   className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all border border-emerald-100"
                                   title="Mark as Paid (Cash)"
                                 >
                                   Paid
                                 </button>
                               )}
                               <button 
                                 onClick={() => onDeleteBill(b.id)}
                                 className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                 title="Remove Bill"
                               >
                                  <Trash2 size={14}/>
                               </button>
                            </div>
                         </div>
                      ))
                   )}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="space-y-8">
               <div className="bg-white rounded-[32px] p-6 shadow-lg border border-slate-100 space-y-4">
                  <h3 className="text-lg font-black text-slate-800 text-center">New Notice</h3>
                  <form onSubmit={handlePostNotice} className="space-y-3">
                    <input required placeholder="Notice Title" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none" value={noticeData.title} onChange={(e) => setNoticeData({...noticeData, title: e.target.value})} />
                    <textarea required rows={3} placeholder="Description..." className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none" value={noticeData.content} onChange={(e) => setNoticeData({...noticeData, content: e.target.value})} />
                    <div className="flex gap-2">
                       <select className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none" value={noticeData.category} onChange={e => setNoticeData({...noticeData, category: e.target.value as any})}>
                          <option value="General">General</option>
                          <option value="Meeting">Meeting</option>
                          <option value="Business">Business</option>
                       </select>
                       <button type="submit" className="bg-indigo-600 text-white py-3 px-6 rounded-xl font-black text-xs uppercase tracking-widest">Publish</button>
                    </div>
                  </form>
               </div>

               <div className="space-y-3">
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Village Bulletins ({filteredNotices.length})</h3>
                  {filteredNotices.length === 0 ? (
                    <div className="p-10 text-center bg-white rounded-[28px] border border-dashed border-slate-200 opacity-40">
                       <p className="text-[9px] font-black uppercase tracking-widest">No local notices</p>
                    </div>
                  ) : (
                    filteredNotices.map(n => (
                       <div key={n.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                             <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg flex-shrink-0"><Megaphone size={14}/></div>
                             <div className="min-w-0">
                                <p className="text-[12px] font-black text-slate-800 truncate">{n.title}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">{n.date}</p>
                             </div>
                          </div>
                          <button onClick={() => onDeleteNotice(n.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                             <Trash2 size={16}/>
                          </button>
                       </div>
                    ))
                  )}
               </div>
            </div>
          )}

          {activeTab === 'peoples' && (
             <div className="space-y-3">
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">Registered Citizens</h3>
                {villageCitizens.length === 0 ? (
                  <div className="bg-white p-10 rounded-[28px] border border-dashed border-slate-200 text-center opacity-40">
                     <p className="text-[9px] font-black uppercase tracking-widest">No matching residents</p>
                  </div>
                ) : (
                  villageCitizens.map(res => (
                    <button 
                      key={res.id} 
                      onClick={() => setSelectedResident(res)}
                      className="w-full bg-white p-3.5 rounded-2xl border border-slate-100 flex items-center gap-4 shadow-sm hover:border-slate-300 active:scale-95 transition-all text-left group"
                    >
                        <div className="w-10 h-10 bg-slate-50 group-hover:bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 transition-colors">
                           {res.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="font-black text-[13px] text-slate-800 truncate">{res.name}</h4>
                           <div className="flex items-center gap-2">
                             <p className="text-[9px] font-bold text-slate-400">{res.id}</p>
                             <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-full ${res.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : res.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                               {res.status || 'Approved'}
                             </span>
                           </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-200 group-hover:text-slate-400 transition-colors" />
                    </button>
                  ))
                )}
             </div>
          )}

          {activeTab === 'approvals' && (
             <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pending User Approvals</h3>
                  <div className="bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase">
                    {residents.filter(r => r.village === managedVillage && r.status === 'pending').length} Pending
                  </div>
                </div>
                
                <div className="space-y-3">
                  {residents.filter(r => r.village === managedVillage && r.status === 'pending').length === 0 ? (
                    <div className="bg-white p-10 rounded-[28px] border border-dashed border-slate-200 text-center opacity-40">
                       <p className="text-[9px] font-black uppercase tracking-widest">No pending approvals</p>
                    </div>
                  ) : (
                    residents.filter(r => r.village === managedVillage && r.status === 'pending').map(res => (
                      <div 
                        key={res.id} 
                        className="w-full bg-white p-4 rounded-[28px] border border-slate-100 flex flex-col gap-4 shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400">
                             {res.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                             <h4 className="font-black text-[14px] text-slate-800 truncate">{res.name}</h4>
                             <p className="text-[10px] font-bold text-slate-400">{res.email}</p>
                             <p className="text-[8px] font-black text-indigo-600 uppercase tracking-widest mt-1">{res.id}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <p className="text-[7px] font-black text-slate-400 uppercase">Mobile</p>
                            <p className="text-[10px] font-bold text-slate-700">{res.mobile || 'N/A'}</p>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl">
                            <p className="text-[7px] font-black text-slate-400 uppercase">Registered</p>
                            <p className="text-[10px] font-bold text-slate-700">{res.joinedAt}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button 
                            onClick={() => handleApproveUser(res.id)}
                            className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <Check size={14} /> Approve
                          </button>
                          <button 
                            onClick={() => handleRejectUser(res.id)}
                            className="flex-1 bg-rose-50 text-rose-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-rose-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
             </div>
          )}

          {activeTab === 'history' && (
             <div className="space-y-4">
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1 mb-2">Activity Log (History)</h3>
                {historyItems.length === 0 ? (
                  <div className="bg-white p-10 rounded-[28px] border border-dashed border-slate-200 text-center opacity-40">
                     <p className="text-[9px] font-black uppercase tracking-widest">No recent logs</p>
                  </div>
                ) : (
                  historyItems.map(item => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
                       <div className={`p-2 rounded-lg flex-shrink-0 ${item.type === 'payment' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                          {item.type === 'payment' ? <CreditCard size={14}/> : <FileText size={14}/>}
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="font-black text-[11px] text-slate-800">{item.userName}</h4>
                          <p className="text-[9px] font-bold text-slate-500">{item.action}</p>
                          <p className="text-[7px] font-black text-slate-300 uppercase mt-1">{item.date}</p>
                       </div>
                    </div>
                  ))
                )}
             </div>
          )}

          {activeTab === 'businesses' && (
             <div className="space-y-6">
                <div className="bg-white rounded-[32px] p-6 shadow-lg border border-slate-100 space-y-4">
                   <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-slate-800">Directory Hub</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => { setShowBizNoticeForm(!showBizNoticeForm); setShowBizForm(false); }}
                          className="bg-amber-500 text-white p-2 rounded-lg shadow-lg active:scale-90"
                        >
                          {showBizNoticeForm ? <X size={16}/> : <Megaphone size={16}/>}
                        </button>
                        <button 
                          onClick={() => { setShowBizForm(!showBizForm); setShowBizNoticeForm(false); }}
                          className="bg-indigo-600 text-white p-2 rounded-lg shadow-lg active:scale-90"
                        >
                           {showBizForm ? <X size={16}/> : <Plus size={16}/>}
                        </button>
                      </div>
                   </div>
                   
                   {showBizForm && (
                      <form onSubmit={handleAddBusiness} className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                         <input required placeholder="Business Name" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none" value={bizData.name} onChange={e => setBizData({...bizData, name: e.target.value})} />
                         <div className="grid grid-cols-2 gap-2">
                           <input required placeholder="Category" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none" value={bizData.category} onChange={e => setBizData({...bizData, category: e.target.value})} />
                           <input required placeholder="Contact" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none" value={bizData.contact} onChange={e => setBizData({...bizData, contact: e.target.value})} />
                         </div>
                         <input required placeholder="Hours" className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none" value={bizData.hours} onChange={e => setBizData({...bizData, hours: e.target.value})} />
                         <textarea required placeholder="Description..." className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold outline-none resize-none" rows={2} value={bizData.description} onChange={e => setBizData({...bizData, description: e.target.value})} />
                         <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg">Register</button>
                      </form>
                   )}

                   {showBizNoticeForm && (
                      <form onSubmit={handlePostBizNotice} className="space-y-3 animate-in slide-in-from-top-2 duration-300 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                         <input required placeholder="Announcement Title" className="w-full bg-white border border-amber-100 rounded-xl p-3 text-sm font-bold outline-none" value={bizNoticeData.title} onChange={e => setBizNoticeData({...bizNoticeData, title: e.target.value})} />
                         <textarea required placeholder="Write message..." className="w-full bg-white border border-amber-100 rounded-xl p-3 text-sm font-bold outline-none resize-none" rows={2} value={bizNoticeData.content} onChange={e => setBizNoticeData({...bizNoticeData, content: e.target.value})} />
                         <button type="submit" className="w-full bg-amber-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
                            <Send size={14} /> Publish
                         </button>
                      </form>
                   )}
                </div>

                <div className="space-y-6">
                   <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Approval Requests</h3>
                   {villageBusinesses.filter(b => b.status === 'Pending').length === 0 ? (
                      <div className="p-8 text-center bg-white rounded-[28px] border border-dashed border-slate-200 opacity-40">
                         <p className="text-[9px] font-black uppercase tracking-widest">All clear</p>
                      </div>
                   ) : (
                      villageBusinesses.filter(b => b.status === 'Pending').map(biz => (
                         <div key={biz.id} className="bg-white p-4 rounded-2xl border-2 border-amber-100 shadow-md space-y-4">
                            <div className="flex justify-between items-start">
                               <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                                     <Store size={18} />
                                  </div>
                                  <div>
                                     <h4 className="font-black text-[12px] text-slate-800">{biz.name}</h4>
                                     <p className="text-[8px] font-bold text-slate-400 uppercase">{biz.ownerName}</p>
                                  </div>
                               </div>
                            </div>
                            <div className="flex gap-2">
                               <button onClick={() => handleApproveBusiness(biz.id)} className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-black text-[9px] uppercase tracking-widest">
                                  Approve
                               </button>
                               <button onClick={() => onUpdateBusinesses(businesses.filter(b => b.id !== biz.id))} className="px-3 bg-rose-50 text-rose-500 rounded-lg">
                                  <Trash2 size={12} />
                               </button>
                            </div>
                         </div>
                      ))
                   )}
                </div>
             </div>
          )}
      </div>

      {selectedResident && (
        <ResidentDetailModal 
          resident={selectedResident} 
          onClose={() => setSelectedResident(null)} 
        />
      )}

      {processingRequest && (
        <ProcessRequestModal 
          request={processingRequest} 
          onClose={() => setProcessingRequest(null)} 
          onUpdate={onUpdateStatus}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
