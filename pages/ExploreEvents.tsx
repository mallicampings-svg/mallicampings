
import React, { useState } from 'react';
import { AppEvent, Reservation, User } from '../types';

interface ExploreEventsProps {
  user: User;
  events?: AppEvent[];
  onBack?: () => void;
  onReserve?: (reservation: Reservation) => void;
  prices: {
    mesa: number;
    asador: number;
    adulto: number;
    nino: number;
  };
}

const ExploreEvents: React.FC<ExploreEventsProps> = ({ user, events = [], onBack, onReserve, prices }) => {
  const [configuringEventId, setConfiguringEventId] = useState<string | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [bookTable, setBookTable] = useState(false);
  const [bookAsador, setBookAsador] = useState(false);
  const [isConfirming, setIsConfirming] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [finalRes, setFinalRes] = useState<Reservation | null>(null);

  const handleStartConfiguration = (eventId: string) => {
    setConfiguringEventId(eventId);
    setAdults(1);
    setChildren(0);
    setBookTable(false);
    setBookAsador(false);
  };

  // Fix: Change Event to AppEvent
  const calculateTotal = (event: AppEvent) => {
    const pAdult = event.priceAdult ?? prices.adulto;
    const pChild = event.priceChild ?? prices.nino;
    const tablePrice = bookTable ? prices.mesa : 0;
    const asadorPrice = bookAsador ? prices.asador : 0;
    return (adults * pAdult) + (children * pChild) + tablePrice + asadorPrice;
  };

  // Fix: Change Event to AppEvent
  const handleReserveEvent = (event: AppEvent) => {
    setIsConfirming(event.id);
    
    setTimeout(() => {
      const resources = [];
      if (bookTable) resources.push('Mesa');
      if (bookAsador) resources.push('Asador');
      const resourceStr = resources.length > 0 ? ` + ${resources.join(' y ')}` : '';

      const newRes: Reservation = {
        id: `EVT-RES-${Math.floor(1000 + Math.random() * 9000)}`,
        clientName: user.name,
        clientEmail: user.email,
        clientPhone: user.phone || '',
        clientAvatar: user.avatar || '',
        date: event.date,
        time: event.time,
        resource: `Evento: ${event.name}${resourceStr}`,
        status: 'Activa',
        adults: adults, 
        children: children
      };
      setFinalRes(newRes);
      setIsConfirming(null);
      setShowSuccess(true);
    }, 1500);
  };

  const handleFinalize = () => {
    if (finalRes && onReserve) {
      onReserve(finalRes);
    }
  };

  if (showSuccess && finalRes) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[80vh] bg-slate-50 dark:bg-slate-950/20 animate-in fade-in duration-700">
        <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[48px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100 dark:border-slate-800 p-12 flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-4">
             <div className="size-20 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500 flex items-center justify-center animate-in zoom-in duration-500 delay-300">
                <span className="material-symbols-outlined text-4xl font-black">check_circle</span>
             </div>
             <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight text-center">¡Inscripción Exitosa!</h2>
          </div>
          <div className="w-full flex flex-col gap-2">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] text-center">DETALLES DE RESERVA</span>
            <div className="flex flex-col items-center text-primary font-black text-xl tracking-tighter">
                <span>{adults} ADULTOS</span>
                {children > 0 && <span>{children} NIÑOS (HASTA 8 AÑOS)</span>}
            </div>
            <p className="text-[10px] text-slate-400 font-bold text-center mt-2 px-4 italic leading-relaxed">Tu lugar ha sido asegurado para {finalRes.resource}.</p>
          </div>
          <div className="w-full h-px bg-slate-100 dark:bg-slate-800 border-t border-dashed"></div>
          <div className="flex flex-col gap-4 w-full">
            <button 
              onClick={handleFinalize} 
              className="w-full py-5 bg-[#0f172a] text-white rounded-[24px] font-black text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2"
            >
              CERRAR Y CONTINUAR
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto flex flex-col gap-10 relative">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 transition-all shadow-sm border border-slate-100 dark:border-slate-800"
            >
              <span className="material-symbols-outlined text-2xl">arrow_back</span>
            </button>
          )}
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Experiencias Oficiales</h1>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-2xl">Participa en actividades exclusivas diseñadas para nuestra comunidad de usuarios.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {(events && events.length > 0) ? (
          events.map((event) => {
            const isConfiguring = configuringEventId === event.id;
            const eventPriceAdult = event.priceAdult ?? prices.adulto;
            const eventPriceChild = event.priceChild ?? prices.nino;

            return (
              <div key={event.id} className="group bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url(${event.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-primary text-white shadow-lg rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                      ACTIVIDAD {event.category.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col gap-2">
                     <h3 className="text-2xl md:text-3xl font-black leading-tight group-hover:text-primary transition-colors">{event.name}</h3>
                     <div className="flex items-center gap-4 text-xs font-bold text-slate-200 uppercase tracking-widest">
                       <div className="flex items-center gap-2">
                         <span className="material-symbols-outlined text-base">calendar_month</span>
                         {event.date}
                       </div>
                       <div className="flex items-center gap-2">
                         <span className="material-symbols-outlined text-base">schedule</span>
                         {event.time} HS
                       </div>
                     </div>
                  </div>
                </div>

                <div className="p-8 md:p-10 flex flex-col gap-8 flex-1">
                  {!isConfiguring ? (
                    <>
                      <div className="flex flex-col gap-4">
                        <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed text-lg line-clamp-3">
                          {event.description || "Sin descripción disponible para este evento."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-y border-slate-100 dark:border-slate-800 py-8">
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adultos</span>
                            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                              <span className="text-primary">$</span>
                              {eventPriceAdult}
                            </div>
                         </div>
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Niños (Hasta 8a)</span>
                            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                              <span className="text-primary">$</span>
                              {eventPriceChild}
                            </div>
                         </div>
                         <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacidad</span>
                            <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                              <span className="material-symbols-outlined text-primary text-xl">groups</span>
                              {event.capacity}
                            </div>
                         </div>
                      </div>

                      <div className="mt-auto pt-4">
                        <button 
                          disabled={event.progress >= 100}
                          onClick={() => handleStartConfiguration(event.id)}
                          className={`w-full py-5 rounded-3xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
                            event.progress >= 100 
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed shadow-none' 
                            : 'bg-primary text-white shadow-xl shadow-primary/20 hover:bg-blue-600 active:scale-95'
                          }`}
                        >
                          {event.progress >= 100 ? (
                            <>
                              <span className="material-symbols-outlined">event_busy</span>
                              CUPOS AGOTADOS
                            </>
                          ) : (
                            <>
                              <span className="material-symbols-outlined">confirmation_number</span>
                              RESERVAR MI LUGAR
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                         <h4 className="font-impact text-xl uppercase tracking-tighter">CONFIGURAR INVITADOS</h4>
                         <button onClick={() => setConfiguringEventId(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-all">
                           <span className="material-symbols-outlined text-2xl">close</span>
                         </button>
                      </div>

                      <div className="flex flex-col gap-4">
                         {/* Adultos */}
                         <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-[32px] border border-slate-100/50 dark:border-slate-800">
                            <div className="flex flex-col">
                               <p className="font-black text-slate-900 dark:text-white">Adultos</p>
                               <p className="text-[11px] text-slate-400 font-bold">${eventPriceAdult} c/u</p>
                            </div>
                            <div className="flex items-center gap-5 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                               <button onClick={() => setAdults(Math.max(1, adults - 1))} className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 font-black hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-90">-</button>
                               <span className="text-xl font-black w-6 text-center">{adults}</span>
                               <button onClick={() => setAdults(adults + 1)} className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 font-black hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-90">+</button>
                            </div>
                         </div>

                         {/* Niños */}
                         <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-[32px] border border-slate-100/50 dark:border-slate-800">
                            <div className="flex flex-col">
                               <p className="font-black text-slate-900 dark:text-white">Niños (Hasta 8 años)</p>
                               <p className="text-[11px] text-slate-400 font-bold">${eventPriceChild} c/u</p>
                            </div>
                            <div className="flex items-center gap-5 bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                               <button onClick={() => setChildren(Math.max(0, children - 1))} className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 font-black hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-90">-</button>
                               <span className="text-xl font-black w-6 text-center">{children}</span>
                               <button onClick={() => setChildren(children + 1)} className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700 font-black hover:bg-slate-100 dark:hover:bg-slate-700 transition-all active:scale-90">+</button>
                            </div>
                         </div>

                         {/* Mesa */}
                         <button 
                            onClick={() => setBookTable(!bookTable)}
                            className={`flex items-center justify-between p-6 rounded-[32px] border-2 transition-all group ${bookTable ? 'border-primary bg-primary/5' : 'border-slate-100/50 bg-slate-50/50 dark:bg-slate-800/30'}`}
                         >
                            <div className="flex items-center gap-4">
                               <div className={`size-12 rounded-2xl flex items-center justify-center transition-colors ${bookTable ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                                  <span className="material-symbols-outlined text-2xl">restaurant</span>
                               </div>
                               <span className={`font-black text-lg ${bookTable ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>¿Reservar Mesa?</span>
                            </div>
                            <span className={`font-black text-lg ${bookTable ? 'text-primary' : 'text-slate-400'}`}>+${prices.mesa}</span>
                         </button>

                         {/* Asador */}
                         <button 
                            onClick={() => setBookAsador(!bookAsador)}
                            className={`flex items-center justify-between p-6 rounded-[32px] border-2 transition-all group ${bookAsador ? 'border-primary bg-primary/5' : 'border-slate-100/50 bg-slate-50/50 dark:bg-slate-800/30'}`}
                         >
                            <div className="flex items-center gap-4">
                               <div className={`size-12 rounded-2xl flex items-center justify-center transition-colors ${bookAsador ? 'bg-primary text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'}`}>
                                  <span className="material-symbols-outlined text-2xl">outdoor_grill</span>
                               </div>
                               <span className={`font-black text-lg ${bookAsador ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>¿Reservar Asador?</span>
                            </div>
                            <span className={`font-black text-lg ${bookAsador ? 'text-primary' : 'text-slate-400'}`}>+${prices.asador}</span>
                         </button>
                      </div>

                      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-4">
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">TOTAL A PAGAR</span>
                            <span className="text-4xl font-black text-primary tracking-tighter leading-none">${calculateTotal(event)}</span>
                         </div>
                         <button 
                            onClick={() => handleReserveEvent(event)}
                            disabled={isConfirming === event.id}
                            className="px-12 py-5 bg-[#0f172a] text-white rounded-[24px] font-impact text-lg uppercase tracking-widest shadow-2xl shadow-slate-900/10 hover:bg-slate-800 active:scale-95 transition-all"
                         >
                            {isConfirming === event.id ? (
                               <div className="flex items-center gap-3">
                                  <span className="animate-spin material-symbols-outlined text-xl">progress_activity</span>
                                  PROCESANDO
                               </div>
                            ) : 'CONFIRMAR'}
                         </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-400 gap-8">
             <div className="size-32 rounded-[40px] bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center animate-bounce">
                <span className="material-symbols-outlined text-7xl opacity-20">celebration</span>
             </div>
             <div className="text-center flex flex-col gap-3">
                <h3 className="font-black text-3xl text-slate-800 dark:text-slate-300 tracking-tight">Próximamente...</h3>
                <p className="font-medium text-slate-500 max-w-sm">Estamos preparando nuevas experiencias exclusivas para ti. Vuelve pronto.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreEvents;
