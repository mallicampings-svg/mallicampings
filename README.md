# 🏕️ CAMPING CLUB MALLI - Sistema de Gestión Inteligente

![Versión](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3EC98E?logo=supabase)
![Vercel](https://img.shields.io/badge/Deployment-Vercel-000000?logo=vercel)

Una solución integral de gestión para complejos recreativos, diseñada con un enfoque **Mobile-First** y una estética de alta gama. Este sistema permite administrar reservas, eventos exclusivos y validación de ingresos mediante códigos QR.

---

## 🚀 Características Principales

### 👤 Portal del Socio (Guest)
- **Registro con Google**: Acceso rápido y seguro.
- **Reservas Instantáneas**: Selección de mesas, asadores y cantidad de invitados con cálculo de tarifa en tiempo real.
- **Wallet de Reservas**: Visualización de tickets tipo "boarding pass" con códigos QR dinámicos para el ingreso.
- **Exploración de Eventos**: Inscripción a actividades VIP del club.

### 🛠️ Portal del Staff (Admin)
- **Dashboard Operativo**: Métricas de ingresos y ocupación del día.
- **Validación QR**: Escáner integrado para procesar pagos y entradas en la puerta del complejo.
- **Gestor de Eventos**: Editor visual para crear y modificar experiencias.
- **Control de Tarifas**: Ajuste dinámico de precios de servicios.

### ⚡ Portal Maestro (SuperAdmin)
- **Kill-Switch**: Habilitación/Deshabilitación global de la plataforma.
- **Gestión de Licencias**: Control de suscripciones mensuales y anuales del software.

---

## 🛠️ Stack Tecnológico

- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) (Sistema de diseño personalizado)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend-as-a-Service**: [Supabase](https://supabase.com/) (Auth, DB, Storage)
- **Iconos**: [Material Symbols](https://fonts.google.com/icons)

---

## 📦 Instalación y Configuración

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/camping-club-malli.git
   cd camping-club-malli
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Crea un archivo `.env` basado en `.env.example` y añade tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_anon_key
   ```

4. **Iniciar entorno de desarrollo:**
   ```bash
   npm run dev
   ```

---

## 🚀 Despliegue en Vercel

Este proyecto está optimizado para Vercel. Solo debes conectar tu repositorio y configurar las variables de entorno en el panel de control de Vercel.

El archivo `vercel.json` ya incluye las reglas de `rewrites` para que las rutas de React funcionen correctamente en producción (SPA).

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

## 📞 Soporte Técnico

Desarrollado para **Camping Club Malli**. Para asistencia técnica, contactar a través de los canales oficiales proporcionados en el portal de socios.
