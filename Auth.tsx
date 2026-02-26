
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldAlert, UserCheck, Trash2, Eye, EyeOff, MapPin, Globe, Building2, Map, ShieldCheck, AlertCircle, Briefcase, Edit3, ChevronDown, CheckCircle2, Building, Zap, Flame, FileText, HeartPulse, ShoppingBasket, Phone, Hash, BriefcaseBusiness, Key } from 'lucide-react';
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

// Permanent Officer Keys saved in App Data
const PERMANENT_OFFICER_KEYS = [
  'OFFICER01', 'OFFICER02', 'OFFICER03', 'OFFICER04', 'OFFICER05',
  'MAHA7788', 'PUNE9900', 'GAAV1122', 'FIELD556', 'ADMIN889',
  'KEY2024X', 'KEY2025Y', 'VILLAGE1', 'GAAVHUB9',
  'K8J2M4P9', 'L7N3Q5R1', 'B6V9X2Z4', 'H1G5F8D3', 'S0A2W4E6'
];

const SYSTEM_ADMINS: Record<string, { name: string, dept: ServiceType, pass: string, icon: any, color: string, village: string, subDist: string }> = {
  'gp@mygaav.com': { name: 'GP Officer', dept: ServiceType.GRAMPANCHAYAT, pass: 'admin123', icon: Building, color: 'bg-emerald-600', village: 'Sukhawadi', subDist: 'Haveli' },
  'elec@mygaav.com': { name: 'MSEB Officer', dept: ServiceType.ELECTRICITY, pass: 'admin123', icon: Zap, color: 'bg-blue-600', village: 'Sukhawadi', subDist: 'Haveli' },
  'gas@mygaav.com': { name: 'Gas Agency', dept: ServiceType.GAS, pass: 'admin123', icon: Flame, color: 'bg-orange-600', village: 'Sukhawadi', subDist: 'Haveli' },
  'chavdi@mygaav.com': { name: 'Revenue Officer', dept: ServiceType.CHAVDI, pass: 'admin123', icon: FileText, color: 'bg-amber-600', village: 'Sukhawadi', subDist: 'Haveli' },
  'health@mygaav.com': { name: 'Health Officer', dept: ServiceType.HEALTH, pass: 'admin123', icon: HeartPulse, color: 'bg-rose-600', village: 'Sukhawadi', subDist: 'Haveli' },
  'mandi@mygaav.com': { name: 'Mandi Supervisor', dept: ServiceType.MARKET, pass: 'admin123', icon: ShoppingBasket, color: 'bg-indigo-600', village: 'Sukhawadi', subDist: 'Haveli' }
};

const DEMO_RESIDENT = {
  email: 'resident@mygaav.com',
  name: 'Rahul Deshmukh',
  pass: 'pass123',
  village: 'Sukhawadi'
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
    officerKey: ''
  });

  const [error, setError] = useState('');
  const [savedAccounts, setSavedAccounts] = useState<StoredAccount[]>([]);

  const t = (key: string) => DICTIONARY[key]?.[lang] || key;

  const validateOfficerKey = (key: string) => {
    const upperKey = key.toUpperCase().trim();
    
    // 1. Check Permanent Keys first (Always work)
    if (PERMANENT_OFFICER_KEYS.includes(upperKey)) return true;

    // 2. Check Generated Keys in LocalStorage
    const stored = localStorage.getItem(OFFICER_KEYS_KEY);
    if (!stored) return false;
    try {
      const keys = JSON.parse(stored) as string[];
      // Use a Set for faster lookup if the list is large
      return new Set(keys).has(upperKey);
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    // Silent key generation if missing (moved to timeout to prevent UI freeze)
    const existingKeys = localStorage.getItem(OFFICER_KEYS_KEY);
    if (!existingKeys) {
      setTimeout(() => {
        const keys = new Set<string>();
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        while (keys.size < 100000) {
          let key = '';
          for (let i = 0; i < 8; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          keys.add(key);
        }
        localStorage.setItem(OFFICER_KEYS_KEY, JSON.stringify(Array.from(keys)));
        console.log("1 Lakh Officer keys generated and saved to LocalStorage.");
      }, 1000);
    }

    const stored = localStorage.getItem(USER_REGISTRY_KEY);
    if (stored) {
      try { 
        setSavedAccounts(JSON.parse(stored)); 
      } catch (e) { 
        console.error("Registry parse error", e); 
      }
    }
  }, []);

  const handleStateChange = (state: string) => {
    const districts = (INDIA_LOCATIONS.districts as any)[state] || [];
    const firstDist = districts[0] || '';
    
    setFormData({
      ...formData,
      state,
      district: firstDist,
      subDistrict: '',
      village: ''
    });
  };

  const handleDistrictChange = (district: string) => {
    setFormData({
      ...formData,
      district,
      subDistrict: '',
      village: ''
    });
  };

  const saveToRegistry = (profile: UserProfile, password?: string) => {
    const stored: StoredAccount = { 
      ...profile, 
      password: password || '', 
      avatarColor: COLORS[Math.floor(Math.random() * COLORS.length)] 
    };
    
    const existing = JSON.parse(localStorage.getItem(USER_REGISTRY_KEY) || '[]');
    const newList = [...existing.filter((a: any) => a.email.toLowerCase() !== profile.email.toLowerCase()), stored];
    localStorage.setItem(USER_REGISTRY_KEY, JSON.stringify(newList));
    setSavedAccounts(newList);
  };

  const handleQuickLogin = (type: 'resident' | 'officer', key?: string) => {
    if (type === 'resident') {
      const profile: UserProfile = {
        id: 'DEMO-RES-1',
        name: DEMO_RESIDENT.name,
        email: DEMO_RESIDENT.email,
        state: 'Maharashtra',
        district: 'Pune',
        subDistrict: 'Haveli',
        village: DEMO_RESIDENT.village,
        role: 'user',
        joinedAt: 'Demo Account'
      };
      saveToRegistry(profile, DEMO_RESIDENT.pass);
      onLogin(profile);
    } else if (key && SYSTEM_ADMINS[key]) {
      const sys = SYSTEM_ADMINS[key];
      const profile: UserProfile = {
        id: `SYS-${sys.dept.toUpperCase()}`,
        name: sys.name,
        email: key,
        state: 'Maharashtra',
        district: 'Pune',
        subDistrict: sys.subDist,
        village: sys.village,
        role: 'admin',
        department: sys.dept,
        joinedAt: 'System Config'
      };
      saveToRegistry(profile, sys.pass);
      onLogin(profile);
    }
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const emailKey = formData.email.trim().toLowerCase();

    const match = savedAccounts.find(a => 
      a.email.toLowerCase() === emailKey && 
      a.role === role && 
      (role === 'user' || a.department === formData.department)
    );

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
      if (match && match.password === formData.password) {
        onLogin(match);
        return;
      }
      if (role === 'admin' && SYSTEM_ADMINS[emailKey]) {
        const sys = SYSTEM_ADMINS[emailKey];
        if (formData.password === sys.pass && formData.department === sys.dept) {
          handleQuickLogin('officer', emailKey);
          return;
        }
      }
      if (role === 'user' && emailKey === DEMO_RESIDENT.email && formData.password === DEMO_RESIDENT.pass) {
        handleQuickLogin('resident');
        return;
      }
      setError('Invalid credentials.');
      return;
    }

    // Check if email or mobile already exists in the registry
    const existingRegistry = JSON.parse(localStorage.getItem(USER_REGISTRY_KEY) || '[]');
    if (existingRegistry.some((a: any) => a.email.toLowerCase() === emailKey)) {
      setError('This email is already registered. Please login instead.');
      return;
    }
    if (existingRegistry.some((a: any) => a.mobile === formData.mobile)) {
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
      joinedAt: new Date().toLocaleDateString('en-IN')
    };
    
    saveToRegistry(profile, formData.password);
    onLogin(profile);
  };

  const currentDistricts = (INDIA_LOCATIONS.districts as any)[formData.state] || [];

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
            <button type="button" onClick={() => { setIsLogin(true); setError(''); }} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest ${isLogin ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400'}`}>Login</button>
            <button type="button" onClick={() => { setIsLogin(false); setError(''); }} className={`flex-1 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest ${!isLogin ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-400'}`}>Signup</button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {role === 'admin' && (
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
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
                    <Globe size={18} className="text-slate-400" />
                    <select className="bg-transparent outline-none text-sm w-full font-black text-slate-800" value={formData.state} onChange={e => handleStateChange(e.target.value)}>
                      {INDIA_LOCATIONS.states.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
                    <Map size={18} className="text-slate-400" />
                    <select className="bg-transparent outline-none text-sm w-full font-black text-slate-800" value={formData.district} onChange={e => handleDistrictChange(e.target.value)}>
                      {currentDistricts.length > 0 ? currentDistricts.map((d: string) => <option key={d} value={d}>{d}</option>) : <option value="">{t('district')}</option>}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
                    <Building2 size={18} className="text-slate-400" />
                    <input required placeholder={t('taluka')} className="bg-transparent outline-none text-sm w-full font-black text-slate-800" value={formData.subDistrict} onChange={e => setFormData({...formData, subDistrict: e.target.value})} />
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3">
                    <MapPin size={18} className="text-slate-400" />
                    <input required placeholder={t('village')} className="bg-transparent outline-none text-sm w-full font-black text-slate-800" value={formData.village} onChange={e => setFormData({...formData, village: e.target.value})} />
                  </div>
                </div>

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

            <button type="submit" className={`w-full py-5 rounded-2xl font-black text-white uppercase text-[11px] tracking-widest active:scale-95 transition-all shadow-lg ${role === 'admin' ? 'bg-slate-900' : 'bg-emerald-600'}`}>
              {isLogin ? t('signInSecurely') : t('createAccount')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
