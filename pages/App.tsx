
import React, { useState, useEffect } from 'react';
import { User, UserRole, AppEvent } from './types';
import Login from './pages/Login';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import NewReservation from './pages/NewReservation';
import Profile from './pages/Profile';
import QRPayment from './pages/QRPayment';
import AdminReservations from './pages/AdminReservations';
import AdminEvents from './pages/AdminEvents';
import ExploreEvents from './pages/ExploreEvents';
import { MOCK_EVENTS } from './constants';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [events, setEvents] = useState<AppEvent[]>(MOCK_EVENTS);

  // Set default view based on role when user changes
  useEffect(() => {
    if (user) {
      if (user.role === UserRole.GUEST) {
        setActiveView('guest-home');
      } else {
        setActiveView('dashboard');
      }
    }
  }, [user]);

  const handleLogin = (u: User) => {
    setUser(u);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    const isAdmin = user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN;
    const homeView = isAdmin ? 'dashboard' : 'guest-home';

    switch (activeView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'admin-reservations':
        return <AdminReservations onBack={() => setActiveView(homeView)} />;
      case 'admin-events':
        return <AdminEvents events={events} setEvents={setEvents} onBack={() => setActiveView(homeView)} />;
      case 'qr-payment':
        return <QRPayment onBack={() => setActiveView(homeView)} />;
      case 'new-reservation':
        return <NewReservation onBack={() => setActiveView(homeView)} />;
      case 'explore-events':
        return (
          <ExploreEvents 
            events={events}
            onBack={() => setActiveView(homeView)} 
            onReserve={(event) => {
              // Navegar a la pantalla de reserva al hacer clic en reservar evento
              setActiveView('new-reservation');
            }}
          />
        );
      case 'profile':
        return <Profile user={user} onBack={() => setActiveView(homeView)} />;
      case 'guest-home':
        return (
          <div className="relative min-h-full flex flex-col items-center overflow-hidden">
             <div className="absolute inset-0 h-64 bg-primary z-0">
               <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
             </div>
             <div className="relative z-10 w-full max-w-5xl p-6 md:p-12 flex flex-col gap-8 mt-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 text-white">
                  <div className="flex flex-col gap-2">
                    <p className="text-blue-100 font-bold uppercase tracking-widest text-sm">Bienvenido de nuevo,</p>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">{user.name}</h1>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <button onClick={() => setActiveView('new-reservation')} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/5 flex flex-col items-center gap-4 group hover:ring-4 hover:ring-primary/20 transition-all text-center">
                      <div className="size-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-4xl">calendar_add_on</span>
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-slate-900 dark:text-white">Nueva Reserva</h3>
                        <p className="text-slate-500 text-sm mt-1">Asegura tu lugar de forma rápida y sencilla.</p>
                      </div>
                   </button>

                   <button onClick={() => setActiveView('explore-events')} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/5 flex flex-col items-center gap-4 group hover:ring-4 hover:ring-primary/20 transition-all text-center">
                      <div className="size-16 rounded-2xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-4xl">celebration</span>
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-slate-900 dark:text-white">Actividades</h3>
                        <p className="text-slate-500 text-sm mt-1">Explora los eventos y servicios disponibles.</p>
                      </div>
                   </button>

                   <button onClick={() => setActiveView('profile')} className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-black/5 flex flex-col items-center gap-4 group hover:ring-4 hover:ring-primary/20 transition-all text-center">
                      <div className="size-16 rounded-2xl bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-4xl">person</span>
                      </div>
                      <div>
                        <h3 className="font-black text-lg text-slate-900 dark:text-white">Mi Cuenta</h3>
                        <p className="text-slate-500 text-sm mt-1">Gestiona tu perfil e historial de visitas.</p>
                      </div>
                   </button>
                </div>

                {/* Sección Asistencia en Línea - RECREADA CON BOTONES DE LLAMADA FUNCIONALES */}
                <div className="bg-[#0b1325] rounded-[40px] p-8 md:p-14 text-white relative overflow-hidden group shadow-2xl border border-white/5">
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64 transition-transform group-hover:scale-110 duration-1000"></div>
                   
                   <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                      <div className="flex flex-col gap-4 max-w-2xl text-center lg:text-left">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">Asistencia en Línea</h2>
                        <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed">
                          Nuestro equipo está disponible para asistirte con cualquier requerimiento especial de forma inmediata.
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-4 shrink-0 w-full lg:w-auto">
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
                          <a 
                            href="tel:3835402310" 
                            className="px-10 py-5 bg-white text-[#0b1325] font-black rounded-[20px] hover:bg-slate-100 transition-all text-center shadow-2xl flex items-center justify-center gap-3 text-lg md:text-xl active:scale-95 whitespace-nowrap"
                          >
                            <span className="material-symbols-outlined font-black text-2xl text-primary">call</span>
                            3835 402310
                          </a>
                          <a 
                            href="tel:3835531223" 
                            className="px-10 py-5 bg-slate-800/80 backdrop-blur text-white font-black rounded-[20px] hover:bg-slate-700 transition-all text-center border border-white/10 flex items-center justify-center gap-3 text-lg md:text-xl active:scale-95 whitespace-nowrap"
                          >
                            <span className="material-symbols-outlined font-black text-2xl text-primary">phone_enabled</span>
                            3835 531223
                          </a>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
      case 'admin-users':
        return (
          <div className="p-8 max-w-7xl mx-auto flex flex-col gap-6">
            <header className="flex items-center gap-4">
               <button onClick={() => setActiveView(homeView)} className="p-2 hover:bg-slate-100 rounded-full"><span className="material-symbols-outlined">arrow_back</span></button>
               <h1 className="text-3xl font-black">Gestión de Usuarios</h1>
            </header>
            <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl text-center border border-dashed border-slate-300">
               <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">construction</span>
               <p className="text-slate-500 font-bold">Módulo de base de datos en mantenimiento.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Próximamente</h1>
              <p className="text-slate-500">La vista "{activeView}" está bajo desarrollo.</p>
              <button onClick={() => setActiveView(homeView)} className="mt-4 text-primary font-bold">Volver al inicio</button>
            </div>
          </div>
        );
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
