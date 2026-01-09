
import { supabase } from '../lib/supabase';
import { User, UserRole } from '../types';

export const auth = {
  /**
   * Inicia el flujo de autenticación con Google.
   * Nota: Requiere configurar el proveedor Google en el dashboard de Supabase
   * y añadir la URL del sitio en 'Redirect URLs'.
   */
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Redirigir de vuelta a la URL actual
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Cierra la sesión actual en Supabase.
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Mapea un usuario de Supabase Auth a nuestro tipo User de la aplicación.
   */
  mapSupabaseUser(sbUser: any): User {
    return {
      id: sbUser.id,
      name: sbUser.user_metadata?.full_name || 'Usuario',
      email: sbUser.email || '',
      avatar: sbUser.user_metadata?.avatar_url || '',
      role: UserRole.GUEST, // Por defecto entran como GUEST (Socio)
      idSocio: `SOC-${sbUser.id.substring(0, 5).toUpperCase()}`,
      phone: sbUser.user_metadata?.phone || ''
    };
  }
};
