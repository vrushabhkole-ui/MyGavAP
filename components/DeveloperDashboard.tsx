import React, { useState, useEffect } from 'react';
import { UserProfile, StoredAccount } from '../types.ts';
import { CheckCircle2, XCircle, Loader2, ShieldAlert, LogOut, Search, MapPin, Phone, Mail } from 'lucide-react';
import { io } from 'socket.io-client';

interface DeveloperDashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({ user, onLogout }) => {
  const [accounts, setAccounts] = useState<StoredAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const socket = io();
    socket.on('data-update-accounts', (data) => {
      setAccounts(data);
    });

    const fetchAccounts = async () => {
      try {
        const res = await fetch('/api/accounts');
        if (res.ok) {
          const data = await res.json();
          setAccounts(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccounts();

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    const updatedAccounts = accounts.map(a => {
      if (a.id === id) {
        return { ...a, status: action === 'approve' ? 'approved' : 'rejected' };
      }
      return a;
    });

    // Optimistic update
    setAccounts(updatedAccounts as StoredAccount[]);

    try {
      await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAccounts)
      });
    } catch (e) {
      console.error("Failed to update account", e);
      // Revert if failed (could implement revert logic here)
    }
  };

  const pendingAdmins = accounts.filter(a => 
    a.role === 'admin' && 
    a.status === 'pending' &&
    (a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     a.village.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
            <ShieldAlert size={16} />
          </div>
          <div>
            <h1 className="text-sm font-black uppercase tracking-widest text-slate-900">Dev Console</h1>
            <p className="text-[10px] font-bold text-slate-400">System Administrator</p>
          </div>
        </div>
        <button onClick={onLogout} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
          <LogOut size={18} />
        </button>
      </header>

      <main className="pt-24 px-4 pb-12 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-widest text-slate-800">Pending Approvals</h2>
          <div className="bg-white px-3 py-1.5 rounded-full border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {pendingAdmins.length} Requests
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or village..." 
            className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold outline-none focus:border-slate-900 transition-colors shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-slate-400" size={32} />
          </div>
        ) : pendingAdmins.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <CheckCircle2 size={32} />
            </div>
            <p className="text-sm font-bold text-slate-400">All caught up! No pending requests.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingAdmins.map(admin => (
              <div key={admin.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">{admin.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{admin.department} Officer</p>
                  </div>
                  <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                    Pending
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={14} />
                    <span className="text-xs font-medium">{admin.village}, {admin.subDistrict}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Phone size={14} />
                    <span className="text-xs font-medium">{admin.mobile}</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2 text-slate-500">
                    <Mail size={14} />
                    <span className="text-xs font-medium">{admin.email}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => handleAction(admin.id, 'reject')}
                    className="flex-1 py-3 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button 
                    onClick={() => handleAction(admin.id, 'approve')}
                    className="flex-1 py-3 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={14} /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DeveloperDashboard;
