
import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, CloudLightning, Wind, Droplets, Thermometer, MapPin, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { DICTIONARY } from '../constants';

interface WeatherAlert {
  type: 'Severe' | 'Warning' | 'Info';
  message: string;
  icon: React.ReactNode;
}

interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  forecast: { day: string; temp: number; code: number }[];
  village: string;
  alerts: WeatherAlert[];
}

interface LiveWeatherProps {
  village: string;
  lang: Language;
  isExpanded: boolean;
  onToggle: () => void;
}

const AnimatedIcon = ({ icon: Icon, type }: { icon: any, type: string }) => {
  const variants = {
    sun: {
      rotate: [0, 360],
      transition: { duration: 20, repeat: Infinity, ease: "linear" }
    },
    cloud: {
      x: [-2, 2, -2],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    },
    rain: {
      y: [0, 3, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    },
    lightning: {
      opacity: [1, 0.5, 1, 0.8, 1],
      scale: [1, 1.05, 1],
      transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
    }
  };

  const selectedVariant = (variants as any)[type] || {};

  return (
    <motion.div animate={selectedVariant}>
      <Icon size={24} className={type === 'sun' ? 'text-amber-300' : 'text-white'} />
    </motion.div>
  );
};

const WEATHER_CODES: Record<number, { label: Record<Language, string>; icon: any; type: string; color: string; isSevere?: boolean }> = {
  0: { label: { en: 'Clear Sky', hi: 'साफ आसमान', mr: 'स्वच्छ आकाश' }, icon: Sun, type: 'sun', color: 'from-cyan-400 via-blue-500 to-indigo-600' },
  1: { label: { en: 'Mainly Clear', hi: 'मुख्य रूप से साफ', mr: 'मुख्यतः स्वच्छ' }, icon: Sun, type: 'sun', color: 'from-sky-400 via-blue-400 to-blue-600' },
  2: { label: { en: 'Partly Cloudy', hi: 'आंशिक रूप से बादल', mr: 'अंशतः ढगाळ' }, icon: Cloud, type: 'cloud', color: 'from-blue-500 via-indigo-500 to-purple-600' },
  3: { label: { en: 'Overcast', hi: 'बादल छाए रहेंगे', mr: 'पूर्णतः ढगाळ' }, icon: Cloud, type: 'cloud', color: 'from-slate-500 via-gray-600 to-slate-800' },
  45: { label: { en: 'Foggy', hi: 'धुंधला', mr: 'धुके' }, icon: Cloud, type: 'cloud', color: 'from-zinc-500 via-slate-600 to-zinc-800' },
  51: { label: { en: 'Light Drizzle', hi: 'हल्की बूंदाबांदी', mr: 'हलकी रिमझिम' }, icon: CloudRain, type: 'rain', color: 'from-blue-400 via-slate-500 to-slate-700' },
  61: { label: { en: 'Slight Rain', hi: 'हल्की बारिश', mr: 'अल्प पाऊस' }, icon: CloudRain, type: 'rain', color: 'from-blue-600 via-indigo-700 to-slate-900' },
  80: { label: { en: 'Rain Showers', hi: 'बारिश की बौछारें', mr: 'पावसाच्या सरी' }, icon: CloudRain, type: 'rain', color: 'from-blue-700 via-blue-900 to-black' },
  95: { label: { en: 'Thunderstorm', hi: 'गरज के साथ बौछारें', mr: 'विजांसह पाऊस' }, icon: CloudLightning, type: 'lightning', color: 'from-fuchsia-900 via-purple-900 to-slate-900', isSevere: true },
  96: { label: { en: 'Thunderstorm with Hail', hi: 'ओलों के साथ तूफान', mr: 'गारांसह वादळ' }, icon: CloudLightning, type: 'lightning', color: 'from-violet-950 via-purple-900 to-black', isSevere: true },
  99: { label: { en: 'Heavy Thunderstorm', hi: 'भारी तूफान', mr: 'मुसळधार वादळ' }, icon: CloudLightning, type: 'lightning', color: 'from-rose-900 via-purple-950 to-black', isSevere: true },
};

const getDayName = (dateStr: string, lang: Language) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(lang === 'en' ? 'en-IN' : lang === 'hi' ? 'hi-IN' : 'mr-IN', { weekday: 'short' });
};

const LiveWeather: React.FC<LiveWeatherProps> = ({ village, lang, isExpanded, onToggle }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const t = (key: string) => DICTIONARY[key]?.[lang] || key;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDateTime = currentTime.toLocaleDateString(lang === 'en' ? 'en-IN' : lang === 'hi' ? 'hi-IN' : 'mr-IN', { 
    day: '2-digit', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true 
  });

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(village)}&count=1&language=en&format=json`);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('Village location not found');
      }

      const { latitude, longitude, name } = geoData.results[0];

      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`);
      const weatherData = await weatherRes.json();

      if (!weatherData.current_weather) {
        throw new Error('Weather data unavailable');
      }

      const current = weatherData.current_weather;
      const daily = weatherData.daily;

      const alerts: WeatherAlert[] = [];
      if (WEATHER_CODES[current.weathercode]?.isSevere) {
        alerts.push({
          type: 'Severe',
          message: `${t('weatherAlert')}: ${WEATHER_CODES[current.weathercode].label[lang]}`,
          icon: <CloudLightning size={16} />
        });
      }
      if (current.windspeed > 40) {
        alerts.push({
          type: 'Warning',
          message: `${t('wind')}: ${Math.round(current.windspeed)} km/h`,
          icon: <Wind size={16} />
        });
      }
      if (current.temperature > 42) {
        alerts.push({
          type: 'Severe',
          message: `${t('feelsLike')}: ${Math.round(current.temperature)}°C`,
          icon: <Thermometer size={16} />
        });
      }

      setWeather({
        temp: Math.round(current.temperature),
        condition: WEATHER_CODES[current.weathercode]?.label[lang] || 'Unknown',
        humidity: 65,
        windSpeed: Math.round(current.windspeed),
        feelsLike: Math.round(current.temperature - 2),
        forecast: daily.time.slice(1, 4).map((time: string, i: number) => ({
          day: getDayName(time, lang),
          temp: Math.round(daily.temperature_2m_max[i + 1]),
          code: daily.weathercode[i + 1]
        })),
        village: name,
        alerts
      });
    } catch (err: any) {
      setError(err.message || t('retry'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [village, lang]);

  if (loading) {
    return (
      <div className="bg-slate-100 rounded-[32px] h-28 flex items-center justify-center animate-pulse">
        <div className="flex items-center gap-2 text-slate-400">
          <RefreshCw size={16} className="animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t('loadingWeather')}</span>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-rose-50 border border-rose-100 rounded-[32px] h-28 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-1 text-rose-500">
          <AlertCircle size={20} />
          <span className="text-[9px] font-black uppercase tracking-widest text-center">{error}</span>
          <button onClick={fetchWeather} className="mt-1 text-[8px] font-black underline uppercase">{t('retry')}</button>
        </div>
      </div>
    );
  }

  const currentConfig = WEATHER_CODES[weather.forecast[0]?.code] || WEATHER_CODES[0];

  return (
    <motion.div 
      layout
      onClick={onToggle}
      className={`bg-gradient-to-br ${currentConfig.color} rounded-[32px] p-6 text-white shadow-lg relative overflow-hidden transition-all duration-500 cursor-pointer ${isExpanded ? 'h-auto' : 'h-28'}`}
    >
      <AnimatePresence>
        {weather.alerts.length > 0 && !isExpanded && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-0 right-0 bg-rose-500 text-white px-3 py-1 rounded-bl-2xl flex items-center gap-1 animate-pulse z-20"
          >
            <AlertCircle size={10} />
            <span className="text-[8px] font-black uppercase tracking-tighter">{t('weatherAlert')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <motion.div layout className="flex items-baseline gap-2">
             <h3 className="text-3xl font-black">{weather.temp}°C</h3>
             <span className="text-xs font-bold opacity-60">{weather.condition}</span>
          </motion.div>
          <motion.div layout className="flex items-center gap-1 opacity-80">
            <MapPin size={10} />
            <p className="text-[10px] font-bold truncate max-w-[140px] uppercase tracking-widest">{weather.village}</p>
          </motion.div>
        </div>
        <div className="text-right">
          <motion.div layout className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/10 mb-2 inline-block">
            <AnimatedIcon icon={currentConfig.icon} type={currentConfig.type} />
          </motion.div>
          <p className="text-[9px] uppercase font-black opacity-60 tracking-widest">{formattedDateTime}</p>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative z-10 mt-6 pt-6 border-t border-white/10 space-y-6 overflow-hidden"
          >
            {weather.alerts.length > 0 && (
              <div className="space-y-2">
                {weather.alerts.map((alert, i) => (
                  <motion.div 
                    key={i}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-2xl border ${alert.type === 'Severe' ? 'bg-rose-500/20 border-rose-500/30' : 'bg-amber-500/20 border-amber-500/30'}`}
                  >
                    <div className={alert.type === 'Severe' ? 'text-rose-300' : 'text-amber-300'}>
                      {alert.icon}
                    </div>
                    <p className="text-[10px] font-bold leading-tight">{alert.message}</p>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/10 p-3 rounded-2xl flex flex-col items-center gap-1">
                <Droplets size={14} className="text-blue-300" />
                <span className="text-[10px] font-black">{weather.humidity}%</span>
                <span className="text-[8px] opacity-60 uppercase">{t('humidity')}</span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl flex flex-col items-center gap-1">
                <Wind size={14} className="text-slate-300" />
                <span className="text-[10px] font-black">{weather.windSpeed} km/h</span>
                <span className="text-[8px] opacity-60 uppercase">{t('wind')}</span>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl flex flex-col items-center gap-1">
                <Thermometer size={14} className="text-rose-300" />
                <span className="text-[10px] font-black">{weather.feelsLike}°C</span>
                <span className="text-[8px] opacity-60 uppercase">{t('feelsLike')}</span>
              </div>
            </div>

            <div className="space-y-3">
               <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{t('forecast3Day')}</p>
               <div className="space-y-2">
                  {weather.forecast.map((f, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between bg-white/5 px-4 py-2 rounded-xl"
                    >
                       <span className="text-[10px] font-bold">{f.day}</span>
                       <div className="flex items-center gap-3">
                          {WEATHER_CODES[f.code]?.icon && React.createElement(WEATHER_CODES[f.code].icon, { size: 14, className: WEATHER_CODES[f.code].type === 'sun' ? 'text-amber-400' : 'text-white' })}
                          <span className="text-[10px] font-black">{f.temp}°C</span>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LiveWeather;
