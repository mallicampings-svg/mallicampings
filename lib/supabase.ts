
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Estas variables se configurarán en el panel de control del proyecto o archivo .env
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Nota: Para conectar realmente a Supabase:
 * 1. Crea un proyecto en supabase.com
 * 2. Ejecuta las migraciones SQL para crear las tablas: profiles, reservations, events, settings.
 * 3. Reemplaza las funciones en services/db.ts con llamadas reales a 'supabase.from()'.
 */
