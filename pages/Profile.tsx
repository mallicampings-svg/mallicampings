
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileProps { 
  user: User; 
  onBack?: () => void;
  onUpdateUser: (updatedData: Partial<User>) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    firstName: user.name.split(' ')[0] || '',
    lastName: user.name.split(' ').slice(1).join(' ') || '',
    phone: user.phone || '',
    email: user.email || ''
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    setTimeout(() => {
      onUpdateUser({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone
      });
      setIsSaving(false);
      if (onBack) onBack();
    }, 1200);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white dark:bg-background-dark overflow-y-auto">
      {/* Columna Decorativa - Solo Desktop */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-slate-900 shrink-0">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        <div className="w-full h-full bg-center bg-cover scale-105" 
             style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop")' }} />
        <div className="absolute bottom-0 left-0 z-20 p-16 text-white max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            <span className="material-symbols-outlined text-lg filled">stars</span>MI PERFIL SOCIO
          </div>
          <h1 className="text-5xl font-impact mb-6 leading-none tracking-tight uppercase">Control de <br/> Cuenta VIP.</h1>
          <p className="text-slate-300 font-medium text-lg leading-relaxed">Actualiza tus datos para optimizar tu experiencia en el club y recibir invitaciones exclusivas.</p>
        </div>
      </div>

      {/* Contenido del Formulario */}
      <div className="flex-1 p-6 sm:p-10 md:p-16 flex flex-col items-center">
        <div className="w-full max-w-xl flex flex-col gap-10">
           <header className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-8">
              {onBack && (
                <button 
                  onClick={onBack}
                  className="size-12 sm:size-14 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 active:scale-90 transition-all border border-slate-100 dark:border-slate-800"
                >
                  <span className="material-symbols-outlined text-2xl font-black">arrow_back</span>
                </button>
              )}
              <div className="flex flex-col">
                <h2 className="text-3xl font-impact text-slate-900 dark:text-white uppercase tracking-tight leading-none">Mi Cuenta</h2>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Configuración del sistema</p>
              </div>
           </header>

           {/* Avatar Compacto */}
           <div className="flex items-center gap-6 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-[35px] border border-slate-100 dark:border-slate-800">
              <div className="relative shrink-0">
                <div className="size-20 sm:size-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                   <span className="material-symbols-outlined text-6xl sm:text-7xl">account_circle</span>
                </div>
                <button className="absolute bottom-0 right-0 size-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-900">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-impact text-slate-950 dark:text-white leading-none uppercase tracking-tighter">{user.name}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Socio desde Enero 2025</p>
              </div>
           </div>

           <form className="flex flex-col gap-8" onSubmit={handleSave}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">NOMBRE</label>
                  <input 
                    className="w-full h-14 sm:h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none px-6 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div className="flex flex-col gap-2.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">APELLIDOS</label>
                  <input 
                    className="w-full h-14 sm:h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none px-6 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">CORREO ELECTRÓNICO</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">mail</span>
                  <input 
                    className="w-full h-14 sm:h-16 rounded-2xl bg-slate-100 dark:bg-slate-950 border-none pl-14 pr-6 font-bold text-slate-400 cursor-not-allowed"
                    value={formData.email}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">TELÉFONO MÓVIL</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary font-black">call</span>
                  <input 
                    type="tel"
                    className="w-full h-14 sm:h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none pl-14 pr-6 font-bold text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full h-16 sm:h-20 bg-primary text-white rounded-[25px] sm:rounded-[30px] font-impact text-lg sm:text-xl uppercase tracking-widest shadow-2xl shadow-primary/30 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
                >
                  {isSaving ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : <><span className="material-symbols-outlined text-2xl font-black">save</span> GUARDAR CAMBIOS</>}
                </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
