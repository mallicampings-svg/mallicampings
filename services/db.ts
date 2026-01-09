
import { Reservation, AppEvent, User, BrandSettings, SystemStatus } from '../types';
import { getInitialEvents, getInitialReservations, INITIAL_PRICES } from '../constants';

// Simulación de latencia de red
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const db = {
  // --- RESERVACIONES ---
  reservations: {
    async getAll(): Promise<Reservation[]> {
      await delay(800);
      // Futuro: return (await supabase.from('reservations').select('*')).data;
      return getInitialReservations();
    },
    async create(reservation: Reservation): Promise<Reservation> {
      await delay(1000);
      // Futuro: return (await supabase.from('reservations').insert(reservation).select().single()).data;
      return reservation;
    },
    async updateStatus(id: string, status: string): Promise<void> {
      await delay(500);
      // Futuro: await supabase.from('reservations').update({ status }).eq('id', id);
    }
  },

  // --- EVENTOS ---
  events: {
    async getAll(): Promise<AppEvent[]> {
      await delay(800);
      // Futuro: return (await supabase.from('events').select('*')).data;
      return getInitialEvents();
    },
    async update(id: string, updates: Partial<AppEvent>): Promise<void> {
      await delay(500);
      // Futuro: await supabase.from('events').update(updates).eq('id', id);
    }
  },

  // --- CONFIGURACIÓN Y SISTEMA ---
  settings: {
    async getBrand(): Promise<BrandSettings> {
      await delay(500);
      return {
        heroImage: 'https://images.unsplash.com/photo-1544910919-a403f59a49c2?q=80&w=2000&auto=format&fit=crop',
        slogan: 'CAMPING CLUB MALLI',
        subSlogan: 'El complejo familiar ideal para crear recuerdos inolvidables.'
      };
    },
    async getPrices() {
      await delay(500);
      return INITIAL_PRICES;
    }
  }
};
