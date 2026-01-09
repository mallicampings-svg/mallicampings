
import React, { useState, useEffect, useRef } from 'react';

interface AdminDashboardProps {
  systemStatus: {
    isAppEnabled: boolean;
    isMonthlyActive: boolean;
    monthlyExpiry: number | null;
    isAnnualActive: boolean;
    annualExpiry: number | null;
  };
  brandSettings: {
    heroImage: string;
    slogan: string;
    subSlogan: string;
  };
  setBrandSettings: React.Dispatch<React.SetStateAction<any>>;
  prices: {
    mesa: number;
    asador: number;
    adulto: number;
    nino: number;
  };
  setGlobalPrices: React.Dispatch<React.SetStateAction<any>>;
}

const CountdownDisplay: React.FC<{ expiry: number | null }> = ({ expiry }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!expiry) return;
    const interval = setInterval(() => {
      const diff = expiry - Date.now();
      if (diff <= 0) {
        setTimeLeft('EXPIRADO');
        clearInterval(interval);
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiry]);

  return timeLeft ? <span className="ml-2 opacity-70 font-mono text-[9px] border-l border-white/20 pl-2">Vence: {timeLeft}</span> : null;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ systemStatus, brandSettings, setBrandSettings, prices: globalPrices, setGlobalPrices }) => {
  const [localPrices, setLocalPrices] = useState(globalPrices);
  const [localBrand, setLocalBrand] = useState(brandSettings);
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [isSavingPrices, setIsSavingPrices] = useState(false);
  const [showToast, setShowToast] = useState<{message: string, visible: boolean}>({message: '', visible: false});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalBrand(brandSettings);
  }, [brandSettings]);

  useEffect(() => {
    setLocalPrices(globalPrices);
  }, [globalPrices]);

  const hasAnyLicense = systemStatus.isMonthlyActive || systemStatus.isAnnualActive;

  const handlePriceChange = (field: string, value: string) => {
    setLocalPrices((prev: any) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setLocalBrand((prev: any) => ({ ...prev, heroImage: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageChange = () => {
    fileInputRef.current?.click();
  };

  const handleBrandChange = (field: string, value: string) => {
    setLocalBrand((prev: any) => ({ ...prev, [field]: value }));
  };

  const savePrices = () => {
    if (!hasAnyLicense) {
      alert("Debes contar con una licencia activa para modificar los ajustes del sistema.");
      return;
    }
    setIsSavingPrices(true);
    setTimeout(() => {
      setGlobalPrices(localPrices);
      setIsSavingPrices(false);
      setShowToast({message: 'Tarifas actualizadas correctamente', visible: true});
      setTimeout(() => setShowToast({message: '', visible: false}), 3000);
    }, 1200);
  };

  const saveBrand = () => {
    if (!hasAnyLicense) {
      alert("Debes contar con una licencia activa para modificar los ajustes del sistema.");
      return;
    }
    setIsSavingBrand(true);
    setTimeout(() => {
      setBrandSettings(localBrand);
      setIsSavingBrand(false);
      setShowToast({message: 'Identidad visual actualizada', visible: true});
      setTimeout(() => setShowToast({message: '', visible: false}), 3000);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 md:p-12 max-w-7xl mx-auto flex flex-col gap-8 sm:gap-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-5xl font-impact text-slate-950 dark:text-white tracking-tighter uppercase leading-none">Gestión Club Malli</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-bold">Control operativo y visual.</p>
        </div>

        <div className="flex flex-col gap-2 bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-sm">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Licencias</span>
           <div className="flex flex-col gap-2">
             {!hasAnyLicense && (
               <div className="flex items-center gap-2 text-red-500 font-black text-xs uppercase">
                 <span className="material-symbols-outlined text-xl">warning</span>
                 Sin Licencia Activa
               </div>
             )}
             {systemStatus.isMonthlyActive && (
               <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-primary border border-blue-100 dark:border-blue-800 rounded-lg flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">event_repeat</span>
                    Mensual
                 </div>
                 <CountdownDisplay expiry={systemStatus.monthlyExpiry} />
               </div>
             )}
             {systemStatus.isAnnualActive && (
               <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-100 dark:border-amber-800 rounded-lg flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                 <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">workspace_premium</span>
                    Anual
                 </div>
                 <CountdownDisplay expiry={systemStatus.annualExpiry} />
               </div>
             )}
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
        <div className="flex flex-col gap-8">
          <section className="bg-white dark:bg-slate-900 rounded-[35px] sm:rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4 bg-slate-50/30 dark:bg-slate-800/20">
              <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl font-black">payments</span>
              <h2 className="text-xl sm:text-2xl font-impact text-slate-950 dark:text-white tracking-tight uppercase">Estructura de Precios</h2>
            </div>
            
            <div className="p-8 sm:p-10 flex flex-col gap-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-10">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">VALOR MESA</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">$</span>
                    <input 
                      type="number" 
                      className="w-full h-16 sm:h-20 pl-16 pr-6 rounded-[20px] sm:rounded-[24px] border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-black text-xl sm:text-2xl focus:ring-4 focus:ring-primary/5 transition-all text-slate-950 dark:text-white" 
                      value={localPrices.mesa} 
                      onChange={(e) => handlePriceChange('mesa', e.target.value)} 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">VALOR ASADOR</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">$</span>
                    <input 
                      type="number" 
                      className="w-full h-16 sm:h-20 pl-16 pr-6 rounded-[20px] sm:rounded-[24px] border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-black text-xl sm:text-2xl focus:ring-4 focus:ring-primary/5 transition-all text-slate-950 dark:text-white" 
                      value={localPrices.asador} 
                      onChange={(e) => handlePriceChange('asador', e.target.value)} 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">ADULTO</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">$</span>
                    <input 
                      type="number" 
                      className="w-full h-16 sm:h-20 pl-16 pr-6 rounded-[20px] sm:rounded-[24px] border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-black text-xl sm:text-2xl focus:ring-4 focus:ring-primary/5 transition-all text-slate-950 dark:text-white" 
                      value={localPrices.adulto} 
                      onChange={(e) => handlePriceChange('adulto', e.target.value)} 
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">NIÑO (HASTA 8A)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xl">$</span>
                    <input 
                      type="number" 
                      className="w-full h-16 sm:h-20 pl-16 pr-6 rounded-[20px] sm:rounded-[24px] border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-black text-xl sm:text-2xl focus:ring-4 focus:ring-primary/5 transition-all text-slate-950 dark:text-white" 
                      value={localPrices.nino} 
                      onChange={(e) => handlePriceChange('nino', e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={savePrices}
                  disabled={isSavingPrices || !hasAnyLicense}
                  className="w-full h-14 sm:h-16 bg-[#0f172a] text-white rounded-[18px] sm:rounded-[20px] font-impact text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl"
                >
                  {isSavingPrices ? <span className="animate-spin material-symbols-outlined text-xl">progress_activity</span> : <span className="material-symbols-outlined text-xl">price_check</span>}
                  {isSavingPrices ? 'GUARDANDO...' : 'ACTUALIZAR TARIFAS'}
                </button>
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-8">
          <section className="bg-white dark:bg-slate-900 rounded-[35px] sm:rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col h-full">
            <div className="p-6 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4 bg-slate-50/30 dark:bg-slate-800/20">
              <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl font-black">palette</span>
              <h2 className="text-xl sm:text-2xl font-impact text-slate-950 dark:text-white tracking-tight uppercase">Identidad Visual</h2>
            </div>
            <div className="p-8 sm:p-10 flex flex-col gap-6 sm:gap-8 flex-1">
              <div className="flex flex-col gap-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">IMAGEN HERO</label>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

                <div 
                  onClick={triggerImageChange}
                  className="relative group overflow-hidden rounded-[30px] sm:rounded-[40px] border-4 border-slate-50 dark:border-slate-800 aspect-video bg-slate-100 dark:bg-slate-800 shadow-xl cursor-pointer"
                >
                   <img src={localBrand.heroImage} alt="Hero Preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                   <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[1px] z-20">
                      <div className="bg-white text-slate-950 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl">
                        CAMBIAR FOTO
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">ESLOGAN</label>
                  <input 
                    type="text" 
                    className="w-full h-14 sm:h-16 px-6 rounded-xl sm:rounded-2xl border-none bg-slate-50 dark:bg-slate-950 font-impact text-lg sm:text-xl text-slate-950 dark:text-white" 
                    value={localBrand.slogan} 
                    onChange={(e) => handleBrandChange('slogan', e.target.value)} 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">DESCRIPCIÓN</label>
                  <textarea 
                    rows={2}
                    className="w-full p-6 rounded-xl sm:rounded-2xl border-none bg-slate-50 dark:bg-slate-950 font-bold text-slate-500 leading-relaxed resize-none text-sm sm:text-base" 
                    value={localBrand.subSlogan} 
                    onChange={(e) => handleBrandChange('subSlogan', e.target.value)} 
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto">
                <button 
                  onClick={saveBrand}
                  disabled={isSavingBrand || !hasAnyLicense}
                  className="w-full h-14 sm:h-16 bg-[#0f172a] text-white rounded-[18px] sm:rounded-[20px] font-impact text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl"
                >
                  {isSavingBrand ? <span className="animate-spin material-symbols-outlined text-xl">progress_activity</span> : <span className="material-symbols-outlined text-xl">auto_fix_high</span>}
                  {isSavingBrand ? 'GUARDANDO...' : 'ACTUALIZAR MARCA'}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {showToast.visible && (
        <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[100] bg-slate-950 text-white px-8 py-4 sm:px-10 sm:py-6 rounded-3xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-6">
          <div className="flex items-center gap-4 font-black uppercase text-[10px] sm:text-xs tracking-widest">
            <div className="size-10 sm:size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined font-black">done_all</span>
            </div>
            {showToast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
