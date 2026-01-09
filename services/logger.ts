
/**
 * Servicio de Logger preparado para entornos de producción (Vercel/Sentry).
 */
export const logger = {
  info: (message: string, data?: any) => {
    // Fix: Cast import.meta to any to avoid TypeScript error when accessing environment flags
    if ((import.meta as any).env?.DEV) {
      console.log(`[INFO] ${message}`, data || '');
    }
    // Futuro: Enviar a Vercel Log Drain o Sentry
  },
  
  error: (message: string, error: any) => {
    console.error(`[ERROR] ${message}`, error);
    
    // Futuro: Integración con Sentry.captureException(error)
    // Fix: Cast import.meta to any to avoid TypeScript error when accessing environment flags
    if ((import.meta as any).env?.PROD) {
      // Aquí podrías enviar el error a un endpoint de telemetría de Vercel
    }
  },

  trackEvent: (eventName: string, properties?: Record<string, any>) => {
    // Futuro: Integración con Vercel Analytics (va.track(eventName, properties))
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va.track(eventName, properties);
    }
  }
};
