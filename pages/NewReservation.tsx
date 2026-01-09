
import React, { useState, useMemo } from 'react';
import { formatAppDate } from '../constants';
import { Reservation, User } from '../types';

interface NewReservationProps {
  user: User;
  prices: {
    mesa: number;
    asador: number;
    adulto: number;
    nino: number;
  };
  onBack?: () => void;
  onSuccess?: (newRes: Reservation) => void;
}

const NewReservation: React.FC<NewReservationProps> = ({ user, prices, onBack, onSuccess }) => {
  const currentDay = useMemo(() => new Date().getDate(), []);
  
  const [selectedMesa, setSelectedMesa] = useState(true);
  const [selectedAsador, setSelectedAsador] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(currentDay);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [finalRes, setFinalRes] = useState<Reservation | null>(null);

  const isWeekend = useMemo(() => {
    if (!selectedDay) return false;
    const date = new Date();
    date.setDate(selectedDay);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0;
  }, [selectedDay]);

  const times = useMemo(() => {
    const startHour = isWeekend ? 10 : 14;
    const endHour = 20;
    const generated = [];
    for (let h = startHour; h <= endHour; h++) {
      generated.push(`${h.toString().padStart(2, '0')}:00`);
      if (h < endHour) {
        generated.push(`${h.toString().padStart(2, '0')}:30`);
      }
    }
    return generated;
  }, [isWeekend]);

  const resourceTotal = (selectedMesa ? prices.mesa : 0) + (selectedAsador ? prices.asador : 0);
  const guestTotal = (adults * prices.adulto) + (children * prices.nino);
  const totalPrice = resourceTotal + guestTotal;

  const handleConfirm = () => {
    if (!selectedDay || !selectedTime || (!selectedMesa && !selectedAsador)) return;
    setIsConfirming(true);
    
    setTimeout(() => {
      const now = new Date();
      now.setDate(selectedDay);
      const newRes: Reservation = {
        id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName: user.name,
        clientEmail: user.email,
        clientPhone: user.phone || '',
        clientAvatar: user.avatar || '',
        date: formatAppDate(now),
        time: selectedTime,
        resource: selectedMesa && selectedAsador ? 'Mesa + Asador' : selectedMesa ? 'Mesa' : 'Asador',
        status: 'Activa',
        adults: adults,
        children: children
      };
      setFinalRes(newRes);
      setIsConfirming(false);
      setShowSuccess(true);
    }, 1500);
  };

  if (showSuccess && finalRes) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[80vh] bg-slate-50 dark:bg-slate-950/20 animate-in fade-in duration-700">
        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[40px] sm:rounded-[48px] shadow-2xl border border-slate-100 dark:border-slate-800 p-8 sm:p-10 flex flex-col items-center gap-8 sm:gap-10">
          <div className="flex flex-col items-center gap-4 text-center">
             <div className="size-16 sm:size-20 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center animate-in zoom-in duration-500 delay-300">
                <span className="material-symbols-outlined text-4xl font-black">check_circle</span>
             </div>
             <h2 className="text-2xl font-impact text-slate-950 dark:text-white uppercase tracking-tight">¡RESERVA LISTA!</h2>
          </div>
          <div className="w-full flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-center">PAGO REALIZADO</span>
            <span className="text-4xl sm:text-5xl font-impact text-primary tracking-tighter text-center">${totalPrice}</span>
          </div>
          <button 
            onClick={() => onSuccess && onSuccess(finalRes)} 
            className="w-full py-5 sm:py-6 bg-[#0f172a] text-white rounded-[20px] sm:rounded-[24px] font-impact shadow-xl active:scale-95 transition-all text-sm uppercase tracking-[0.2em]"
          >
            LISTO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-12 max-w-[1200px] mx-auto flex flex-col gap-8 sm:gap-10">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          {onBack && (
            <button onClick={onBack} className="size-10 sm:size-12 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl text-slate-600 dark:text-slate-300 active:scale-90 transition-all">
              <span className="material-symbols-outlined text-2xl font-black">arrow_back</span>
            </button>
          )}
          <h1 className="text-3xl sm:text-5xl font-impact text-slate-900 dark:text-white tracking-tight uppercase">Reserva</h1>
        </div>
      </header>

      {/* Normativa - Mobile compact */}
      <div className="bg-[#d1dbdb]/20 p-5 sm:p-10 rounded-[30px] sm:rounded-[40px] flex flex-row items-center gap-4 sm:gap-6 border border-[#d1dbdb]">
         <div className="size-12 sm:size-16 rounded-xl sm:rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg">
            <span className="material-symbols-outlined text-2xl sm:text-3xl font-black">info</span>
         </div>
         <div className="flex flex-col text-left">
            <h4 className="font-impact text-slate-900 dark:text-white text-base sm:text-xl uppercase tracking-tighter leading-none mb-1">RECORDATORIO</h4>
            <p className="text-slate-600 dark:text-slate-400 font-black text-[9px] sm:text-[11px] uppercase tracking-widest leading-none">
               TRAJE DE BAÑO OBLIGATORIO EN PILETAS.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
        <div className="lg:col-span-8 flex flex-col gap-8 sm:gap-10">
          
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] px-2">1. SERVICIOS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button 
                onClick={() => setSelectedMesa(!selectedMesa)}
                className={`p-5 sm:p-6 rounded-[25px] sm:rounded-[32px] border-2 transition-all flex items-center justify-between active:scale-[0.98] ${selectedMesa ? 'border-primary bg-primary/5 shadow-inner' : 'border-slate-100 bg-white dark:bg-slate-900 shadow-sm'}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`material-symbols-outlined text-2xl sm:text-3xl ${selectedMesa ? 'text-primary' : 'text-slate-300'}`}>restaurant</span>
                  <div className="text-left">
                    <p className={`font-black text-base sm:text-lg ${selectedMesa ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Mesa</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest">${prices.mesa}</p>
                  </div>
                </div>
                <div className={`size-5 sm:size-6 rounded-full border-2 flex items-center justify-center ${selectedMesa ? 'bg-primary border-primary text-white' : 'border-slate-200'}`}>
                  {selectedMesa && <span className="material-symbols-outlined text-[10px] font-black">check</span>}
                </div>
              </button>

              <button 
                onClick={() => setSelectedAsador(!selectedAsador)}
                className={`p-5 sm:p-6 rounded-[25px] sm:rounded-[32px] border-2 transition-all flex items-center justify-between active:scale-[0.98] ${selectedAsador ? 'border-primary bg-primary/5 shadow-inner' : 'border-slate-100 bg-white dark:bg-slate-900 shadow-sm'}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`material-symbols-outlined text-2xl sm:text-3xl ${selectedAsador ? 'text-primary' : 'text-slate-300'}`}>outdoor_grill</span>
                  <div className="text-left">
                    <p className={`font-black text-base sm:text-lg ${selectedAsador ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>Asador</p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500 font-black uppercase tracking-widest">${prices.asador}</p>
                  </div>
                </div>
                <div className={`size-5 sm:size-6 rounded-full border-2 flex items-center justify-center ${selectedAsador ? 'bg-primary border-primary text-white' : 'border-slate-200'}`}>
                  {selectedAsador && <span className="material-symbols-outlined text-[10px] font-black">check</span>}
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[35px] sm:rounded-[40px] shadow-sm border border-slate-200 dark:border-slate-800 p-5 sm:p-8 md:p-10 flex flex-col gap-6">
            <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">2. CALENDARIO</h3>
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {['D','L','M','M','J','V','S'].map(d => <div key={d} className="text-[9px] sm:text-[10px] font-black text-slate-300 text-center uppercase">{d}</div>)}
              {[...Array(31)].map((_, i) => {
                const day = i + 1;
                const isSelected = selectedDay === day;
                return (
                  <button 
                    key={day} 
                    onClick={() => { setSelectedDay(day); setSelectedTime(null); }}
                    className={`aspect-square flex items-center justify-center rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold transition-all active:scale-90 ${
                      isSelected ? 'bg-primary text-white shadow-lg' : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
             <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[30px] sm:rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                   <h4 className="font-impact text-lg sm:text-xl text-slate-950 dark:text-white uppercase tracking-tighter">Adultos</h4>
                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">${prices.adulto} c/u</p>
                </div>
                <div className="flex items-center gap-4 sm:gap-6 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl sm:rounded-3xl">
                   <button onClick={() => setAdults(Math.max(1, adults - 1))} className="size-10 sm:size-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-700 font-black text-lg shadow-sm active:scale-90 transition-all">-</button>
                   <span className="text-xl font-black w-6 text-center text-slate-900 dark:text-white">{adults}</span>
                   <button onClick={() => setAdults(adults + 1)} className="size-10 sm:size-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-700 font-black text-lg shadow-sm active:scale-90 transition-all">+</button>
                </div>
             </div>
             <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[30px] sm:rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-impact text-lg sm:text-xl text-slate-950 dark:text-white uppercase tracking-tighter">Niños</h4>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">${prices.nino} c/u</p>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl sm:rounded-3xl">
                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="size-10 sm:size-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-700 font-black text-lg shadow-sm active:scale-90 transition-all">-</button>
                    <span className="text-xl font-black w-6 text-center text-slate-900 dark:text-white">{children}</span>
                    <button onClick={() => setChildren(children + 1)} className="size-10 sm:size-12 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-700 font-black text-lg shadow-sm active:scale-90 transition-all">+</button>
                  </div>
                </div>
                <p className="text-[8px] font-black uppercase text-primary tracking-widest text-center">Menores de 8 años</p>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 w-full">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] sm:rounded-[50px] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 flex flex-col gap-8 sticky top-8">
            <h3 className="text-lg sm:text-xl font-impact tracking-tight uppercase leading-none text-slate-950 dark:text-white">TURNO Y PAGO</h3>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-2 gap-2">
              {times.map(t => (
                <button 
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 text-[10px] sm:text-xs font-black transition-all active:scale-[0.97] ${
                    selectedTime === t ? 'border-primary bg-primary text-white shadow-md' : 'border-slate-50 text-slate-500 bg-slate-50/50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="border-t border-dashed pt-6 flex flex-col gap-2">
               <div className="flex justify-between items-baseline">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SUBTOTAL</span>
                 <span className="text-4xl font-impact text-primary leading-none tracking-tighter">${totalPrice}</span>
               </div>
            </div>

            <button 
              disabled={!selectedTime || !selectedDay || isConfirming || (!selectedMesa && !selectedAsador)}
              onClick={handleConfirm}
              className={`w-full py-5 sm:py-6 rounded-full font-impact text-lg sm:text-xl uppercase tracking-[0.1em] shadow-xl transition-all active:scale-95 ${
                (!selectedTime || (!selectedMesa && !selectedAsador)) ? 'bg-slate-100 text-slate-400' : 'bg-primary text-white shadow-primary/20'
              }`}
            >
              {isConfirming ? 'Procesando...' : 'RESERVAR'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewReservation;
