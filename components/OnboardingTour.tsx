
import React, { useState } from 'react';
import { ChevronRight, X, Bot, Building2, Grid, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import { Language } from '../types.ts';
import { DICTIONARY } from '../constants.tsx';
import Logo from './Logo.tsx';

interface OnboardingTourProps {
  lang: Language;
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ lang, onComplete }) => {
  const [step, setStep] = useState(0);
  const t = (key: string) => DICTIONARY[key]?.[lang] || key;

  const steps = [
    {
      title: lang === 'en' ? 'Welcome to MyGaav' : lang === 'hi' ? 'मेरा गाँव में आपका स्वागत है' : 'माझे गाव मध्ये आपले स्वागत आहे',
      description: lang === 'en' 
        ? 'Your digital bridge to village services. Access all your local needs in one place.' 
        : lang === 'hi' 
        ? 'ग्राम सेवाओं के लिए आपका डिजिटल पुल। अपनी सभी स्थानीय जरूरतों को एक ही स्थान पर एक्सेस करें।' 
        : 'ग्राम सेवांसाठी तुमचा डिजिटल पूल. तुमच्या सर्व स्थानिक गरजा एकाच ठिकाणी मिळवा.',
      icon: <Logo size="lg" />,
      color: 'bg-emerald-600'
    },
    {
      title: lang === 'en' ? 'Digital Services' : lang === 'hi' ? 'डिजिटल सेवाएँ' : 'डिजिटल सेवा',
      description: lang === 'en' 
        ? 'Pay electricity bills, request birth certificates, or check land records directly from your phone.' 
        : lang === 'hi' 
        ? 'बिजली के बिलों का भुगतान करें, जन्म प्रमाण पत्र के लिए अनुरोध करें, या सीधे अपने फोन से भूमि रिकॉर्ड की जांच करें।' 
        : 'वीज बिले भरा, जन्म दाखल्यासाठी विनंती करा किंवा तुमच्या फोनवरून थेट जमिनीचे रेकॉर्ड तपासा.',
      icon: <Building2 size={48} className="text-white" />,
      color: 'bg-blue-600'
    },
    {
      title: lang === 'en' ? 'AI Sahayak 24/7' : lang === 'hi' ? 'AI सहायक 24/7' : 'AI सहाय्यक २४/७',
      description: lang === 'en' 
        ? 'Have questions about government schemes? Our AI Assistant is here to help you anytime.' 
        : lang === 'hi' 
        ? 'सरकारी योजनाओं के बारे में प्रश्न हैं? हमारा AI सहायक किसी भी समय आपकी सहायता के लिए यहाँ है।' 
        : 'सरकारी योजनांबद्दल काही प्रश्न आहेत? आमचा AI सहाय्यक तुम्हाला कधीही मदत करण्यासाठी येथे आहे.',
      icon: <Bot size={48} className="text-white" />,
      color: 'bg-indigo-600'
    },
    {
      title: lang === 'en' ? 'Track Progress' : lang === 'hi' ? 'प्रगति ट्रैक करें' : 'प्रगती ट्रॅक करा',
      description: lang === 'en' 
        ? 'View the live status of your requests and download digital certificates once resolved.' 
        : lang === 'hi' 
        ? 'अपने अनुरोधों की लाइव स्थिति देखें और समाधान होने के बाद डिजिटल प्रमाणपत्र डाउनलोड करें।' 
        : 'तुमच्या विनंत्यांची थेट स्थिती पहा आणि पूर्ण झाल्यानंतर डिजिटल प्रमाणपत्रे डाउनलोड करा.',
      icon: <Grid size={48} className="text-white" />,
      color: 'bg-amber-600'
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Progress Bar */}
        <div className="flex w-full h-1 bg-slate-100">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={`flex-1 h-full transition-all duration-500 ${i <= step ? steps[step].color : 'bg-transparent'}`}
            />
          ))}
        </div>

        <button 
          onClick={onComplete}
          className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-500 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 pt-12 flex flex-col items-center text-center space-y-6">
          <div className={`w-24 h-24 ${steps[step].color} rounded-[32px] flex items-center justify-center shadow-2xl shadow-slate-200 animate-in slide-in-from-top-4 duration-500`}>
            {steps[step].icon}
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
              {steps[step].title}
            </h2>
            <p className="text-sm font-bold text-slate-400 leading-relaxed px-2">
              {steps[step].description}
            </p>
          </div>

          <div className="flex gap-2 py-4">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'w-6 ' + steps[step].color : 'bg-slate-200'}`}
              />
            ))}
          </div>

          <div className="w-full flex flex-col gap-3 pt-4">
            <button 
              onClick={handleNext}
              className={`w-full py-5 ${steps[step].color} text-white rounded-[24px] font-black text-base uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-all flex items-center justify-center gap-3`}
            >
              {step === steps.length - 1 ? (lang === 'en' ? 'Get Started' : 'शुरू करें') : (lang === 'en' ? 'Next' : 'अगला')}
              <ChevronRight size={20} />
            </button>
            <button 
              onClick={onComplete}
              className="w-full py-3 text-xs font-black text-slate-300 uppercase tracking-widest hover:text-slate-400 transition-colors"
            >
              Skip Tour
            </button>
          </div>
        </div>

        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
          <MapPin size={12} className="text-slate-300" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">MyGaav Digital Hub</span>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
