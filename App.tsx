
import React, { useState, useEffect } from 'react';
import { User, UserRole, AppEvent, Reservation } from './types';
import Login from './pages/Login';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import NewReservation from './pages/NewReservation';
import MyReservations from './pages/MyReservations';
import Profile from './pages/Profile';
import QRPayment from './pages/QRPayment';
import AdminReservations from './pages/AdminReservations';
import AdminEvents from './pages/AdminEvents';
import ExploreEvents from './pages/ExploreEvents';
import SystemSettings from './pages/SystemSettings';
import { INITIAL_PRICES, getInitialEvents, getInitialReservations } from './constants';
import { db } from './services/db';
import { auth } from './services/auth';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [prices, setPrices] = useState(INITIAL_PRICES);

  const [systemStatus, setSystemStatus] = useState({
    isAppEnabled: true,
    isMonthlyActive: true,
    monthlyExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
    isAnnualActive: false,
    annualExpiry: null as number | null
  });

  const [brandSettings, setBrandSettings] = useState({
    heroImage: 'https://images.unsplash.com/photo-1544910919-a403f59a49c2?q=80&w=2000&auto=format&fit=crop',
    slogan: 'CAMPING CLUB MALLI',
    subSlogan: 'El complejo familiar ideal para crear recuerdos inolvidables.'
  });

  // GESTIÓN DE AUTENTICACIÓN
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(auth.mapSupabaseUser(session.user));
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(auth.mapSupabaseUser(session.user));
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // CARGA DE DATOS OPERATIVOS
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoadingData(true);
        // Intentamos cargar de DB, si falla usamos mocks
        const [fetchedEvents, fetchedReservations, fetchedBrand] = await Promise.all([
          db.events.getAll(),
          db.reservations.getAll(),
          db.settings.getBrand()
        ]).catch(() => [getInitialEvents(), getInitialReservations(), brandSettings]);
        
        setEvents(fetchedEvents || getInitialEvents());
        setReservations(fetchedReservations || getInitialReservations());
        if (fetchedBrand) setBrandSettings(fetchedBrand);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchInitialData();
  }, []);

  // Redirección inicial por rol
  useEffect(() => {
    if (user) {
      if (user.role === UserRole.SUPER_ADMIN) {
        setActiveView('system-settings');
      } else if (user.role === UserRole.GUEST) {
        setActiveView('guest-home');
      } else {
        setActiveView('dashboard');
      }
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setUser(null);
    }
  };

  const handleUpdateUser = (updatedData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedData });
    }
  };

  if (!user) {
    return <Login onLogin={setUser} isAppEnabled={systemStatus.isAppEnabled} brandSettings={brandSettings} />;
  }

  if (isLoadingData) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-slate-950">
        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
        <p className="font-impact text-slate-400 uppercase tracking-widest animate-pulse text-sm">Sincronizando portal...</p>
      </div>
    );
  }

  const renderContent = () => {
    const homeView = user.role === UserRole.GUEST ? 'guest-home' : user.role === UserRole.SUPER_ADMIN ? 'system-settings' : 'dashboard';

    switch (activeView) {
      case 'dashboard':
        return <AdminDashboard systemStatus={systemStatus} brandSettings={brandSettings} setBrandSettings={setBrandSettings} prices={prices} setGlobalPrices={setPrices} />;
      case 'system-settings':
        return <SystemSettings systemStatus={systemStatus} setSystemStatus={setSystemStatus} />;
      case 'admin-reservations':
        return <AdminReservations reservations={reservations} setReservations={setReservations} onBack={() => setActiveView(homeView)} onVerifyQR={() => setActiveView('qr-payment')} />;
      case 'admin-events':
        return <AdminEvents events={events} setEvents={setEvents} onBack={() => setActiveView(homeView)} />;
      case 'qr-payment':
        return <QRPayment reservations={reservations} setReservations={setReservations} onBack={() => setActiveView('admin-reservations')} prices={prices} />;
      case 'my-reservations':
        return <MyReservations reservations={reservations} user={user} onBack={() => setActiveView(homeView)} onNewReservation={() => setActiveView('new-reservation')} prices={prices} />;
      case 'new-reservation':
        return <NewReservation user={user} prices={prices} onBack={() => setActiveView('my-reservations')} onSuccess={(newRes) => { setReservations([newRes, ...reservations]); setActiveView('my-reservations'); }} />;
      case 'explore-events':
        return <ExploreEvents user={user} prices={prices} events={events} onBack={() => setActiveView(homeView)} onReserve={(newRes) => { setReservations([newRes, ...reservations]); setActiveView('my-reservations'); }} />;
      case 'profile':
        return <Profile user={user} onBack={() => setActiveView(homeView)} onUpdateUser={handleUpdateUser} />;
      case 'guest-home':
        return (
          <div className="relative min-h-full flex flex-col items-center overflow-hidden animate-in fade-in duration-700">
             <div className="absolute inset-0 h-80 bg-primary z-0">
               <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent"></div>
             </div>
             <div className="relative z-10 w-full max-w-5xl p-6 md:p-12 flex flex-col gap-10 mt-16 sm:mt-20">
                <div className="flex flex-col gap-4 text-white">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-white/60">Bienvenido al club</p>
                    <h1 className="text-5xl md:text-7xl font-impact tracking-tight leading-none drop-shadow-xl">{user.name.split(' ')[0]}</h1>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                   <button onClick={() => setActiveView('my-reservations')} className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[40px] sm:rounded-[50px] shadow-2xl flex flex-col items-center gap-6 group hover:ring-8 hover:ring-primary/10 transition-all text-center active:scale-95">
                      <div className="size-16 sm:size-20 rounded-3xl bg-blue-50 dark:bg-blue-900/20 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-4xl font-black">confirmation_number</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-impact text-xl sm:text-2xl text-slate-900 dark:text-white uppercase">Mis Reservas</h3>
                        <p className="text-slate-500 text-xs font-medium">Códigos QR y accesos.</p>
                      </div>
                   </button>
                   
                   <button onClick={() => setActiveView('explore-events')} className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[40px] sm:rounded-[50px] shadow-2xl flex flex-col items-center gap-6 group hover:ring-8 hover:ring-primary/10 transition-all text-center active:scale-95">
                      <div className="size-16 sm:size-20 rounded-3xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-4xl font-black">celebration</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-impact text-xl sm:text-2xl text-slate-900 dark:text-white uppercase">Eventos VIP</h3>
                        <p className="text-slate-500 text-xs font-medium">Actividades exclusivas.</p>
                      </div>
                   </button>

                   <button onClick={() => setActiveView('profile')} className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[40px] sm:rounded-[50px] shadow-2xl flex flex-col items-center gap-6 group hover:ring-8 hover:ring-primary/10 transition-all text-center active:scale-95">
                      <div className="size-16 sm:size-20 rounded-3xl bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-4xl font-black">manage_accounts</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-impact text-xl sm:text-2xl text-slate-900 dark:text-white uppercase">Mi Cuenta</h3>
                        <p className="text-slate-500 text-xs font-medium">Gestiona tus datos.</p>
                      </div>
                   </button>
                </div>

                <div className="bg-[#0b1325] rounded-[50px] sm:rounded-[60px] p-10 sm:p-16 text-white relative overflow-hidden group shadow-2xl border border-white/5">
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-80 -mt-80"></div>
                   <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-12">
                      <div className="flex flex-col gap-4 sm:gap-6 max-w-xl text-center lg:text-left">
                        <h2 className="text-3xl sm:text-5xl font-impact leading-none uppercase tracking-tighter">Asistencia Directa</h2>
                        <p className="text-slate-400 text-base sm:text-lg font-medium leading-relaxed">Nuestro equipo técnico está listo para ayudarte en tiempo real con cualquier consulta sobre el complejo.</p>
                      </div>
                      <div className="flex flex-col gap-4 w-full lg:w-auto">
                        <a href="tel:3835402310" className="px-10 py-5 bg-white text-[#0b1325] font-impact rounded-3xl hover:bg-slate-100 transition-all flex items-center justify-center gap-4 text-xl sm:text-2xl shadow-xl active:scale-95"><span className="material-symbols-outlined text-primary font-black">call</span>3835 402310</a>
                        <a href="tel:3835531223" className="px-10 py-5 bg-slate-800/80 backdrop-blur text-white font-impact rounded-3xl hover:bg-slate-700 transition-all border border-white/10 flex items-center justify-center gap-4 text-xl sm:text-2xl active:scale-95"><span className="material-symbols-outlined text-primary font-black">support_agent</span>3835 531223</a>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        );
      default:
        return <div className="p-12 text-center font-black uppercase tracking-widest text-slate-400">Módulo en construcción.</div>;
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </Layout>
  );
};

export default App;
