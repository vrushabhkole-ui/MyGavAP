
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Home, Bot, Grid, User, Info, Loader2 } from 'lucide-react';
import Dashboard from './components/Dashboard.tsx';
import AISahayak from './components/AISahayak.tsx';
import Auth from './Auth.tsx';
import ServiceRequestsView from './components/ServiceRequestsView.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import ServiceDetail from './components/ServiceDetail.tsx';
import NotificationCenter from './components/NotificationCenter.tsx';
import CertificateForm from './components/CertificateForm.tsx';
import NOCForm from './components/NOCForm.tsx';
import ChavdiForm from './components/ChavdiForm.tsx';
import ElectricityForm from './components/ElectricityForm.tsx';
import GasForm from './components/GasForm.tsx';
import HealthForm from './components/HealthForm.tsx';
import NeedHelpForm from './components/NeedHelpForm.tsx';
import BusinessDirectory from './components/BusinessDirectory.tsx';
import OnboardingTour from './components/OnboardingTour.tsx';
import AboutView from './components/AboutView.tsx';
import MaharashtraEmblem from './components/MaharashtraEmblem.tsx';
import { 
  UserProfile, Language, ServiceType, ServiceRequest, 
  Bill, Transaction, VillageNotice, AppNotification, RequestStatus, FileMetadata, LocalBusiness
} from './types.ts';
import { DICTIONARY, SERVICES } from './constants.tsx';

const ONBOARDING_KEY = 'mygaav_onboarding_completed';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [currentView, setCurrentView] = useState<'dashboard' | 'assistant' | 'profile' | 'requests' | 'admin' | 'service-detail' | 'notifications' | 'form' | 'about'>('dashboard');
  const [isViewLoading, setIsViewLoading] = useState(false);
  
  const [activeServiceId, setActiveServiceId] = useState<ServiceType | null>(null);
  const [activePortalIdx, setActivePortalIdx] = useState<number | undefined>(undefined);
  
  // Application Data States
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notices, setNotices] = useState<VillageNotice[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [residents, setResidents] = useState<UserProfile[]>([]);
  const [businesses, setBusinesses] = useState<LocalBusiness[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedVillages, setSelectedVillages] = useState<string[]>([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const lastSyncedData = React.useRef<Record<string, string>>({});

  // Persistence Helpers
  const syncToServer = async (path: string, data: any) => {
    if (!isInitialLoadComplete) return;
    
    const dataString = JSON.stringify(data);
    if (lastSyncedData.current[path] === dataString) {
      return; // Skip if data hasn't actually changed
    }
    lastSyncedData.current[path] = dataString;

    try {
      const response = await fetch(`/api/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: dataString
      });
      if (!response.ok) throw new Error('Server error');
    } catch (e) {
      console.warn(`Failed to sync ${path} to server, falling back to local storage`);
      localStorage.setItem(`MYGAAV_DATA_${path.toUpperCase()}`, dataString);
    }
  };

  useEffect(() => {
    if (user && selectedVillages.length === 0) {
      setSelectedVillages([user.village]);
    }
  }, [user]);

  // Sync to Server Effects
  useEffect(() => { syncToServer('requests', requests); }, [requests]);
  useEffect(() => { syncToServer('bills', bills); }, [bills]);
  useEffect(() => { syncToServer('transactions', transactions); }, [transactions]);
  useEffect(() => { syncToServer('notices', notices); }, [notices]);
  useEffect(() => { syncToServer('notifications', notifications); }, [notifications]);
  useEffect(() => { syncToServer('businesses', businesses); }, [businesses]);

  useEffect(() => {
    if (user) {
      setIsViewLoading(true);
      const timer = setTimeout(() => setIsViewLoading(false), 400);
      return () => clearTimeout(timer);
    }
  }, [currentView, user]);

  const loadResidentsFromServer = async () => {
    try {
      const response = await fetch('/api/accounts');
      if (response.ok) {
        const allUsers = await response.json() as UserProfile[];
        setResidents(allUsers.filter(u => u.role === 'user'));
      } else {
        throw new Error('Server error');
      }
    } catch (e) {
      console.warn("Failed to load residents from server, falling back to local storage");
      const localUsers = JSON.parse(localStorage.getItem('MYGAAV_USER_REGISTRY') || '[]') as UserProfile[];
      setResidents(localUsers.filter(u => u.role === 'user'));
    }
  };

  useEffect(() => {
    const socket = io();

    socket.on('data-update-requests', (data) => { setRequests(data); });
    socket.on('data-update-bills', (data) => { setBills(data); });
    socket.on('data-update-transactions', (data) => { setTransactions(data); });
    socket.on('data-update-notices', (data) => { setNotices(data); });
    socket.on('data-update-notifications', (data) => { setNotifications(data); });
    socket.on('data-update-businesses', (data) => { setBusinesses(data); });
    socket.on('data-update-accounts', (data) => { setResidents(data.filter((u: any) => u.role === 'user')); });

    const session = localStorage.getItem('mygaav_active_session');
    if (session) {
      try {
        const u = JSON.parse(session);
        setUser(u);
        setCurrentView(u.role === 'admin' ? 'admin' : 'dashboard');
        if (u.role === 'user') {
          const completed = localStorage.getItem(`${ONBOARDING_KEY}_${u.id}`);
          if (!completed) setShowOnboarding(true);
        }
      } catch (e) { console.error(e); }
    }

    const loadFromServer = async (path: string, setter: Function) => {
      try {
        const response = await fetch(`/api/${path}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) setter(data);
        } else {
          throw new Error('Server error');
        }
      } catch (e) {
        console.warn(`Failed to load ${path} from server, falling back to local storage`);
        const localData = JSON.parse(localStorage.getItem(`MYGAAV_DATA_${path.toUpperCase()}`) || '[]');
        if (localData && localData.length > 0) setter(localData);
      }
    };

    const loadAll = async () => {
      await Promise.all([
        loadResidentsFromServer(),
        loadFromServer('requests', setRequests),
        loadFromServer('transactions', setTransactions),
        loadFromServer('notifications', setNotifications),
        loadFromServer('businesses', setBusinesses),
        loadFromServer('bills', setBills),
        loadFromServer('notices', setNotices)
      ]);
      setIsInitialLoadComplete(true);
    };

    loadAll();

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogin = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem('mygaav_active_session', JSON.stringify(profile));
    loadResidentsFromServer();

    if (profile.role === 'user') {
      const completed = localStorage.getItem(`${ONBOARDING_KEY}_${profile.id}`);
      if (!completed) setShowOnboarding(true);
    }
    setCurrentView(profile.role === 'admin' ? 'admin' : 'dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('mygaav_active_session');
    setCurrentView('dashboard');
    setShowOnboarding(false);
  };

  const handleOnboardingComplete = () => {
    if (user) localStorage.setItem(`${ONBOARDING_KEY}_${user.id}`, 'true');
    setShowOnboarding(false);
  };

  const handleNewRequest = (serviceId: ServiceType, description: string, userDoc?: FileMetadata) => {
    if (!user) return;
    const newReq: ServiceRequest = {
      id: `REQ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      userId: user.id,
      userName: user.name,
      state: user.state,
      district: user.district,
      village: user.village,
      subDistrict: user.subDistrict,
      pincode: user.pincode,
      serviceId,
      serviceTitle: SERVICES.find(s => s.id === serviceId)?.title[language] || 'Service',
      description,
      status: 'Pending',
      createdAt: new Date().toLocaleDateString('en-IN'),
      source: 'user',
      userDocument: userDoc
    };
    setRequests(prev => [newReq, ...prev]);
    setCurrentView('requests');
    addNotification('Request Submitted', `Your ticket for ${newReq.serviceTitle} has been received.`, 'success');
  };

  const handleIssueNotice = (notice: VillageNotice) => {
    if (!user) return;
    const scopedNotice = { 
      ...notice, 
      state: user.state,
      district: user.district,
      village: user.village, 
      subDistrict: user.subDistrict,
      pincode: user.pincode
    };
    setNotices(prev => [scopedNotice, ...prev]);
    addNotification('New Announcement', `Notice: ${notice.title} published.`, 'info');
  };

  const handleDeleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
  };

  const updateRequestStatus = (id: string, status: RequestStatus, report?: string, adminDoc?: FileMetadata) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, adminReport: report, adminDocument: adminDoc } : r));
    addNotification('Ticket Update', `A request status has changed to ${status}.`, 'info');
  };

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'alert') => {
    const n: AppNotification = { id: Math.random().toString(36).substr(2, 9), title, message, type, time: 'Just now', read: false };
    setNotifications(prev => [n, ...prev]);
  };

  const handleUpdateBusinesses = (biz: LocalBusiness[]) => {
    setBusinesses(biz);
    addNotification('Directory Updated', 'Local business registry has been updated.', 'info');
  };

  const handleUpdateResidents = async (updatedResidents: UserProfile[]) => {
    setResidents(updatedResidents);
    try {
      const response = await fetch('/api/accounts');
      if (response.ok) {
        const allUsers = await response.json() as UserProfile[];
        const newAllUsers = allUsers.map(u => {
          const found = updatedResidents.find(r => r.id === u.id);
          return found ? { ...u, ...found } : u;
        });
        await syncToServer('accounts', newAllUsers);
      } else {
        throw new Error('Server error');
      }
    } catch (e) {
      console.warn("Failed to update residents on server, falling back to local storage");
      const localUsers = JSON.parse(localStorage.getItem('MYGAAV_USER_REGISTRY') || '[]') as UserProfile[];
      const newAllUsers = localUsers.map(u => {
        const found = updatedResidents.find(r => r.id === u.id);
        return found ? { ...u, ...found } : u;
      });
      localStorage.setItem('MYGAAV_USER_REGISTRY', JSON.stringify(newAllUsers));
    }
  };

  const handleRegisterBusiness = (biz: Omit<LocalBusiness, 'id' | 'village' | 'subDistrict' | 'status'>) => {
    if (!user) return;
    const newBiz: LocalBusiness = {
      ...biz,
      id: `BZ-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      state: user.state,
      district: user.district,
      village: user.village,
      subDistrict: user.subDistrict,
      pincode: user.pincode,
      status: 'Pending'
    };
    setBusinesses(prev => [...prev, newBiz]);
    addNotification('Listing Received', `${newBiz.name} registration is pending officer approval.`, 'info');
  };

  const t = (key: string) => DICTIONARY[key]?.[language] || key;

  if (!user) return <Auth onLogin={handleLogin} />;

  const activeService = SERVICES.find(s => s.id === activeServiceId);
  const userNotices = notices.filter(n => 
    n.state === user.state &&
    n.district === user.district &&
    n.village === user.village && 
    n.subDistrict === user.subDistrict &&
    n.pincode === user.pincode
  );

  return (
    <div className="max-w-md mx-auto bg-slate-50 h-[100dvh] relative shadow-2xl overflow-hidden flex flex-col">
      <main className="flex-1 overflow-hidden relative">
        {isViewLoading && (
          <div className="absolute inset-0 z-[60] bg-slate-50/80 backdrop-blur-[2px] flex flex-col items-center justify-center animate-in fade-in duration-300">
             <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-4">
                <Loader2 className="text-emerald-500 animate-spin" size={32} />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('appName')} Assistant...</p>
          </div>
        )}

        {user.role === 'admin' ? (
          <AdminDashboard 
            lang={language} 
            user={user} 
            requests={requests} 
            residents={residents} 
            bills={bills} 
            notices={notices}
            transactions={transactions}
            businesses={businesses}
            onUpdateBusinesses={handleUpdateBusinesses}
            onUpdateResidents={handleUpdateResidents}
            onUpdateStatus={updateRequestStatus} 
            onIssueBill={(b) => setBills(prev => [{ 
              ...b, 
              state: user.state,
              district: user.district,
              village: user.village, 
              subDistrict: user.subDistrict,
              pincode: user.pincode
            }, ...prev])} 
            onMarkBillPaid={(id) => {
              setBills(prev => prev.map(b => b.id === id ? { ...b, status: 'Paid' } : b));
              const bill = bills.find(b => b.id === id);
              if (bill) {
                const newTx: Transaction = {
                  id: `TX-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                  billId: bill.id,
                  userId: bill.userId,
                  userName: residents.find(r => r.id === bill.userId)?.name || 'Resident',
                  state: bill.state,
                  district: bill.district,
                  village: bill.village,
                  subDistrict: bill.subDistrict,
                  pincode: bill.pincode,
                  type: bill.type,
                  amount: bill.amount,
                  recipient: user.name, // Admin name
                  vpa: 'CASH-PAYMENT',
                  timestamp: new Date().toLocaleString(),
                  status: 'Success',
                  referenceId: `CASH-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
                };
                setTransactions(prev => [newTx, ...prev]);
              }
            }}
            onDeleteBill={(id) => setBills(prev => prev.filter(b => b.id !== id))}
            onIssueNotice={handleIssueNotice} 
            onDeleteNotice={handleDeleteNotice}
            onLogout={handleLogout}
          />
        ) : (
          <>
            {currentView === 'dashboard' && (
              <Dashboard 
                lang={language} 
                user={user} 
                bills={bills.filter(b => b.userId === user.id)} 
                notices={userNotices} 
                selectedVillages={selectedVillages}
                onSetLang={setLanguage} 
                onSelectService={(id) => { setActiveServiceId(id); setCurrentView('service-detail'); }} 
                onOpenNotifications={() => setCurrentView('notifications')} 
                onAddVillage={(v) => {
                  if (!selectedVillages.includes(v)) {
                    setSelectedVillages([...selectedVillages, v]);
                  }
                }}
                onRemoveVillage={(v) => {
                  setSelectedVillages(selectedVillages.filter(sv => sv !== v));
                }}
                hasUnread={notifications.some(n => !n.read)} 
              />
            )}

            {currentView === 'service-detail' && activeServiceId === ServiceType.BUSINESS && (
              <BusinessDirectory 
                lang={language}
                businesses={businesses.filter(b => b.village === user.village)}
                onBack={() => setCurrentView('dashboard')}
                onRegisterBusiness={handleRegisterBusiness}
                onRaiseHelp={() => { setActivePortalIdx(undefined); setCurrentView('form'); }}
              />
            )}

            {currentView === 'service-detail' && activeService && activeServiceId !== ServiceType.BUSINESS && (
              <ServiceDetail 
                lang={language} 
                service={activeService} 
                bills={bills.filter(b => b.userId === user.id)} 
                onBack={() => setCurrentView('dashboard')} 
                onAskAI={() => setCurrentView('assistant')} 
                onRaiseRequest={(idx) => { setActivePortalIdx(idx); setCurrentView('form'); }}
              />
            )}

            {currentView === 'form' && activeService && (
              activePortalIdx === undefined ? (
                <NeedHelpForm 
                  lang={language} 
                  service={activeService} 
                  onBack={() => setCurrentView('service-detail')} 
                  onSubmit={(id, desc) => { handleNewRequest(id, desc); setCurrentView('requests'); }} 
                />
              ) : (
                activeServiceId === ServiceType.GRAMPANCHAYAT ? (
                   activePortalIdx === 2 
                    ? <NOCForm lang={language} onBack={() => setCurrentView('service-detail')} onSubmit={handleNewRequest} />
                    : <CertificateForm lang={language} onBack={() => setCurrentView('service-detail')} onSubmit={handleNewRequest} />
                ) : activeServiceId === ServiceType.CHAVDI ? (
                   <ChavdiForm 
                     lang={language} 
                     portalIdx={activePortalIdx || 0} 
                     onBack={() => setCurrentView('service-detail')} 
                     onSubmit={handleNewRequest} 
                   />
                ) : activeServiceId === ServiceType.ELECTRICITY ? (
                   <ElectricityForm lang={language} onBack={() => setCurrentView('service-detail')} onSubmit={handleNewRequest} />
                ) : activeServiceId === ServiceType.GAS ? (
                   <GasForm lang={language} onBack={() => setCurrentView('service-detail')} onSubmit={handleNewRequest} />
                ) : activeServiceId === ServiceType.HEALTH ? (
                   <HealthForm 
                     lang={language} 
                     portalIdx={activePortalIdx || 0} 
                     onBack={() => setCurrentView('service-detail')} 
                     onSubmit={handleNewRequest} 
                   />
                ) : null
              )
            )}

            {currentView === 'assistant' && <AISahayak lang={language} />}
            
            {currentView === 'requests' && (
              <ServiceRequestsView 
                lang={language} 
                requests={requests.filter(r => r.userId === user.id)} 
                onBack={() => setCurrentView('dashboard')} 
                onNewRequest={handleNewRequest} 
                onUpdateStatus={updateRequestStatus} 
              />
            )}

            {currentView === 'notifications' && (
              <NotificationCenter 
                notifications={notifications} 
                onBack={() => setCurrentView('dashboard')} 
                onClearAll={() => setNotifications([])} 
                onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))} 
              />
            )}

            {currentView === 'about' && <AboutView lang={language} />}

            {currentView === 'profile' && (
              <div className="h-full flex flex-col bg-slate-50">
                <div className="px-4 py-2 bg-slate-50 flex items-center justify-between border-b border-slate-100">
                  <MaharashtraEmblem size="sm" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('digitalGaavPortal')}</span>
                </div>
                <div className="p-8 flex-1 overflow-y-auto">
                  <header className="flex items-center gap-4 mb-10">
                    <button onClick={() => setCurrentView('dashboard')} className="p-2 bg-white rounded-xl shadow-sm text-slate-400">
                        <Home size={20} />
                    </button>
                    <h1 className="text-xl font-black text-slate-800">{t('myProfile')}</h1>
                  </header>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-24 h-24 bg-emerald-100 rounded-[32px] flex items-center justify-center mb-6 shadow-inner">
                      <User size={48} className="text-emerald-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user.name}</h2>
                    <p className="text-[10px] font-black uppercase text-slate-400 mt-2 tracking-widest">{user.village}, {user.district}</p>
                    
                    <div className="mt-12 w-full space-y-4">
                      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-400">{t('email')}</span>
                            <span className="text-slate-800">{user.email}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-400">{t('residentId')}</span>
                            <span className="text-emerald-600 font-mono">{user.id}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-400">{t('memberSince')}</span>
                            <span className="text-slate-800">{user.joinedAt}</span>
                        </div>
                      </div>
                      
                      <button onClick={handleLogout} className="w-full py-5 bg-rose-50 text-rose-600 rounded-[32px] font-black uppercase text-[11px] tracking-widest border border-rose-100 shadow-sm active:scale-95 transition-all">
                        {t('logout')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {user.role === 'user' && (
        <nav className="bg-white border-t border-slate-100 flex items-center justify-around py-4 px-3 rounded-t-[32px] shadow-lg relative z-40 flex-shrink-0">
          <button onClick={() => setCurrentView('dashboard')} className={`flex flex-col items-center gap-1.5 transition-all ${currentView === 'dashboard' ? 'text-emerald-600 scale-110' : 'text-slate-300'}`}>
            <Home size={22} strokeWidth={currentView === 'dashboard' ? 3 : 2} />
            <span className="text-[8px] font-black uppercase tracking-tighter">{t('home')}</span>
          </button>
          <button onClick={() => setCurrentView('requests')} className={`flex flex-col items-center gap-1.5 transition-all ${currentView === 'requests' ? 'text-emerald-600 scale-110' : 'text-slate-300'}`}>
            <Grid size={22} strokeWidth={currentView === 'requests' ? 3 : 2} />
            <span className="text-[8px] font-black uppercase tracking-tighter">{t('tickets')}</span>
          </button>
          <button onClick={() => setCurrentView('assistant')} className={`flex flex-col items-center gap-1.5 transition-all ${currentView === 'assistant' ? 'text-emerald-600 scale-110' : 'text-slate-300'}`}>
            <Bot size={22} strokeWidth={currentView === 'assistant' ? 3 : 2} />
            <span className="text-[8px] font-black uppercase tracking-tighter">{t('sahayak')}</span>
          </button>
          <button onClick={() => setCurrentView('profile')} className={`flex flex-col items-center gap-1.5 transition-all ${currentView === 'profile' ? 'text-emerald-600 scale-110' : 'text-slate-300'}`}>
            <User size={22} strokeWidth={currentView === 'profile' ? 3 : 2} />
            <span className="text-[8px] font-black uppercase tracking-tighter">{t('profile')}</span>
          </button>
          <button onClick={() => setCurrentView('about')} className={`flex flex-col items-center gap-1.5 transition-all ${currentView === 'about' ? 'text-emerald-600 scale-110' : 'text-slate-300'}`}>
            <Info size={22} strokeWidth={currentView === 'about' ? 3 : 2} />
            <span className="text-[8px] font-black uppercase tracking-tighter">{t('about')}</span>
          </button>
        </nav>
      )}

      {showOnboarding && <OnboardingTour lang={language} onComplete={handleOnboardingComplete} />}
    </div>
  );
};

export default App;
