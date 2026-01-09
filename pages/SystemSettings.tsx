
import React, { useState, useEffect } from 'react';

interface SystemSettingsProps {
  systemStatus: {
    isAppEnabled: boolean;
    isMonthlyActive: boolean;
    monthlyExpiry: number | null;
    isAnnualActive: boolean;
    annualExpiry: number | null;
  };
  setSystemStatus: React.Dispatch<React.SetStateAction<any>>;
}

const CountdownTimer: React.FC<{ expiry: number | null }> = ({ expiry }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!expiry) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = expiry - now;

      if (diff <= 0) {
        setTimeLeft('EXPIRADO');
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiry]);

  if (!expiry) return null;
  
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expira en:</span>
      <span className="text-sm font-mono font-black text-primary bg-primary/5 px-2 py-1 rounded-lg">
        {timeLeft || 'Cargando...'}
      </span>
    </div>
  );
};

const SystemSettings: React.FC<SystemSettingsProps> = ({ systemStatus, setSystemStatus }) => {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const toggleAppStatus = () => {
    setIsProcessing('app');
    setTimeout(() => {
      setSystemStatus(prev => ({ ...prev, isAppEnabled: !prev.isAppEnabled }));
      setIsProcessing(null);
    }, 1000);
  };

  const toggleLicense = (type: 'isMonthlyActive' | 'isAnnualActive') => {
    const expiryKey = type === 'isMonthlyActive' ? 'monthlyExpiry' : 'annualExpiry';
    const duration = type === 'isMonthlyActive' ? 30 * 24 * 60 * 60 * 1000 : 365 * 24 * 60 * 60 * 1000;
    
    setIsProcessing(type);
    setTimeout(() => {
      setSystemStatus(prev => ({ 
        ...prev, 
        [type]: !prev[type],
        [expiryKey]: !prev[type] ? Date.now() + duration : null
      }));
      setIsProcessing(null);
    }, 800);
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-6xl mx-auto flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
           <span className="material-symbols-outlined text-primary text-4xl font-black">settings_suggest</span>
           <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Ajustes de Sistema</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-bold">Control exclusivo del Super Administrador para habilitación global y licencias.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 flex flex-col gap-8">
          <section className="bg-[#0f172a] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="relative z-10 flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em]">CONTROL MAESTRO</h3>
                <h2 className="text-2xl font-black">Estado de la Aplicación</h2>
              </div>
              <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
                <div className="flex flex-col gap-1">
                  <span className={`text-xs font-black uppercase tracking-widest ${systemStatus.isAppEnabled ? 'text-green-400' : 'text-red-400'}`}>
                    {systemStatus.isAppEnabled ? 'SISTEMA ONLINE' : 'SISTEMA OFFLINE'}
                  </span>
                  <p className="text-[10px] text-slate-500 font-bold">Afecta a usuarios y administradores</p>
                </div>
                <button 
                  onClick={toggleAppStatus}
                  disabled={isProcessing === 'app'}
                  className={`relative w-20 h-10 rounded-full transition-all duration-500 p-1 flex items-center ${systemStatus.isAppEnabled ? 'bg-primary' : 'bg-slate-700'}`}
                >
                  <div className={`size-8 bg-white rounded-full shadow-lg transition-transform duration-500 transform ${systemStatus.isAppEnabled ? 'translate-x-10' : 'translate-x-0'} flex items-center justify-center`}>
                    {isProcessing === 'app' ? <span className="material-symbols-outlined text-sm animate-spin text-slate-900">progress_activity</span> : <span className={`material-symbols-outlined text-sm ${systemStatus.isAppEnabled ? 'text-primary' : 'text-slate-400'}`}>{systemStatus.isAppEnabled ? 'power' : 'power_off'}</span>}
                  </div>
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-8">
           <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em] px-2">CONTROL DE LICENCIAS</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm flex flex-col gap-6">
                 <div className="flex justify-between items-start">
                    <div className="size-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-3xl">event_repeat</span></div>
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${systemStatus.isMonthlyActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{systemStatus.isMonthlyActive ? 'ACTIVA' : 'INACTIVA'}</span>
                 </div>
                 <div>
                    <h4 className="text-xl font-black">Licencia Mensual</h4>
                    <p className="text-sm text-slate-500 font-medium">Periodos de 30 días.</p>
                 </div>
                 
                 {systemStatus.isMonthlyActive && <CountdownTimer expiry={systemStatus.monthlyExpiry} />}
                 
                 <button onClick={() => toggleLicense('isMonthlyActive')} className={`w-full py-4 rounded-2xl font-black text-xs uppercase transition-all ${systemStatus.isMonthlyActive ? 'bg-red-50 text-red-600' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                    {isProcessing === 'isMonthlyActive' ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : systemStatus.isMonthlyActive ? 'DESACTIVAR' : 'ACTIVAR'}
                 </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 p-8 shadow-sm flex flex-col gap-6">
                 <div className="flex justify-between items-start">
                    <div className="size-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center"><span className="material-symbols-outlined text-3xl">workspace_premium</span></div>
                    <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${systemStatus.isAnnualActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{systemStatus.isAnnualActive ? 'ACTIVA' : 'INACTIVA'}</span>
                 </div>
                 <div>
                    <h4 className="text-xl font-black">Licencia Anual</h4>
                    <p className="text-sm text-slate-500 font-medium">Ciclo completo de 365 días.</p>
                 </div>

                 {systemStatus.isAnnualActive && <CountdownTimer expiry={systemStatus.annualExpiry} />}

                 <button onClick={() => toggleLicense('isAnnualActive')} className={`w-full py-4 rounded-2xl font-black text-xs uppercase transition-all ${systemStatus.isAnnualActive ? 'bg-red-50 text-red-600' : 'bg-primary text-white shadow-lg shadow-primary/20'}`}>
                    {isProcessing === 'isAnnualActive' ? <span className="material-symbols-outlined animate-spin">progress_activity</span> : systemStatus.isAnnualActive ? 'DESACTIVAR' : 'ACTIVAR'}
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
