
import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, ShieldCheck, Smartphone, Copy, Clock, AlertTriangle, ArrowDownRight, IndianRupee, Loader2, Info, SearchCheck, Camera, ScanLine } from 'lucide-react';
import { Bill, Language, Transaction } from '../types';
import MaharashtraEmblem from './MaharashtraEmblem';

interface PaymentModalProps {
  bill: Bill;
  userName: string;
  lang: Language;
  onClose: () => void;
  onSuccess: (transaction: Transaction) => void;
  onFailure: (transaction: Transaction) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ bill, userName, lang, onClose, onSuccess, onFailure }) => {
  const [step, setStep] = useState<'qr' | 'scanner' | 'detecting' | 'processing' | 'success' | 'failed'>('qr');
  const [timeLeft, setTimeLeft] = useState(60);
  const [referenceId] = useState(`MG${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  const [creditDetected, setCreditDetected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Admin Account Details
  const merchantName = "Manisha Kole";
  const vpa = "manishakole7@okicici";
  
  const upiString = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(merchantName)}&am=${bill.amount}&cu=INR&tn=${encodeURIComponent(bill.type + " Payment: " + bill.id)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiString)}&color=0f172a&margin=10`;

  useEffect(() => {
    let timer: any;
    if (timeLeft > 0 && (step === 'qr' || step === 'detecting' || step === 'scanner')) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      handleFinalize(false);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, step]);

  useEffect(() => {
    if (step === 'scanner') {
      startCamera();
      const scanTimer = setTimeout(() => {
        setCreditDetected(true);
        setStep('detecting');
      }, 4000);
      return () => {
        clearTimeout(scanTimer);
        stopCamera();
      };
    }
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // Simulate real-time detection
  useEffect(() => {
    if (step === 'detecting') {
      const checkInterval = setTimeout(() => {
        const detected = Math.random() > 0.1; // High success rate for demo
        if (detected || creditDetected) {
          setCreditDetected(true);
          setTimeout(() => setStep('processing'), 1000);
        }
      }, 3000);
      return () => clearTimeout(checkInterval);
    }
  }, [step]);

  useEffect(() => {
    if (step === 'processing') {
      setTimeout(() => {
        handleFinalize(creditDetected);
      }, 2000);
    }
  }, [step]);

  const handleFinalize = (isSuccess: boolean) => {
    // Added village and subDistrict from bill to satisfy Transaction interface requirements
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      billId: bill.id,
      userId: bill.userId,
      userName: userName,
      village: bill.village,
      subDistrict: bill.subDistrict,
      type: bill.type,
      amount: bill.amount,
      recipient: merchantName,
      vpa: vpa,
      timestamp: new Date().toLocaleString('en-IN'),
      status: isSuccess ? 'Success' : 'Failed',
      referenceId: referenceId
    };

    if (isSuccess) {
      setStep('success');
      setTimeout(() => onSuccess(transaction), 3000);
    } else {
      setStep('failed');
      setTimeout(() => onFailure(transaction), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white rounded-t-[40px] sm:rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500">
        
        {step === 'qr' && (
          <div className="flex flex-col">
            <header className="px-6 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <MaharashtraEmblem size="sm" showText={false} />
                <div>
                  <h2 className="text-sm font-black text-slate-800 uppercase">Payment Session</h2>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Secure Digital Ledger</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black ${timeLeft < 15 ? 'bg-rose-50 border-rose-100 text-rose-500 animate-pulse' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                  <Clock size={12} />
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
                <button onClick={onClose} className="p-2 text-slate-300">
                  <X size={20} />
                </button>
              </div>
            </header>

            <div className="p-8 flex flex-col items-center">
              <div className="text-center mb-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{bill.type}</p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">₹{bill.amount.toLocaleString('en-IN')}</h3>
                {bill.description && <p className="mt-3 text-[10px] font-bold text-slate-500 max-w-[200px] mx-auto italic">"{bill.description}"</p>}
              </div>

              <div className="relative p-6 bg-white border border-slate-200 rounded-[32px] shadow-2xl shadow-slate-200/50 mb-8">
                <div className="flex flex-col items-center mb-4">
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Scan QR with any UPI App</p>
                </div>
                <div className="w-[180px] h-[180px] bg-white rounded-xl flex items-center justify-center overflow-hidden border-2 border-slate-50 p-2">
                   <img src={qrUrl} alt="Payment QR" className="w-full h-full" />
                </div>
                <div className="mt-4 text-center">
                   <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Manisha Kole</p>
                   <p className="text-[9px] font-bold text-slate-400">{vpa}</p>
                </div>
              </div>

              <div className="w-full space-y-3">
                <button 
                  onClick={() => setStep('scanner')}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                >
                  <Camera size={18} /> Verify via Camera
                </button>
                <div className="grid grid-cols-2 gap-3">
                   <button 
                     onClick={() => setStep('detecting')}
                     className="py-4 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                   >
                     I have Paid
                   </button>
                   <button 
                     onClick={() => window.location.href = upiString}
                     className="py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                   >
                     Open App
                   </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'scanner' && (
          <div className="p-8 flex flex-col items-center justify-center min-h-[500px]">
             <div className="w-full relative rounded-3xl overflow-hidden bg-black aspect-square border-4 border-slate-900 shadow-2xl">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                   <div className="w-48 h-48 border-2 border-emerald-500 rounded-2xl relative">
                      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1"></div>
                      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1"></div>
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1"></div>
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1"></div>
                      <div className="absolute inset-x-0 h-0.5 bg-emerald-500/50 shadow-[0_0_10px_emerald] animate-[scan_2s_infinite]"></div>
                   </div>
                </div>
             </div>
             <div className="mt-8 text-center space-y-3">
                <h3 className="text-lg font-black text-slate-800">Scan Confirmation</h3>
                <p className="text-xs font-bold text-slate-400 px-10">Point your camera at the payment success screen on the other device.</p>
                <button onClick={() => setStep('qr')} className="mt-4 px-6 py-2 bg-slate-100 text-slate-500 rounded-full font-black text-[10px] uppercase tracking-widest">Cancel</button>
             </div>
             <style>{`
                @keyframes scan {
                  0%, 100% { top: 0; }
                  50% { top: 100%; }
                }
             `}</style>
          </div>
        )}

        {(step === 'detecting' || step === 'processing') && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-8 min-h-[500px]">
             <div className="relative">
                <div className="w-24 h-24 border-4 border-slate-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <MaharashtraEmblem size="sm" showText={false} />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-900">Digital Verification</h3>
                <p className="text-sm font-bold text-slate-400">Pinging the village ledger for transaction credit confirmation...</p>
             </div>
             <div className="px-5 py-2 bg-slate-50 rounded-full border border-slate-100 font-mono text-[10px] font-black tracking-widest text-slate-400">
                VERIFYING: {referenceId}
             </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px] animate-in zoom-in-95 duration-500">
             <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-100">
                <CheckCircle2 size={40} strokeWidth={3} />
             </div>
             <div className="space-y-1">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Settled</h3>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-[0.2em]">Gram Revenue Credit Success</p>
             </div>
             <div className="w-full bg-slate-50 rounded-[32px] p-6 border border-slate-100 space-y-4 shadow-inner text-left">
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <span>Ref ID</span>
                   <span className="text-slate-800 font-mono uppercase">{referenceId}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <span>Recipient</span>
                   <span className="text-slate-800">MANISHA KOLE</span>
                </div>
                <div className="h-px bg-slate-200/50"></div>
                <div className="flex justify-between items-end">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Settle</span>
                   <span className="text-3xl font-black text-emerald-600">₹{bill.amount}</span>
                </div>
             </div>
          </div>
        )}

        {step === 'failed' && (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px] animate-in slide-in-from-top duration-500">
             <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shadow-2xl shadow-rose-100">
                <AlertTriangle size={40} strokeWidth={3} />
             </div>
             <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">No Credit Found</h3>
                <p className="text-xs font-bold text-rose-600 uppercase tracking-widest">Verification Timeout</p>
             </div>
             <p className="text-xs font-bold text-slate-400 px-6 leading-relaxed">
                We could not find a matching credit in the admin ledger. If your app says "Success", please wait a few minutes or contact support.
             </p>
             <button 
               onClick={() => { setStep('qr'); setTimeLeft(60); }}
               className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg"
             >
                Try Again
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
