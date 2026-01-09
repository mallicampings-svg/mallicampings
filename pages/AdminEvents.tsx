
import React, { useState, useRef } from 'react';
import { AppEvent } from '../types';
import { formatAppDate, formatAppTime } from '../constants';

interface AdminEventsProps {
  events?: AppEvent[];
  setEvents?: React.Dispatch<React.SetStateAction<AppEvent[]>>;
  onBack?: () => void;
}

const AdminEvents: React.FC<AdminEventsProps> = ({ events = [], setEvents, onBack }) => {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; visible: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);

  // Fix: Change Event to AppEvent
  const handleFieldChange = (id: string, field: keyof AppEvent, value: any) => {
    if (!setEvents) return;
    setEvents(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeEventId) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        handleFieldChange(activeEventId, 'image', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = (id: string) => {
    setActiveEventId(id);
    fileInputRef.current?.click();
  };

  const handleUpdate = (id: string) => {
    setIsUpdating(id);
    setTimeout(() => {
      setIsUpdating(null);
      setToast({ message: "Experiencia actualizada con éxito", visible: true });
      setTimeout(() => setToast(null), 3000);
    }, 800);
  };

  const handleCreate = () => {
    if (!setEvents) return;
    const now = new Date();
    const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Fix: Change Event to AppEvent
    const newEvent: AppEvent = {
      id: `EVT-${Date.now()}`,
      name: 'Nueva Experiencia Familiar',
      category: 'General',
      date: formatAppDate(futureDate),
      time: formatAppTime(now),
      capacity: 'Libre',
      location: 'Complejo Central',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=2000&auto=format&fit=crop',
      progress: 0,
      description: 'Describe aquí las actividades para los usuarios.',
      duration: 'A definir',
      dressCode: 'Libre'
    };
    setEvents([newEvent, ...events]);
    setToast({ message: "Borrador de evento creado", visible: true });
    setTimeout(() => setToast(null), 3000);
  };

  const confirmDelete = (id: string) => setDeleteId(id);

  const executeDelete = () => {
    if (deleteId && setEvents) {
      setEvents(prev => prev.filter(e => e.id !== deleteId));
      setDeleteId(null);
      setToast({ message: "Evento eliminado", visible: true });
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto flex flex-col gap-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 transition-all shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <span className="material-symbols-outlined text-2xl font-bold">arrow_back</span>
            </button>
          )}
          <div className="flex flex-col">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Editor de Experiencias</h1>
            <p className="text-slate-500 font-bold">Configura y personaliza eventos oficiales.</p>
          </div>
        </div>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-10 py-5 bg-primary text-white rounded-[24px] font-black shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-2xl">add</span>
          Crear Evento
        </button>
      </header>

      {/* Input de archivo oculto compartido para todos los eventos */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      <div className="flex flex-col gap-16">
        {events.map((event) => (
          <div key={event.id} className="bg-white dark:bg-slate-900 rounded-[50px] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-in fade-in slide-in-from-bottom-6 duration-500">
            
            <div className="w-full lg:w-[450px] relative bg-slate-950 flex flex-col shrink-0">
               <div className="aspect-video lg:aspect-square bg-cover bg-center overflow-hidden relative group" style={{ backgroundImage: `url(${event.image})` }}>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px] z-20">
                     <button 
                      onClick={() => triggerImageUpload(event.id)}
                      className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all"
                     >
                       Subir Imagen
                     </button>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10 pointer-events-none"></div>
                  
                  <div className="absolute inset-x-0 bottom-0 p-10 flex flex-col gap-3 z-10 pointer-events-none">
                     <p className="text-primary font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                        VISTA PREVIA
                        <span className="flex size-1.5 bg-primary rounded-full animate-pulse"></span>
                     </p>
                     <h3 className="text-4xl font-black text-white leading-none tracking-tight break-words">{event.name}</h3>
                     <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">{event.category}</p>
                  </div>
               </div>
               
               <div className="p-10 flex flex-col gap-6 bg-slate-900/50 backdrop-blur-xl h-full">
                  <div className="flex flex-col gap-4">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">CATEGORÍA / TAG</label>
                    <input 
                      type="text"
                      className="w-full text-sm font-black bg-slate-800/50 border border-slate-700 text-primary rounded-2xl px-6 py-4 transition-all uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/50"
                      value={event.category}
                      onChange={(e) => handleFieldChange(event.id, 'category', e.target.value)}
                    />
                  </div>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] mt-auto">Sube una foto directamente desde tu dispositivo</p>
               </div>
            </div>
            
            <div className="flex-1 p-8 md:p-14 flex flex-col gap-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-4 md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">NOMBRE DE LA ACTIVIDAD</label>
                  <input 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl text-slate-900 dark:text-white px-8 py-6 font-black text-3xl focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                    value={event.name}
                    onChange={(e) => handleFieldChange(event.id, 'name', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-4 md:col-span-2">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">DESCRIPCIÓN PÚBLICA</label>
                  <textarea 
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-3xl text-slate-700 dark:text-slate-300 px-8 py-6 font-bold text-lg focus:ring-4 focus:ring-primary/5 transition-all resize-none leading-relaxed outline-none"
                    value={event.description}
                    onChange={(e) => handleFieldChange(event.id, 'description', e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">FECHA</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black">calendar_today</span>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-700 dark:text-slate-200 pl-16 pr-8 py-5 font-black text-xl focus:ring-4 focus:ring-primary/5 outline-none"
                      value={event.date}
                      onChange={(e) => handleFieldChange(event.id, 'date', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] font-black uppercase text-slate-400 tracking-[0.2em]">HORARIO</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black">schedule</span>
                    <input 
                      type="time"
                      className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-700 dark:text-slate-200 pl-16 pr-8 py-5 font-black text-xl focus:ring-4 focus:ring-primary/5 outline-none"
                      value={event.time}
                      onChange={(e) => handleFieldChange(event.id, 'time', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 border-t border-slate-50 dark:border-slate-800 pt-12 mt-4">
                <button 
                  onClick={() => handleUpdate(event.id)}
                  disabled={isUpdating === event.id}
                  className="flex-1 bg-[#0f172a] text-white rounded-[32px] py-6 px-10 font-black flex items-center justify-center gap-4 hover:bg-slate-800 transition-all active:scale-95 shadow-2xl shadow-slate-900/20 text-xl tracking-tight"
                >
                  {isUpdating === event.id ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : <span className="material-symbols-outlined text-3xl font-black">auto_fix_high</span>}
                  {isUpdating === event.id ? 'Publicando...' : 'Guardar Experiencia'}
                </button>
                <button 
                  onClick={() => confirmDelete(event.id)}
                  className="px-8 py-6 bg-red-50 text-red-600 rounded-[32px] font-black hover:bg-red-100 transition-all active:scale-95 border border-red-100 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-3xl font-black">delete_sweep</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-[50px] p-12 max-w-md w-full shadow-2xl border border-white/5 flex flex-col items-center text-center gap-10 animate-in zoom-in-95">
             <div className="size-28 rounded-full bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-6xl font-black">delete_forever</span>
             </div>
             <div className="flex flex-col gap-3">
               <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">¿Confirmas la eliminación?</h3>
               <p className="text-slate-500 font-bold text-lg px-4">Esta acción removerá la experiencia de todos los portales de usuarios permanentemente.</p>
             </div>
             <div className="flex flex-col w-full gap-4">
               <button onClick={executeDelete} className="w-full py-5 bg-red-600 text-white rounded-3xl font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-500/20">Sí, eliminar definitivamente</button>
               <button onClick={() => setDeleteId(null)} className="w-full py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-3xl font-black text-lg hover:bg-slate-200 transition-all">Cancelar y volver</button>
             </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[130] bg-slate-950 text-white px-12 py-6 rounded-[40px] shadow-2xl animate-in fade-in slide-in-from-bottom-12 border border-white/10 flex items-center gap-6">
           <div className="size-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
             <span className="material-symbols-outlined font-black text-3xl">task_alt</span>
           </div>
           <p className="font-black text-lg tracking-tight">{toast.message}</p>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
