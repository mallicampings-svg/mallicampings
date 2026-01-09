
import { Reservation, AppEvent, User, UserRole } from './types';

export const COLORS = {
  primary: '#137fec',
  bgLight: '#f6f7f8',
  bgDark: '#101922',
};

export const INITIAL_PRICES = {
  mesa: 1500,
  asador: 2500,
  adulto: 800,
  nino: 1000,
};

export const formatAppDate = (date: Date) => {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatAppTime = (date: Date) => {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

export const MOCK_SUPER_ADMIN: User = {
  id: 'sa-1',
  name: 'DAMIAN',
  email: 'super@gestion.com',
  role: UserRole.SUPER_ADMIN,
  avatar: '',
};

export const MOCK_ADMIN_1: User = {
  id: 'adm-1',
  name: 'PEREA',
  email: 'perea@gestion.com',
  role: UserRole.ADMIN,
  avatar: '',
};

export const MOCK_ADMIN_2: User = {
  id: 'adm-2',
  name: 'MARIA',
  email: 'maria@gestion.com',
  role: UserRole.ADMIN,
  avatar: '',
};

export const MOCK_GUEST: User = {
  id: 'gst-1',
  name: 'Juan Quiroga',
  email: 'juan@gmail.com',
  role: UserRole.GUEST,
  avatar: '',
  idSocio: 'SOC-2025-001',
  phone: '+54 9 11 1234-5678'
};

export const getInitialReservations = (): Reservation[] => {
  const now = new Date();
  return [
    {
      id: 'RES-001',
      clientName: 'Juan Quiroga',
      clientEmail: 'juan@gmail.com',
      clientPhone: '+54 9 11 1234-5678',
      clientAvatar: '',
      date: formatAppDate(now),
      time: formatAppTime(now),
      resource: 'Mesa 4',
      status: 'Pagada',
      adults: 2,
      children: 1
    }
  ];
};

// Fix: Change Event[] to AppEvent[] to match the exported member in types.ts
export const getInitialEvents = (): AppEvent[] => {
  const now = new Date();
  return [
    {
      id: 'EVT-001',
      name: 'Fiesta de Pileta VIP',
      category: 'Exclusivo',
      date: formatAppDate(now),
      time: '14:00',
      capacity: '50 personas',
      location: 'Piscina Principal',
      image: 'https://images.unsplash.com/photo-1544910919-a403f59a49c2?q=80&w=2000&auto=format&fit=crop',
      progress: 60,
      description: 'Evento exclusivo con DJ en vivo y barra de tragos libre para socios del club.',
      duration: '5 horas',
      dressCode: 'Traje de Baño / Ropa Playera'
    }
  ];
};
