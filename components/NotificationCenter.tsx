
import React from 'react';
import { ChevronLeft, CheckCircle2, AlertCircle, Info, Trash2 } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationCenterProps {
  notifications: AppNotification[];
  onBack: () => void;
  onClearAll: () => void;
  onMarkRead: (id: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications, onBack, onClearAll, onMarkRead }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={20} className="text-emerald-500" />;
      case 'alert': return <AlertCircle size={20} className="text-rose-500" />;
      default: return <Info size={20} className="text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-6 pt-8 pb-6 bg-white border-b border-slate-100 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-600">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
        </div>
        <button 
          onClick={onClearAll}
          className="text-xs font-bold text-rose-500 uppercase tracking-widest"
        >
          Clear All
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-40">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
              <Info size={40} />
            </div>
            <p className="font-bold text-slate-600">All caught up!</p>
            <p className="text-sm">No new notifications for now.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => onMarkRead(notif.id)}
              className={`w-full text-left p-4 rounded-3xl border transition-all ${notif.read ? 'bg-white border-slate-100' : 'bg-emerald-50 border-emerald-100 shadow-sm shadow-emerald-50'}`}
            >
              <div className="flex gap-4">
                <div className={`mt-1 p-2 rounded-xl ${notif.read ? 'bg-slate-100' : 'bg-white'}`}>
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-sm ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>{notif.title}</h3>
                    <span className="text-[10px] font-bold text-slate-400">{notif.time}</span>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${notif.read ? 'text-slate-500' : 'text-slate-600'}`}>{notif.message}</p>
                  {!notif.read && (
                    <div className="mt-2 w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
