
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { auth } from '../services/auth';
import { MOCK_SUPER_ADMIN, MOCK_ADMIN_1, MOCK_ADMIN_2 } from '../constants';

interface LoginProps {
  onLogin: (user: User) => void;
  isAppEnabled: boolean;
  brandSettings: {
    heroImage: string;
    slogan: string;
    subSlogan: string;
  };
}

const Login: React.FC<LoginProps> = ({ onLogin, isAppEnabled, brandSettings }) => {
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleUserLogin = async () => {
    if (!isAppEnabled) {
      alert("Sistema en mantenimiento");
      return;
    }
    
    try {
      setIsRedirecting(true);
      await auth.signInWithGoogle();
    } catch (err) {
      console.error("Error en Google Auth:", err);
      setIsRedirecting(false);
      alert("Error al conectar con Google.");
    }
  };

  const handleAdminClick = () => {
    setShowPinModal(true);
    setPin('');
    setError(false);
  };

  const validatePin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin === '326426') {
      onLogin(MOCK_SUPER_ADMIN);
    } else if (pin === '000001' || pin === '000002') {
      if (!isAppEnabled) {
        triggerError("Sistema temporalmente fuera de línea.");
        return;
      }
      onLogin(pin === '000001' ? MOCK_ADMIN_1 : MOCK_ADMIN_2);
    } else {
      triggerError("PIN incorrecto.");
    }
  };

  const triggerError = (msg: string) => {
    setError(true);
    setErrorMessage(msg);
    setPin('');
    setTimeout(() => setError(false), 1000);
  };

  useEffect(() => {
    if (pin.length === 6) validatePin();
  }, [pin]);

  return (
    <div className="flex flex-col h-screen w-full bg-white font-display overflow-hidden">
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Lado Hero - Solo visible en Desktop */}
        <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" 
               style={{ backgroundImage: `url(${brandSettings.heroImage})` }} />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-900/10 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 z-20 p-20 text-white w-full">
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#d1dbdb]/80 backdrop-blur-md border border-white/20 mb-12 shadow-xl">
              <span className="material-symbols-outlined text-[18px] font-black filled text-yellow-400">stars</span>
              <span className="text-[12px] font-black uppercase tracking-[0.5em] text-white">
                CAMPING CLUB MALLI
              </span>
            </div>

            <h1 className="font-impact text-[100px] xl:text-[120px] mb-10 leading-[0.85] drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              CAMPING CLUB <br/> <span className="text-primary">MALLI</span>
            </h1>
            <p className="text-3xl text-slate-100 leading-relaxed font-bold max-w-3xl opacity-95 drop-shadow-xl">
              {brandSettings.subSlogan}
            </p>
          </div>
        </div>

        {/* Lado Form - Mobile Friendly */}
        <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-10 lg:p-24 relative bg-slate-50 dark:bg-slate-950 overflow-y-auto">
          <div className="w-full max-w-lg flex flex-col gap-12 sm:gap-20">
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="flex items-center gap-4">
                 <div className="h-1.5 w-10 sm:w-12 bg-primary rounded-full"></div>
                 <p className="text-primary font-black text-[10px] sm:text-xs tracking-[0.5em] uppercase leading-none">Management Portal</p>
              </div>
              <h2 className="font-impact text-5xl sm:text-6xl lg:text-7xl text-slate-950 dark:text-white leading-[0.9] tracking-tighter uppercase">
                INGRESAR AL <br/> <span className="text-primary">SISTEMA</span>
              </h2>
            </div>

            <div className="flex flex-col gap-6 sm:gap-10">
              <button 
                onClick={handleUserLogin}
                disabled={isRedirecting}
                className="w-full h-20 sm:h-24 flex items-center justify-center gap-4 sm:gap-6 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-[30px] sm:rounded-[40px] hover:border-primary hover:shadow-2xl hover:shadow-primary/10 transition-all shadow-xl shadow-black/5 group active:scale-95 disabled:opacity-50"
              >
                <div className="size-10 sm:size-12 bg-white rounded-full flex items-center justify-center shadow-md shrink-0">
                   {isRedirecting ? (
                     <div className="size-5 sm:size-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                   ) : (
                     <svg className="w-5 h-5 sm:w-7 sm:h-7" viewBox="0 0 24 24">
                       <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                       <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                       <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                       <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                     </svg>
                   )}
                </div>
                <span className="font-impact text-slate-900 dark:text-white text-2xl sm:text-3xl tracking-tight uppercase">
                  {isRedirecting ? 'Conectando...' : 'Acceder con Google'}
                </span>
              </button>

              <div className="flex items-center gap-4 sm:gap-8 py-2 sm:py-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-slate-300 dark:to-slate-700"></div>
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-slate-400 tracking-[0.4em] whitespace-nowrap">Zona Restringida</span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-slate-300 dark:to-slate-700"></div>
              </div>

              <button 
                onClick={handleAdminClick}
                className="w-full h-24 sm:h-32 flex items-center justify-between p-6 sm:p-10 bg-[#0f172a] text-white rounded-[35px] sm:rounded-[50px] hover:bg-slate-900 transition-all group shadow-3xl shadow-slate-950/40 active:scale-95 border border-white/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-full blur-2xl -mr-12 -mt-12 sm:-mr-16 sm:-mt-16 group-hover:bg-primary/20 transition-all"></div>
                <div className="flex items-center gap-4 sm:gap-8 relative z-10">
                  <div className="size-12 sm:size-16 rounded-[18px] sm:rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/30 group-hover:border-primary/50 transition-all">
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-white transition-colors text-3xl sm:text-5xl font-black">shield_person</span>
                  </div>
                  <div className="text-left">
                    <p className="text-xl sm:text-3xl font-impact tracking-tight leading-none mb-1 sm:mb-2 uppercase">Administración</p>
                    <p className="text-[8px] sm:text-[10px] text-primary font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">Validación por PIN maestro</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-500 group-hover:text-white transition-all group-hover:translate-x-2 sm:group-hover:translate-x-3 text-2xl sm:text-4xl">arrow_forward</span>
              </button>
            </div>
            
            <p className="text-center text-[11px] sm:text-[13px] text-slate-400 font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] leading-relaxed max-w-sm mx-auto">
              Secure Cloud <br/> Access Terminal
            </p>
          </div>
        </div>
      </div>

      {showPinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#0a0f1d]/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className={`w-full max-w-[440px] bg-white rounded-[50px] sm:rounded-[70px] p-8 sm:p-12 flex flex-col items-center shadow-2xl relative transition-transform ${error ? 'animate-shake' : 'animate-in zoom-in-95'}`}>
            <button 
              onClick={() => setShowPinModal(false)} 
              className="absolute top-6 right-6 sm:top-10 sm:right-10 size-10 sm:size-11 flex items-center justify-center bg-[#f1f4f9] rounded-full text-slate-500 hover:text-slate-900 transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl font-bold">close</span>
            </button>
            <h3 className="font-impact text-3xl sm:text-4xl text-slate-950 mb-6 sm:mb-10 mt-4 sm:mt-6 tracking-tight uppercase">VALIDAR PIN</h3>
            <p className="text-[10px] sm:text-[12px] text-slate-500 text-center font-black uppercase tracking-[0.2em] mb-8 sm:mb-12 leading-relaxed max-w-[260px]">
              INGRESA TU LLAVE DE SEGURIDAD DE 6 DÍGITOS.
            </p>
            <form onSubmit={validatePin} className="w-full flex flex-col items-center gap-8 sm:gap-12">
              <div className="w-full">
                <input 
                  autoFocus
                  type="password"
                  maxLength={6}
                  inputMode="numeric"
                  className={`w-full h-20 sm:h-24 text-center text-4xl sm:text-5xl tracking-[1.2em] sm:tracking-[1.4em] font-black bg-[#e9edf3] border-none rounded-[30px] sm:rounded-[35px] px-4 focus:ring-0 placeholder:text-slate-300 transition-all ${error ? 'text-red-500 shadow-inner' : 'text-slate-900'}`}
                  placeholder="••••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                />
              </div>
              <button 
                type="submit" 
                className="w-full h-18 sm:h-24 bg-primary text-white font-impact rounded-[25px] sm:rounded-[35px] shadow-xl hover:bg-blue-600 transition-all active:scale-[0.97] text-lg sm:text-xl tracking-tight uppercase"
              >
                INGRESAR AL PANEL
              </button>
              {error && <p className="text-[10px] sm:text-[11px] text-red-500 font-black uppercase tracking-widest -mt-4 sm:-mt-6 animate-bounce">{errorMessage}</p>}
            </form>
          </div>
        </div>
      )}

      <style>{`
        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Login;
