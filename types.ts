
export enum UserRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  GUEST = 'GUEST'
}

export interface User {
  id: string; // UUID en DB
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  idSocio?: string;
  phone?: string;
  created_at?: string;
}

export interface Reservation {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAvatar: string;
  date: string;
  time: string;
  resource: string;
  status: 'Activa' | 'Pagada' | 'Pendiente';
  adults: number;
  children: number;
  created_at?: string;
}

export interface AppEvent {
  id: string;
  name: string;
  category: string;
  date: string;
  time: string;
  capacity: string;
  location: string;
  image: string;
  progress: number;
  description?: string;
  dressCode?: string;
  duration?: string;
  priceAdult?: number;
  priceChild?: number;
  created_at?: string;
}

export interface BrandSettings {
  heroImage: string;
  slogan: string;
  subSlogan: string;
}

export interface SystemStatus {
  isAppEnabled: boolean;
  isMonthlyActive: boolean;
  monthlyExpiry: number | null;
  isAnnualActive: boolean;
  annualExpiry: number | null;
}
