
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Mail, Lock, User, ArrowRight, ShieldAlert, UserCheck, Trash2, Eye, EyeOff, MapPin, Globe, Building2, Map, ShieldCheck, AlertCircle, Briefcase, Edit3, ChevronDown, CheckCircle2, Building, Zap, Flame, FileText, HeartPulse, ShoppingBasket, Phone, Hash, BriefcaseBusiness, Key, Search, X, Loader2, Code } from 'lucide-react';
import Logo from './components/Logo.tsx';
import MaharashtraEmblem from './components/MaharashtraEmblem.tsx';
import { UserProfile, UserRole, ServiceType, StoredAccount } from './types.ts';
import { INDIA_LOCATIONS, DEPARTMENTS, DICTIONARY } from './constants.tsx';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

export const USER_REGISTRY_KEY = 'MYGAAV_USER_REGISTRY';
const OFFICER_KEYS_KEY = 'MYGAAV_OFFICER_KEYS';
const COLORS = ['bg-emerald-600', 'bg-indigo-600', 'bg-amber-600', 'bg-rose-600', 'bg-blue-600', 'bg-orange-600'];

interface LocationResult {
  Name: string;
  Block: string;
  District: string;
  State: string;
  Pincode: string;
  Division?: string;
}

const VillageSearch = ({ 
  onSelect, 
  t 
}: { 
  onSelect: (loc: LocationResult) => void,
  t: (key: string) => string 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setIsSearching(true);
        try {
          const isPincode = /^\d+$/.test(query);
          const url = isPincode 
            ? `https://api.postalpincode.in/pincode/${query}`
            : `https://api.postalpincode.in/postoffice/${query}`;
            
          const res = await fetch(url);
          const data = await res.json();
          if (data && data[0] && data[0].Status === 'Success') {
            setResults(data[0].PostOffice || []);
            setShowDropdown(true);
          } else {
            setResults([]);
          }
        } catch (e) {
          console.error(e);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative mb-4">
      <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Search Village or Pincode..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
          className="bg-transparent outline-none text-sm w-full font-black text-slate-800"
        />
        {query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowDropdown(false);
            }}
            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={16} className="text-slate-400" />
          </button>
        )}
        {isSearching && <Loader2 size={16} className="text-emerald-500 animate-spin" />}
      </div>
      
      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto">
          {results.map((res, idx) => (
            <button
              key={idx}
              type="button"
              onClick={async () => {
                setShowDropdown(false);
                setQuery(`${res.Name}, ${res.District}, ${res.State} - ${res.Pincode}`);
                let finalLoc = { ...res };
                if (!finalLoc.Block || finalLoc.Block === 'NA') {
                  try {
                    const pinRes = await fetch(`https://api.postalpincode.in/pincode/${res.Pincode}`);
                    const pinData = await pinRes.json();
                    if (pinData && pinData[0] && pinData[0].Status === 'Success') {
                      const match = pinData[0].PostOffice.find((po: any) => po.Name === res.Name) || pinData[0].PostOffice[0];
                      if (match && match.Block && match.Block !== 'NA') {
                        finalLoc.Block = match.Block;
                      }
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }
                onSelect(finalLoc);
                setQuery(`${finalLoc.Name}, ${(finalLoc.Block && finalLoc.Block !== 'NA') ? finalLoc.Block + ', ' : (finalLoc.Division && finalLoc.Division !== 'NA' ? finalLoc.Division + ', ' : '')}${finalLoc.District}, ${finalLoc.State} - ${finalLoc.Pincode}`);
              }}
              className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors"
            >
              <p className="text-sm font-bold text-slate-800">{res.Name}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                State: {res.State} • District: {res.District} • Subdistrict: {(res.Block && res.Block !== 'NA') ? res.Block : (res.Division && res.Division !== 'NA' ? res.Division : 'N/A')} • Pincode: {res.Pincode}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('user');
  const [showPass, setShowPass] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi' | 'mr'>('en');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    pincode: '',
    address: '',
    state: 'Maharashtra',
    district: 'Pune',
    subDistrict: 'Haveli',
    village: 'Sukhawadi',
    department: ServiceType.GRAMPANCHAYAT,
    gpId: '',
    electricityNo: '',
    gasId: '',
    chavdiNo: '',
    healthId: '',
    officerKey: '',
    assignedAdminId: ''
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [savedAccounts, setSavedAccounts] = useState<StoredAccount[]>([]);
  const [serverOfficerKeys, setServerOfficerKeys] = useState<string[]>([]);
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [showAdminDropdown, setShowAdminDropdown] = useState(false);

  const t = (key: string) => DICTIONARY[key]?.[lang] || key;

  const validateOfficerKey = (key: string) => {
    const upperKey = key.toUpperCase().trim();
    return serverOfficerKeys.includes(upperKey);
  };

  useEffect(() => {
    // Wipe old localStorage data on first load of this update
    const dataCleared = localStorage.getItem('MYGAAV_DATA_WIPED_V4');
    if (!dataCleared) {
      localStorage.removeItem(USER_REGISTRY_KEY);
      localStorage.removeItem(OFFICER_KEYS_KEY);
      localStorage.setItem('MYGAAV_DATA_WIPED_V4', 'true');
    }

    const socket = io();
    socket.on('data-update-accounts', (data) => {
      setSavedAccounts(data);
    });

    // Fetch accounts and keys from backend
    const fetchData = async () => {
      try {
        const [accResp, keyResp] = await Promise.all([
          fetch('/api/accounts').catch(() => null),
          fetch('/api/officer-keys').catch(() => null)
        ]);
        
        if (accResp && accResp.ok) {
          const data = await accResp.json();
          setSavedAccounts(data);
        } else {
          const localAccounts = JSON.parse(localStorage.getItem(USER_REGISTRY_KEY) || '[]');
          if (localAccounts.length > 0) setSavedAccounts(localAccounts);
        }

        if (keyResp && keyResp.ok) {
          const keys = await keyResp.json();
          setServerOfficerKeys(keys);
        } else {
          const localKeys = JSON.parse(localStorage.getItem(OFFICER_KEYS_KEY) || '[]');
          if (localKeys.length === 0) {
            const fallbackKeys = ['OFFICER01', 'OFFICER02', 'MAHA7788', 'PUNE9900', 'GAAV1122', 'ADMIN889'];
            localStorage.setItem(OFFICER_KEYS_KEY, JSON.stringify(fallbackKeys));
            setServerOfficerKeys(fallbackKeys);
          } else {
            setServerOfficerKeys(localKeys);
          }
        }
      } catch (e) {
        console.error("Failed to fetch data", e);
      }
    };
    fetchData();

    return () => {
      socket.disconnect();
    };
  }, []);

  const saveToRegistry = async (profile: UserProfile, password?: string): Promise<StoredAccount | null> => {
    const stored: StoredAccount = { 
      ...profile, 
      password: password || '', 
      avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)] 
    };
    
    try {
      // Check connectivity first
      try {
        const ping = await fetch('/api/ping');
        if (!ping.ok) {
          console.warn('API ping failed:', ping.status);
        }
      } catch (e) {
        console.warn('API ping error:', e);
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stored)
      });
      
      if (response.ok) {
        const data = await response.json();
        // Server returns the updated list of accounts
        if (data.accounts) {
          setSavedAccounts(data.accounts);
        } else {
          setSavedAccounts(prev => [...prev.filter(a => a.email && profile.email && a.email.toLowerCase() !== profile.email.toLowerCase()), stored]);
        }
        return stored;
      } else {
        const text = await response.text();
        try {
            const err = JSON.parse(text);
            setError(err.error || 'Registration failed');
        } catch (e) {
            console.error('Registration failed, non-JSON response:', text);
            setError(`Registration failed. Server returned unexpected response: ${response.status} ${response.statusText}. Details: ${text.substring(0, 50)}...`);
        }
        return null;
      }
    } catch (e) {
      console.error('Server connection failed', e);
      setError('Connection error. Please check your internet.');
      return null;
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const emailKey = (formData.email || '').trim().toLowerCase();

    if (!isLogin && role === 'admin') {
      if (!formData.officerKey) {
        setError('Officer Access Key is required');
        return;
      }
      if (!validateOfficerKey(formData.officerKey)) {
        setError('Invalid Officer Access Key');
        return;
      }
    }

    if (isLogin) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailKey,
            password: formData.password,
            role,
            department: formData.department
          })
        });

        const data = await response.json();

        if (response.ok) {
          onLogin(data.account);
        } else {
          setError(data.error || 'Invalid credentials.');
        }
      } catch (e) {
        console.error('Login error', e);
        setError('Connection error. Please check your internet.');
      }
      return;
    }

    // Registration flow
    // Re-fetch accounts to ensure we have the latest for validation
    let currentAccounts = savedAccounts;
    try {
      const resp = await fetch('/api/accounts');
      if (resp.ok) {
        currentAccounts = await resp.json();
        setSavedAccounts(currentAccounts);
      }
    } catch (e) {
      console.error('Failed to fetch accounts during registration', e);
    }

    // Check if email or mobile already exists
    if (currentAccounts.some((a: any) => a.email && a.email.toLowerCase() === emailKey)) {
      setError('This email is already registered. Please login instead.');
      return;
    }
    if (formData.mobile && currentAccounts.some((a: any) => a.mobile && String(a.mobile) === String(formData.mobile))) {
      setError('This mobile number is already registered. Please use a different one.');
      return;
    }

    const profile: UserProfile = {
      id: `MG-${role === 'admin' ? 'OFF' : 'RES'}-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      email: emailKey,
      mobile: formData.mobile,
      pincode: formData.pincode,
      address: formData.address,
      state: formData.state,
      district: formData.district,
      subDistrict: formData.subDistrict,
      village: formData.village,
      role,
      department: role === 'admin' ? formData.department : undefined,
      joinedAt: new Date().toLocaleString('en-IN'),
      status: 'approved', // Auto-approve for seamless onboarding
      assignedAdminId: role === 'user' ? formData.assignedAdminId : undefined
    };
    
    const registeredAccount = await saveToRegistry(profile, formData.password);
    if (registeredAccount) {
      onLogin(registeredAccount);
    }
  };

  if (role === 'developer') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-slate-900 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 w-full shadow-2xl space-y-6">
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <Code size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Developer Console</h2>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            if (formData.email === 'dev@gmail.com' && formData.password === 'dev1008') {
               const devProfile: UserProfile = {
                 id: 'DEV-MASTER',
                 name: 'System Developer',
                 email: 'dev@gmail.com',
                 role: 'developer',
                 state: 'Maharashtra',
                 district: 'Pune',
                 subDistrict: 'Haveli',
                 village: 'Sukhawadi',
                 status: 'approved'
               };
               onLogin(devProfile);
            } else {
              setError('Invalid Developer Credentials');
            }
          }} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Developer ID</label>
              <input 
                type="email" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-slate-900 transition-colors"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="dev@gmail.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Key</label>
              <input 
                type="password" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-slate-900 transition-colors"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                placeholder="•••••••"
              />
            </div>
            
            {error && <p className="text-xs font-bold text-rose-500 text-center">{error}</p>}

            <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-colors">
              Access Console
            </button>
            
            <button 
              type="button" 
              onClick={() => {
                setRole('user');
                setError('');
                setFormData({...formData, email: '', password: ''});
              }}
              className="w-full py-3 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Back to App
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-slate-50 flex flex-col overflow-hidden">
      <div className="bg-white pt-10 pb-6 px-4 flex flex-col items-center gap-2 border-b border-slate-100 shadow-sm relative shrink-0">
        <Logo size="md" />
        <div className="flex bg-slate-100 p-1 rounded-xl mt-2">
          {(['en', 'hi', 'mr'] as const).map(l => (
            <button key={l} onClick={() => setLang(l)} className={`px-3 py-1 rounded-lg text-[10px] font-black ${lang === l ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 hide-scrollbar space-y-8">
        <section className="space-y-4">
          <div className="flex bg-white p-1.5 rounded-[32px] shadow-sm border border-slate-100">
            <button onClick={() => setRole('user')} className={`flex-1 py-4 rounded-[24px] text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${role === 'user' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400'}`}>
              <UserCheck size={18} /> {t('residentPortal')}
            </button>
            <button onClick={() => setRole('admin')} className={`flex-1 py-4 rounded-[24px] text-xs font-black uppercase transition-all flex items-center justify-center gap-2 ${role === 'admin' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>
              <ShieldAlert size={18} /> {t('officerPortal')}
            </button>
          </div>
        </section>

        <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100">
          <div className="flex bg-slate-50 p-1 rounded-xl mb-8 border border-slate-100">
            <button type="button" onClick={() => { setIsLogin(true); setError(''); setSuccessMsg(''); }} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest ${isLogin ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400'}`}>Login</button>
            <button type="button" onClick={() => { setIsLogin(false); setError(''); setSuccessMsg(''); }} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest ${!isLogin ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400'}`}>Signup</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {isLogin && savedAccounts.length > 0 && (
              <div className="pb-4 border-b border-slate-50">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2 block">Registered Accounts ({savedAccounts.length})</label>
                <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                  {savedAccounts.slice(0, 5).map(acc => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, email: acc.email });
                        setRole(acc.role as UserRole);
                        if (acc.department) setFormData(prev => ({ ...prev, department: acc.department as ServiceType }));
                      }}
                      className="flex flex-col items-center gap-1 shrink-0 group"
                    >
                      <div className={`w-10 h-10 rounded-full ${acc.avatarColor || 'bg-slate-200'} flex items-center justify-center text-white text-xs font-black shadow-sm group-hover:scale-110 transition-transform`}>
                        {acc.name.charAt(0)}
                      </div>
                      <span className="text-[8px] font-bold text-slate-500 max-w-[50px] truncate">{acc.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!isLogin && role === 'admin' && (
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">{t('selectDepartment')}</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <BriefcaseBusiness size={18} className="text-indigo-600" />
                  <select className="bg-transparent outline-none text-sm w-full font-black text-slate-800" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value as ServiceType})}>
                    {DEPARTMENTS.map(dept => <option key={dept.id} value={dept.id}>{dept.label}</option>)}
                  </select>
                </div>
              </div>
            )}

            {!isLogin && (
              <>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <User size={18} className="text-slate-400" />
                  <input required placeholder={t('fullName')} className="bg-transparent outline-none text-sm w-full font-black text-slate-800" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <Phone size={18} className="text-slate-400" />
                  <input required type="tel" placeholder={t('mobileNumber')} className="bg-transparent outline-none text-sm w-full font-black text-slate-800" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
                </div>
              </>
            )}

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
              <Mail size={18} className="text-slate-400" />
              <input required type="email" placeholder={t('emailAddress')} className="bg-transparent outline-none text-sm w-full font-black text-slate-800" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
              <Lock size={18} className="text-slate-400" />
              <input required type={showPass ? "text" : "password"} placeholder={t('password')} className="bg-transparent outline-none text-sm w-full font-black text-slate-800" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-slate-300">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {!isLogin && role === 'admin' && (
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Officer Access Key</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <Key size={18} className="text-indigo-600" />
                  <input required placeholder="Enter 8-Character Key" className="bg-transparent outline-none text-sm w-full font-black text-slate-800 uppercase" maxLength={8} value={formData.officerKey} onChange={e => setFormData({...formData, officerKey: e.target.value})} />
                </div>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-4 pt-4">
                <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">{t('villageConnectivity')}</h3>
                <VillageSearch 
                  t={t}
                  onSelect={(loc) => {
                    setFormData({
                      ...formData,
                      state: loc.State || '',
                      district: loc.District || '',
                      subDistrict: (loc.Block && loc.Block !== 'NA') ? loc.Block : (loc.Division && loc.Division !== 'NA' ? loc.Division : ''),
                      village: loc.Name || '',
                      pincode: loc.Pincode || ''
                    });
                  }}
                />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 opacity-70">
                      <Globe size={18} className="text-slate-400" />
                      <input required readOnly placeholder={t('state')} className="bg-transparent outline-none text-sm w-full font-black text-slate-800" value={formData.state || ''} />
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 opacity-70">
                      <Map size={18} className="text-slate-400" />
                      <input required readOnly placeholder={t('district')} className="bg-transparent outline-none text-sm w-full font-black text-slate-800" value={formData.district || ''} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
                      <Building2 size={18} className="text-slate-400" />
                      <input required placeholder={t('taluka')} className="bg-transparent outline-none text-sm w-full font-black text-slate-800" value={formData.subDistrict || ''} onChange={e => setFormData({...formData, subDistrict: e.target.value})} />
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 opacity-70">
                      <MapPin size={18} className="text-slate-400" />
                      <input required readOnly placeholder={t('village')} className="bg-transparent outline-none text-sm w-full font-black text-slate-800" value={formData.village || ''} />
                    </div>
                  </div>
                  
                  {!isLogin && role === 'admin' && (
                    <div className="flex items-center gap-2 px-2 py-1">
                      <input 
                        type="checkbox" 
                        id="manageAll" 
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={formData.village === 'All'}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, village: 'All'});
                          } else {
                            setFormData({...formData, village: ''});
                          }
                        }}
                      />
                      <label htmlFor="manageAll" className="text-[10px] font-black text-slate-600 uppercase tracking-widest cursor-pointer">Manage all villages in Taluka</label>
                    </div>
                  )}
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 opacity-70">
                    <Hash size={18} className="text-slate-400" />
                    <input required readOnly placeholder={t('pincode')} className="bg-transparent outline-none text-sm w-full font-black text-slate-800" value={formData.pincode || ''} />
                  </div>

                  {!isLogin && role === 'user' && (
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Select Admin</h3>
                      <div className="relative">
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                          <Search size={18} className="text-slate-400" />
                          <input 
                            type="text"
                            placeholder="Search admin by name or village..."
                            className="bg-transparent outline-none text-sm w-full font-black text-slate-800"
                            value={adminSearchQuery}
                            onChange={(e) => {
                              setAdminSearchQuery(e.target.value);
                              setShowAdminDropdown(true);
                              if (formData.assignedAdminId) {
                                setFormData({...formData, assignedAdminId: ''});
                              }
                            }}
                            onFocus={() => setShowAdminDropdown(true)}
                          />
                          {adminSearchQuery.length > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setAdminSearchQuery('');
                                setFormData({...formData, assignedAdminId: ''});
                                setShowAdminDropdown(false);
                              }}
                              className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                            >
                              <X size={16} className="text-slate-400" />
                            </button>
                          )}
                        </div>
                        {showAdminDropdown && (
                          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-60 overflow-y-auto">
                            {savedAccounts.filter(a => 
                              a.role === 'admin' && 
                              (adminSearchQuery.length > 0
                                ? ((a.name && a.name.toLowerCase().includes(adminSearchQuery.toLowerCase())) || 
                                   (a.village && a.village.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                                   (a.subDistrict && a.subDistrict.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                                   (a.district && a.district.toLowerCase().includes(adminSearchQuery.toLowerCase())))
                                : true)
                            ).length > 0 ? (
                              savedAccounts.filter(a => 
                                a.role === 'admin' && 
                                (adminSearchQuery.length > 0
                                  ? ((a.name && a.name.toLowerCase().includes(adminSearchQuery.toLowerCase())) || 
                                     (a.village && a.village.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                                     (a.subDistrict && a.subDistrict.toLowerCase().includes(adminSearchQuery.toLowerCase())) ||
                                     (a.district && a.district.toLowerCase().includes(adminSearchQuery.toLowerCase())))
                                  : true)
                              ).map(admin => (
                                <button
                                  key={admin.id}
                                  type="button"
                                  onClick={() => {
                                    setFormData({...formData, assignedAdminId: admin.id});
                                    setAdminSearchQuery(admin.name);
                                    setShowAdminDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors"
                                >
                                  <div className="flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-800">{admin.name}</p>
                                    {admin.status === 'pending' && (
                                      <span className="text-[8px] font-black bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">Pending</span>
                                    )}
                                  </div>
                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                                    {admin.department ? DICTIONARY[admin.department]?.en || admin.department : 'Admin'} • {admin.village}
                                  </p>
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-slate-500 text-center">No admins found</div>
                            )}
                          </div>
                        )}
                      </div>
                      {formData.assignedAdminId && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-3">
                          <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-bold text-emerald-800">Admin Selected</p>
                            <p className="text-[10px] text-emerald-600 mt-0.5">Your requests will be sent to this admin permanently.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                <div className="grid grid-cols-1 gap-3 pt-4">
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
                    <Building size={16} className="text-slate-400" />
                    <input placeholder={t('gramPanchayatId')} className="bg-transparent outline-none text-[11px] w-full font-black text-slate-800" value={formData.gpId} onChange={e => setFormData({...formData, gpId: e.target.value})} />
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
                    <Zap size={16} className="text-slate-400" />
                    <input placeholder={t('electricityConsumerNo')} className="bg-transparent outline-none text-[11px] w-full font-black text-slate-800" value={formData.electricityNo} onChange={e => setFormData({...formData, electricityNo: e.target.value})} />
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
                    <Flame size={16} className="text-slate-400" />
                    <input placeholder={t('gasConsumerId')} className="bg-transparent outline-none text-[11px] w-full font-black text-slate-800" value={formData.gasId} onChange={e => setFormData({...formData, gasId: e.target.value})} />
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
                    <FileText size={16} className="text-slate-400" />
                    <input placeholder={t('chavdiAccountNo')} className="bg-transparent outline-none text-[11px] w-full font-black text-slate-800" value={formData.chavdiNo} onChange={e => setFormData({...formData, chavdiNo: e.target.value})} />
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
                    <HeartPulse size={16} className="text-slate-400" />
                    <input placeholder={t('healthId')} className="bg-transparent outline-none text-[11px] w-full font-black text-slate-800" value={formData.healthId} onChange={e => setFormData({...formData, healthId: e.target.value})} />
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                  <Edit3 size={18} className="text-slate-400 mt-0.5" />
                  <textarea rows={3} placeholder={t('physicalAddress')} className="bg-transparent outline-none text-sm w-full font-black text-slate-800 resize-none" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600">
                <AlertCircle size={18} />
                <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{error}</p>
              </div>
            )}
            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-600">
                <CheckCircle2 size={18} />
                <p className="text-[10px] font-black uppercase tracking-widest leading-tight">{successMsg}</p>
              </div>
            )}

            <button type="submit" className={`w-full py-5 rounded-2xl font-black text-white uppercase text-[11px] tracking-widest active:scale-95 transition-all shadow-lg ${role === 'admin' ? 'bg-slate-900' : 'bg-emerald-600'}`}>
              {isLogin ? t('signInSecurely') : t('createAccount')}
            </button>
          </form>
        </div>
        
        <div className="flex justify-center pb-8">
           <button onClick={() => {
             setRole('developer');
             setFormData({...formData, email: '', password: ''});
             setError('');
           }} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-500 transition-colors">
             <Code size={14} /> Developer Access
           </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
