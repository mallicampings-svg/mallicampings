
import React from 'react';
import { INITIAL_PRICES } from '../constants';
import { User, Reservation } from '../types';

interface MyReservationsProps {
  reservations: Reservation[];
  user: User;
  onBack?: () => void;
  onNewReservation?: () => void;
  prices: {
    mesa: number;
    asador: number;
    adulto: number;
    nino: number;
  };
}

const MyReservations: React.FC<MyReservationsProps> = ({ reservations, user, onBack, onNewReservation, prices }) => {
  const userReservations = reservations.filter(res => res.clientEmail === user.email);

  return (
    <div className="p-4 sm:p-6 md:p-12 max-w-5xl mx-auto flex flex-col gap-8 sm:gap-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 transition-all shadow-sm border border-slate-100 dark:border-slate-800"
            >
              <span className="material-symbols-outlined text-2xl font-black">arrow_back</span>
            </button>
          )}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-4xl font-impact tracking-tight text-slate-950 dark:text-white uppercase">Mis Reservas</h1>
            <p className="text-slate-500 font-bold text-sm">Presenta tu QR al llegar.</p>
          </div>
        </div>
        
        <button 
          onClick={onNewReservation}
          className="flex items-center justify-center gap-3 px-6 py-4 sm:px-8 sm:py-5 bg-primary text-white rounded-[20px] sm:rounded-[24px] font-impact shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all active:scale-95 text-xs sm:text-sm tracking-widest uppercase"
        >
          <span className="material-symbols-outlined text-xl">add_circle</span>
          NUEVA RESERVA
        </button>
      </header>

      <div className="flex flex-col gap-8 sm:gap-10">
        {userReservations.length > 0 ? (
          userReservations.map((res) => (
            <div 
              key={res.id} 
              className="bg-white dark:bg-slate-900 rounded-[40px] sm:rounded-[50px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row animate-in fade-in slide-in-from-bottom-6 duration-700"
            >
              {/* Parte Superior/Izquierda: Info */}
              <div className="flex-1 p-8 sm:p-10 md:p-12 flex flex-col gap-8 sm:gap-10 relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">RESERVA ID</span>
                    <span className="font-impact text-slate-950 dark:text-white text-3xl sm:text-4xl tracking-tight leading-none uppercase">{res.id}</span>
                  </div>
                  <span className={`px-4 sm:px-6 py-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] shadow-sm whitespace-nowrap ${
                    res.status === 'Pagada' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {res.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">RECURSO</span>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="size-10 sm:size-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-2xl sm:text-3xl font-black">
                          {res.resource.toLowerCase().includes('mesa') ? 'restaurant' : 'outdoor_grill'}
                        </span>
                      </div>
                      <span className="font-impact text-slate-950 dark:text-white text-2xl sm:text-3xl leading-tight uppercase tracking-tight">
                        {res.resource}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:gap-3">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">FECHA Y HORA</span>
                    <div className="flex flex-col">
                       <span className="font-impact text-slate-800 dark:text-slate-200 text-2xl sm:text-3xl leading-none uppercase">
                         {res.date}
                       </span>
                       <span className="font-impact text-slate-400 text-xl sm:text-2xl mt-1 tracking-tighter uppercase leading-none italic">• {res.time} hs</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4 pt-4 mt-auto">
                    <div className="flex items-center gap-3 px-6 py-4 sm:px-8 sm:py-5 bg-slate-50 dark:bg-slate-800/50 rounded-[20px] sm:rounded-[28px] text-sm sm:text-lg font-black text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                      <span className="material-symbols-outlined text-xl sm:text-2xl">person</span>
                      {res.adults} Ad.
                    </div>
                    {res.children > 0 && (
                      <div className="flex items-center gap-3 px-6 py-4 sm:px-8 sm:py-5 bg-slate-50 dark:bg-slate-800/50 rounded-[20px] sm:rounded-[28px] text-sm sm:text-lg font-black text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                        <span className="material-symbols-outlined text-xl sm:text-2xl">face</span>
                        {res.children} Ni.
                      </div>
                    )}
                </div>
              </div>

              {/* Divisor Visual - Adaptable */}
              <div className="relative w-full lg:w-px flex items-center justify-center">
                <div className="absolute inset-x-0 h-px border-t-2 border-dashed border-slate-200 dark:border-slate-800 lg:hidden px-10"></div>
                <div className="absolute inset-y-0 w-px border-l-2 border-dashed border-slate-200 dark:border-slate-800 hidden lg:block"></div>
                
                {/* Círculos Troquelados Mobile */}
                <div className="absolute left-0 -translate-x-1/2 size-8 bg-background-light dark:bg-background-dark rounded-full border border-slate-200 dark:border-slate-800 z-20 lg:hidden"></div>
                <div className="absolute right-0 translate-x-1/2 size-8 bg-background-light dark:bg-background-dark rounded-full border border-slate-200 dark:border-slate-800 z-20 lg:hidden"></div>
                
                {/* Círculos Troquelados Desktop */}
                <div className="absolute top-0 -translate-y-1/2 size-10 bg-background-light dark:bg-background-dark rounded-full border border-slate-200 dark:border-slate-800 z-20 hidden lg:block"></div>
                <div className="absolute bottom-0 translate-y-1/2 size-10 bg-background-light dark:bg-background-dark rounded-full border border-slate-200 dark:border-slate-800 z-20 hidden lg:block"></div>
              </div>

              {/* Parte Inferior/Derecha: QR */}
              <div className="lg:w-[400px] bg-[#fdfdfe] dark:bg-slate-950 p-10 sm:p-12 flex flex-col items-center justify-center gap-6 sm:gap-8 shrink-0">
                 <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ESCANEO RÁPIDO</h3>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Muestra el código al personal</p>
                 </div>
                 
                 <div className="relative p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-[40px] sm:rounded-[50px] shadow-xl border border-slate-100 dark:border-slate-800 group overflow-hidden">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${res.id}&bgcolor=ffffff&color=000000&margin=10`}
                      alt="QR Code"
                      className="size-44 sm:size-56 object-contain rounded-xl"
                    />
                 </div>

                 <div className="flex flex-col items-center gap-1">
                   <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                     <span className="material-symbols-outlined text-base filled">verified</span>
                     TICKET OFICIAL
                   </div>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] opacity-40">{res.id}</p>
                 </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[40px] sm:rounded-[60px] p-12 sm:p-24 border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center text-center gap-8 shadow-sm">
             <div className="size-24 sm:size-32 rounded-[30px] sm:rounded-[40px] bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-5xl sm:text-7xl text-slate-200 font-black">confirmation_number</span>
             </div>
             <div className="max-w-md">
                <h2 className="text-2xl sm:text-3xl font-impact text-slate-950 dark:text-white mb-3 sm:mb-4 uppercase tracking-tighter">Sin Visitas Pendientes</h2>
                <p className="text-slate-500 text-base sm:text-lg font-medium leading-relaxed">Tus códigos de acceso aparecerán aquí una vez realices tu primera reserva.</p>
             </div>
             <button 
               onClick={onNewReservation}
               className="px-10 py-5 sm:px-12 sm:py-6 bg-primary text-white rounded-[20px] sm:rounded-[28px] font-impact shadow-2xl shadow-primary/20 hover:bg-blue-600 transition-all active:scale-95 text-base sm:text-lg uppercase tracking-widest"
             >
               RESERVAR AHORA
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
