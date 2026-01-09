
import React, { ReactNode, useState, useEffect } from 'react';
import { UserRole, User } from '../types';
import { formatAppTime, formatAppDate } from '../constants';

interface LayoutProps {
  children: ReactNode;
  user: User | null;
  onLogout: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

const LiveClock: React.FC<{ className?: string }> = ({ className }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] leading-none mb-1">Sistema en Vivo</span>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-black tracking-tight dark:text-white">{formatAppTime(time)}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase">{formatAppDate(time)}</span>
      </div>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, activeView, setActiveView }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return <>{children}</>;

  const isAdmin = user.role === UserRole.ADMIN;
  const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;

  const superAdminMenu = [
    { id: 'system-settings', label: 'Ajustes del Sistema', icon: 'settings_suggest' },
  ];

  const adminMenu = [
    { id: 'dashboard', label: 'Panel de Control', icon: 'dashboard' },
    { id: 'admin-reservations', label: 'Gestión Reservas', icon: 'calendar_month' },
    { id: 'admin-events', label: 'Gestión Eventos', icon: 'celebration' },
    { id: 'qr-payment', label: 'Validar Pagos QR', icon: 'qr_code_scanner' },
  ];

  const guestMenu = [
    { id: 'guest-home', label: 'Inicio', icon: 'home' },
    { id: 'my-reservations', label: 'Mis Reservas', icon: 'confirmation_number' },
    { id: 'explore-events', label: 'Próximos Eventos', icon: 'explore' },
    { id: 'profile', label: 'Mi Cuenta', icon: 'person' },
  ];

  const currentMenu = isSuperAdmin ? superAdminMenu : isAdmin ? adminMenu : guestMenu;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const NavItem: React.FC<{ item: any, onClick?: () => void }> = ({ item, onClick }) => (
    <button
      onClick={() => {
        setActiveView(item.id);
        if (onClick) onClick();
      }}
      className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all w-full text-left group active:scale-[0.97] ${
        activeView === item.id 
        ? 'bg-primary text-white shadow-lg shadow-primary/20 font-black' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold'
      }`}
    >
      <span className={`material-symbols-outlined text-2xl ${activeView === item.id ? 'filled' : ''}`}>{item.icon}</span>
      <p className="text-base tracking-tight">{item.label}</p>
    </button>
  );

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark">
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 md:hidden transition-opacity"
          onClick={toggleMobileMenu}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col p-6 shadow-2xl ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex gap-3 items-center">
            <div className="size-10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl font-black">token</span>
            </div>
            <h1 className="text-slate-900 dark:text-white text-lg font-impact tracking-tight uppercase">
              CLUB MALLI
            </h1>
          </div>
          <button onClick={toggleMobileMenu} className="size-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full active:scale-90 transition-all">
            <span className="material-symbols-outlined font-black">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2">
          {currentMenu.map((item) => (
            <NavItem key={item.id} item={item} onClick={() => setIsMobileMenuOpen(false)} />
          ))}
        </div>

        <div className="flex flex-col gap-6 pt-6 border-t border-slate-100 dark:border-slate-800 mt-4">
          <LiveClock />
          <button
            onClick={onLogout}
            className="flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-black uppercase text-xs tracking-[0.2em] border border-red-50 dark:border-red-900/20"
          >
            <span className="material-symbols-outlined text-2xl">logout</span>
            <p>Cerrar Sesión</p>
          </button>
        </div>
      </aside>

      <aside className="hidden w-72 md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
        <div className="flex h-full flex-col justify-between p-6">
          <div className="flex flex-col gap-6">
            <div className="flex gap-3 items-center px-2 py-2">
              <div className="size-12 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl font-black">token</span>
              </div>
              <h1 className="text-slate-900 dark:text-white text-lg font-impact tracking-tight leading-tight uppercase">
                CAMPING CLUB <br/> MALLI
              </h1>
            </div>

            <div className="flex gap-4 items-center px-4 py-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
               <div className="flex items-center justify-center text-slate-400">
                 <span className="material-symbols-outlined text-5xl">account_circle</span>
               </div>
               <div className="flex flex-col overflow-hidden">
                 <p className="text-base font-black text-slate-900 dark:text-white truncate leading-tight">{user.name}</p>
                 <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">
                   {isSuperAdmin ? 'SUPER ADMIN' : isAdmin ? 'STAFF CLUB' : 'SOCIO VIP'}
                 </p>
               </div>
            </div>

            <nav className="flex flex-col gap-1 mt-4">
              {currentMenu.map((item) => (
                <NavItem key={item.id} item={item} />
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-6 px-2">
            <LiveClock />
            <button
              onClick={onLogout}
              className="flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-black uppercase text-[10px] tracking-widest border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col h-full overflow-hidden relative">
        <header className="flex md:hidden items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg px-6 py-4 z-30 shrink-0 sticky top-0">
          <div className="flex items-center gap-4">
             <button onClick={toggleMobileMenu} className="size-12 -ml-2 flex items-center justify-center text-slate-900 dark:text-white active:scale-90 transition-transform">
                <span className="material-symbols-outlined text-3xl font-black">menu</span>
             </button>
             <h2 className="text-xl font-impact text-slate-900 dark:text-white tracking-tight uppercase">MALLI</h2>
          </div>
          <div className="flex items-center gap-4">
             <div 
               onClick={() => setActiveView('profile')}
               className="flex items-center justify-center text-slate-400 cursor-pointer active:scale-95 transition-transform"
             >
               <span className="material-symbols-outlined text-4xl">account_circle</span>
             </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark pb-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
