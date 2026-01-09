
import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_PRICES, formatAppDate } from '../constants';
import { Reservation } from '../types';

interface AdminReservationsProps {
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  onBack?: () => void;
  onVerifyQR?: () => void;
}

const AdminReservations: React.FC<AdminReservationsProps> = ({ reservations, setReservations, onBack, onVerifyQR }) => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [todayStr, setTodayStr] = useState(formatAppDate(new Date()));
  const itemsPerPage = 8;

  useEffect(() => {
    const timer = setInterval(() => {
      setTodayStr(formatAppDate(new Date()));
    }, 60000); 
    return () => clearInterval(timer);
  }, []);

  const globalStats = useMemo(() => {
    const paidList = reservations.filter(r => r.status === 'Pagada');
    const pendingList = reservations.filter(r => r.status === 'Pendiente' || r.status === 'Activa');
    
    const calculateRev = (resList: Reservation[]) => resList.reduce((acc, res) => {
      const basePrice = res.resource.toLowerCase().includes('mesa') ? INITIAL_PRICES.mesa : INITIAL_PRICES.asador;
      return acc + basePrice + (res.adults * INITIAL_PRICES.adulto) + (res.children * INITIAL_PRICES.nino);
    }, 0);

    return {
      paidCount: paidList.length,
      pendingCount: pendingList.length,
      paidRevenue: calculateRev(paidList),
      pendingRevenue: calculateRev(pendingList)
    };
  }, [reservations]);

  const filteredReservations = useMemo(() => {
    return reservations.filter(res => {
      const searchLower = searchTerm.toLowerCase();
      return (
        res.clientName.toLowerCase().includes(searchLower) ||
        res.id.toLowerCase().includes(searchLower) ||
        res.resource.toLowerCase().includes(searchLower)
      );
    });
  }, [reservations, searchTerm]);

  const totalItems = filteredReservations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredReservations.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, filteredReservations]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const calculateTotal = (res: Reservation) => {
    const basePrice = res.resource.toLowerCase().includes('mesa') ? INITIAL_PRICES.mesa : INITIAL_PRICES.asador;
    return basePrice + (res.adults * INITIAL_PRICES.adulto) + (res.children * INITIAL_PRICES.nino);
  };

  const handleConfirmPayment = (method: 'Efectivo' | 'Transferencia') => {
    if (!selectedReservation) return;
    setReservations(prev => prev.map(r => 
      r.id === selectedReservation.id ? { ...r, status: 'Pagada' } : r
    ));
    setSelectedReservation(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto flex flex-col gap-8 h-full animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 transition-all shadow-sm border border-slate-100 dark:border-slate-800 active:scale-95"
            >
              <span className="material-symbols-outlined text-2xl font-black">arrow_back</span>
            </button>
          )}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-none uppercase">Gestión Operativa</h1>
            <p className="text-slate-500 text-sm md:text-base font-bold">Monitoreo y validación de pagos.</p>
          </div>
        </div>

        {onVerifyQR && (
          <button 
            onClick={onVerifyQR}
            className="flex items-center justify-center gap-3 px-8 py-5 bg-primary text-white rounded-[24px] font-black shadow-xl shadow-primary/30 hover:bg-blue-600 transition-all active:scale-95 text-xs tracking-widest uppercase w-full md:w-auto"
          >
            <span className="material-symbols-outlined text-2xl font-black">qr_code_scanner</span>
            Escanear Pago QR
          </button>
        )}
      </header>

      {/* Tarjetas de Resumen Global */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-6 group">
           <div className="size-16 md:size-20 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center shrink-0">
             <span className="material-symbols-outlined text-3xl md:text-5xl font-black filled">pending_actions</span>
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Por Validar</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-impact text-slate-950 dark:text-white leading-none">{globalStats.pendingCount}</span>
                <span className="text-xs font-bold text-slate-400 lowercase">items</span>
              </div>
              <span className="text-[11px] font-black text-amber-600 mt-1 tracking-tight">${globalStats.pendingRevenue.toLocaleString()}</span>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-6 group">
           <div className="size-16 md:size-20 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center shrink-0">
             <span className="material-symbols-outlined text-3xl md:text-5xl font-black filled">check_circle</span>
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Confirmadas</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-impact text-slate-950 dark:text-white leading-none">{globalStats.paidCount}</span>
                <span className="text-xs font-bold text-slate-400 lowercase">items</span>
              </div>
              <span className="text-[11px] font-black text-green-600 mt-1 tracking-tight">${globalStats.paidRevenue.toLocaleString()}</span>
           </div>
        </div>

        <div className="hidden lg:flex bg-[#0b1325] p-8 rounded-[40px] border border-white/5 shadow-2xl items-center gap-8 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <div className="size-20 rounded-[24px] bg-white/10 text-primary flex items-center justify-center shrink-0 relative z-10 border border-white/10">
             <span className="material-symbols-outlined text-4xl font-black filled">calendar_month</span>
           </div>
           <div className="flex flex-col relative z-10">
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Jornada</span>
              <span className="text-2xl font-impact tracking-tight">{todayStr}</span>
              <div className="flex items-center gap-2 mt-2">
                 <span className="flex size-2 bg-primary rounded-full animate-pulse"></span>
                 <span className="text-[10px] font-black uppercase text-primary tracking-widest">Live Sync</span>
              </div>
           </div>
        </div>
      </section>

      {/* Buscador adaptable */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm max-w-2xl">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-2xl font-black">search</span>
          <input 
            type="text" 
            placeholder="Buscar reserva..." 
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-950 border-none rounded-2xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/5 outline-none transition-all text-lg font-bold"
          />
        </div>
      </div>

      {/* Lista de Reservas: Tabla para desktop, Cards para mobile */}
      <div className="flex flex-col gap-4">
        {/* Desktop Table */}
        <div className="hidden md:block bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 dark:border-slate-800">
                <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Usuario</th>
                <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">ID</th>
                <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Detalles</th>
                <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Estado</th>
                <th className="px-8 py-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {currentItems.map((res) => (
                <tr 
                  key={res.id} 
                  onClick={() => setSelectedReservation(res)}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all cursor-pointer group"
                >
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-4xl text-slate-400">account_circle</span>
                      <div className="flex flex-col">
                        <span className="font-impact text-slate-950 dark:text-white text-lg leading-tight uppercase tracking-tight">{res.clientName}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8 font-mono text-sm font-black text-primary tracking-tighter">{res.id}</td>
                  <td className="px-8 py-8">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 dark:text-white text-sm">{res.resource}</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{res.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                     <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                       res.status === 'Pagada' 
                       ? 'bg-[#f0fdf4] text-[#166534] border-[#dcfce7]' 
                       : 'bg-amber-50 text-amber-700 border-amber-200/50'
                     }`}>
                       {res.status === 'Pagada' ? 'Pagado' : 'Pendiente'}
                     </span>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <button className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-primary hover:text-white transition-all">
                      <span className="material-symbols-outlined">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Mejorado para PWA */}
        <div className="md:hidden flex flex-col gap-4">
          {currentItems.map((res) => (
            <div 
              key={res.id}
              onClick={() => setSelectedReservation(res)}
              className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-lg active:scale-[0.98] transition-all flex flex-col gap-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-4xl text-slate-400">account_circle</span>
                  <div className="flex flex-col">
                    <span className="font-impact text-slate-950 dark:text-white text-lg tracking-tight uppercase leading-none">{res.clientName}</span>
                    <span className="text-[10px] font-mono font-black text-primary tracking-tighter uppercase mt-1">{res.id}</span>
                  </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  res.status === 'Pagada' ? 'bg-[#f0fdf4] text-[#166534] border-[#dcfce7]' : 'bg-amber-50 text-amber-700 border-amber-200/50'
                }`}>
                  {res.status === 'Pagada' ? 'OK' : 'PND'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4">
                 <div className="flex flex-col">
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{res.resource}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{res.date} • {res.time}hs</p>
                 </div>
                 <button className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined font-black">chevron_right</span>
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Página {currentPage} de {totalPages || 1}</p>
          <div className="flex gap-4 w-full sm:w-auto">
            <button 
              onClick={() => goToPage(currentPage - 1)} 
              disabled={currentPage === 1} 
              className="flex-1 sm:size-14 h-14 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 disabled:opacity-30 active:scale-90 transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined font-black">chevron_left</span>
            </button>
            <button 
              onClick={() => goToPage(currentPage + 1)} 
              disabled={currentPage === totalPages || totalPages === 0} 
              className="flex-1 sm:size-14 h-14 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 disabled:opacity-30 active:scale-90 transition-all flex items-center justify-center"
            >
              <span className="material-symbols-outlined font-black">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {selectedReservation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-[50px] shadow-2xl overflow-y-auto w-full max-w-xl max-h-[90vh] border border-white/5 flex flex-col">
             <div className="bg-[#0b1325] p-8 md:p-12 text-white flex justify-between items-center relative overflow-hidden shrink-0">
               <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[100px] -mr-40 -mt-40"></div>
               <div className="flex items-center gap-6 relative z-10">
                 <span className="material-symbols-outlined text-6xl text-slate-500">account_circle</span>
                 <div className="flex flex-col">
                   <h2 className="text-2xl md:text-3xl font-impact tracking-tight leading-none mb-1 uppercase">{selectedReservation.clientName}</h2>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{selectedReservation.id}</p>
                 </div>
               </div>
               <button onClick={() => setSelectedReservation(null)} className="size-12 hover:bg-white/10 rounded-2xl text-white/60 flex items-center justify-center border border-white/10 relative z-10">
                 <span className="material-symbols-outlined text-2xl font-black">close</span>
               </button>
             </div>

             <div className="p-8 md:p-12 flex flex-col gap-8 md:gap-10">
               <div className="grid grid-cols-2 gap-8 border-b border-slate-100 dark:border-slate-800 pb-8">
                 <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">RECURSO</span>
                   <span className="font-impact text-slate-900 dark:text-white text-xl leading-none uppercase tracking-tighter">{selectedReservation.resource}</span>
                 </div>
                 <div className="flex flex-col gap-2">
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ESTADO</span>
                   <span className={`font-black text-sm uppercase tracking-widest ${selectedReservation.status === 'Pagada' ? 'text-green-600' : 'text-amber-600'}`}>{selectedReservation.status}</span>
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                 <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/80 rounded-[32px] border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-black uppercase text-slate-400">Adultos</span>
                    <span className="font-impact text-2xl text-slate-900 dark:text-white">{selectedReservation.adults}</span>
                 </div>
                 <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/80 rounded-[32px] border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-black uppercase text-slate-400">Niños</span>
                    <span className="font-impact text-2xl text-slate-900 dark:text-white">{selectedReservation.children}</span>
                 </div>
               </div>

               <div className="flex items-center justify-between gap-6 pt-6 mt-4">
                 <div className="flex flex-col">
                   <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">TOTAL</span>
                   <span className="text-4xl md:text-5xl font-impact text-primary tracking-tighter leading-none">${calculateTotal(selectedReservation)}</span>
                 </div>
                 
                 {selectedReservation.status !== 'Pagada' ? (
                   <div className="flex flex-col gap-3 w-full max-w-[240px]">
                     <button 
                      onClick={() => handleConfirmPayment('Efectivo')}
                      className="w-full py-5 bg-primary text-white rounded-full font-black shadow-xl shadow-primary/30 hover:bg-blue-600 transition-all active:scale-95 text-[10px] uppercase tracking-widest"
                     >
                       LIQUIDAR EFECTIVO
                     </button>
                     <button 
                      onClick={() => handleConfirmPayment('Transferencia')}
                      className="w-full py-5 bg-[#0b1325] text-white rounded-full font-black hover:bg-slate-800 transition-all active:scale-95 text-[10px] uppercase tracking-widest border border-white/10"
                     >
                       CONFIRMAR TRANSF.
                     </button>
                   </div>
                 ) : (
                    <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/10 px-8 py-5 rounded-[32px] border border-emerald-100">
                        <span className="material-symbols-outlined text-emerald-500 font-black">verified</span>
                        <span className="text-emerald-700 dark:text-emerald-400 font-black text-xs uppercase tracking-widest">PAGADA</span>
                    </div>
                 )}
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservations;
