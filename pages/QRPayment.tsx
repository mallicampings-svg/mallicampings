
import React, { useState } from 'react';
import { Reservation } from '../types';

interface QRPaymentProps {
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  onBack?: () => void;
  prices: {
    mesa: number;
    asador: number;
    adulto: number;
    nino: number;
  };
}

const QRPayment: React.FC<QRPaymentProps> = ({ reservations, setReservations, onBack, prices }) => {
  const [scannedRes, setScannedRes] = useState<Reservation | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  const calculateTotal = (res: Reservation) => {
    const isMesa = res.resource.toLowerCase().includes('mesa');
    const basePrice = isMesa ? prices.mesa : prices.asador;
    return basePrice + (res.adults * prices.adulto) + (res.children * prices.nino);
  };

  const handleSearch = () => {
    const found = reservations.find(r => r.id === manualCode.toUpperCase());
    if (found) {
      setScannedRes(found);
    } else {
      alert("Reserva no encontrada");
    }
  };

  // Simulación: Escaneo automático al cargar
  React.useEffect(() => {
    const timer = setTimeout(() => {
        const pendingRes = reservations.find(r => r.status === 'Pendiente' || r.status === 'Activa');
        if (pendingRes) setScannedRes(pendingRes);
    }, 2000);
    return () => clearTimeout(timer);
  }, [reservations]);

  const handleProcessPayment = (method: 'Efectivo' | 'Transferencia') => {
    if (!scannedRes) return;
    setIsProcessing(method);
    
    setTimeout(() => {
      setReservations(prev => prev.map(r => 
        r.id === scannedRes.id ? { ...r, status: 'Pagada' } : r
      ));
      
      setIsProcessing(null);
      setScannedRes(null);
      setManualCode('');
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 md:p-12 max-w-7xl mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 transition-all shadow-sm border border-slate-100 dark:border-slate-800 active:scale-90"
            >
              <span className="material-symbols-outlined text-2xl font-black">arrow_back</span>
            </button>
          )}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-4xl font-impact tracking-tight text-slate-900 dark:text-white leading-none uppercase">Validar Pago QR</h1>
            <p className="text-slate-500 font-bold text-sm sm:text-base">Liquidación instantánea de ingresos.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
        {/* Lector QR */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] sm:rounded-[50px] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-impact text-slate-900 dark:text-white flex items-center gap-3 uppercase text-sm sm:text-base">
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl font-black">qr_code_scanner</span>
                Lector Activo
              </h3>
              <span className="flex size-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
            </div>
            <div className="p-6 sm:p-8 md:p-10 flex flex-col gap-8">
              <div className="relative w-full aspect-square bg-slate-900 rounded-[35px] sm:rounded-[45px] overflow-hidden group border-8 border-slate-100 dark:border-slate-800">
                <div className="absolute inset-0 bg-cover bg-center opacity-40" 
                     style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=2070&auto=format&fit=crop")' }} />
                <div className="absolute inset-0 flex items-center justify-center p-8">
                  <div className="w-full aspect-square border-4 border-white/20 rounded-[40px] relative">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-primary shadow-[0_0_30px_#137fec] animate-scan"></div>
                    <div className="absolute top-0 left-0 size-8 border-t-4 border-l-4 border-primary -mt-1 -ml-1 rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 size-8 border-t-4 border-r-4 border-primary -mt-1 -mr-1 rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 size-8 border-b-4 border-l-4 border-primary -mb-1 -ml-1 rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 size-8 border-b-4 border-r-4 border-primary -mb-1 -mr-1 rounded-br-xl"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Búsqueda por código</label>
                <div className="flex gap-3">
                  <input 
                    className="flex-1 rounded-[20px] border-none bg-slate-50 dark:bg-slate-950 font-black px-6 h-14 sm:h-16 text-lg focus:ring-4 focus:ring-primary/10 transition-all outline-none text-slate-950 dark:text-white" 
                    placeholder="RES-000-XX" 
                    type="text" 
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-6 sm:px-10 bg-[#0f172a] text-white rounded-[20px] font-impact hover:bg-slate-800 transition-all active:scale-95 uppercase text-xs tracking-widest"
                  >
                    BUSCAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles de Reserva Scaneada */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {scannedRes ? (
            <div className="bg-white dark:bg-slate-900 rounded-[50px] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in slide-in-from-right-8 duration-500">
              <div className="bg-[#0b1325] p-8 sm:p-12 text-white flex flex-col sm:flex-row justify-between items-center gap-6 relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="size-16 sm:size-20 bg-white/5 rounded-full flex items-center justify-center border border-white/10 text-slate-400 shrink-0">
                    <span className="material-symbols-outlined text-4xl sm:text-5xl">account_circle</span>
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-2xl sm:text-3xl font-impact tracking-tight leading-none mb-2 uppercase">{scannedRes.clientName}</h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] leading-none">{scannedRes.clientEmail}</p>
                  </div>
                </div>
                <div className="size-12 sm:size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative z-10 shrink-0">
                  <span className="material-symbols-outlined font-black text-primary text-3xl sm:text-4xl">verified</span>
                </div>
              </div>

              <div className="p-8 sm:p-12 flex flex-col gap-8 sm:gap-10">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">ID TRANSACCIÓN</span>
                      <span className="font-mono font-black text-primary text-2xl sm:text-3xl tracking-tighter">{scannedRes.id}</span>
                    </div>
                    <span className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 shadow-sm ${
                      scannedRes.status === 'Pagada' ? 'bg-[#f0fdf4] text-[#166534] border-[#dcfce7]' : 'bg-[#fffbeb] text-[#92400e] border-[#fef3c7]'
                    }`}>
                      {scannedRes.status.toUpperCase()}
                    </span>
                 </div>

                 <div className="h-px bg-slate-100 dark:bg-slate-800 border-t-2 border-dashed w-full opacity-50"></div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
                    <div className="flex flex-col gap-3">
                      <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">RECURSO</span>
                      <div className="flex items-center gap-4 text-slate-900 dark:text-white font-impact text-xl sm:text-2xl uppercase tracking-tighter">
                        <div className="size-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-3xl font-black">
                            {scannedRes.resource.toLowerCase().includes('mesa') ? 'restaurant' : 'outdoor_grill'}
                          </span>
                        </div>
                        {scannedRes.resource}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">CALENDARIO</span>
                      <span className="font-impact text-slate-900 dark:text-white text-2xl sm:text-3xl leading-none uppercase tracking-tighter">
                        {scannedRes.date}
                        <span className="block text-slate-400 text-lg italic mt-1 leading-none">• {scannedRes.time} hs</span>
                      </span>
                    </div>
                 </div>

                 <div className="flex flex-col gap-5">
                    <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">CAPACIDAD</span>
                    <div className="grid grid-cols-2 gap-4 sm:gap-6">
                       <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[30px] border-2 border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Adultos</span>
                          <span className="font-impact text-2xl sm:text-3xl text-slate-900 dark:text-white">{scannedRes.adults}</span>
                       </div>
                       <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[30px] border-2 border-slate-100 dark:border-slate-800">
                          <span className="text-[10px] font-black text-slate-400 uppercase">Niños</span>
                          <span className="font-impact text-2xl sm:text-3xl text-slate-900 dark:text-white">{scannedRes.children}</span>
                       </div>
                    </div>
                 </div>

                 <div className="h-px bg-slate-100 dark:bg-slate-800 w-full mt-2"></div>

                 <div className="flex flex-col sm:flex-row items-center justify-between gap-10 pt-4">
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                      <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em] mb-1">TOTAL LIQUIDACIÓN</span>
                      <span className="text-6xl sm:text-7xl font-impact text-primary tracking-tighter leading-none">
                        ${calculateTotal(scannedRes)}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-4 w-full max-w-[340px]">
                       {scannedRes.status !== 'Pagada' ? (
                         <>
                            <button 
                              onClick={() => handleProcessPayment('Efectivo')}
                              disabled={!!isProcessing}
                              className="w-full h-16 sm:h-20 bg-primary text-white rounded-full font-impact shadow-2xl shadow-primary/30 hover:bg-blue-600 transition-all active:scale-95 text-xs sm:text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3"
                            >
                              {isProcessing === 'Efectivo' ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : <><span className="material-symbols-outlined">payments</span> EFECTIVO</>}
                            </button>
                            <button 
                              onClick={() => handleProcessPayment('Transferencia')}
                              disabled={!!isProcessing}
                              className="w-full h-16 sm:h-20 bg-[#0b1325] text-white rounded-full font-impact shadow-xl hover:bg-slate-800 transition-all active:scale-95 text-xs sm:text-sm uppercase tracking-[0.2em] border border-white/10 flex items-center justify-center gap-3"
                            >
                              {isProcessing === 'Transferencia' ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : <><span className="material-symbols-outlined">account_balance_wallet</span> TRANSFERENCIA</>}
                            </button>
                         </>
                       ) : (
                         <div className="w-full text-green-600 font-impact text-center flex flex-col items-center gap-3 justify-center bg-green-50 dark:bg-green-900/10 py-10 rounded-[40px] border-2 border-dashed border-green-200 dark:border-green-800/30">
                           <span className="material-symbols-outlined text-5xl filled">check_circle</span>
                           <span className="uppercase tracking-widest text-lg">PAGO VALIDADO</span>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 sm:p-24 bg-white dark:bg-slate-900/40 rounded-[50px] sm:rounded-[60px] border-4 border-dashed border-slate-100 dark:border-slate-800 text-center">
               <span className="material-symbols-outlined text-8xl sm:text-9xl text-slate-100 dark:text-slate-800 mb-8 animate-pulse">qr_code_scanner</span>
               <h3 className="text-2xl font-impact text-slate-400 uppercase tracking-tighter">Esperando escaneo...</h3>
               <p className="text-slate-400 font-bold mt-4 max-w-xs leading-relaxed text-sm sm:text-base">Inicia la cámara o ingresa un código manualmente para procesar el ingreso.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRPayment;
