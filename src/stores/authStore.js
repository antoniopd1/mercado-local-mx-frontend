import { create } from 'zustand';
import { auth } from '../firebase'; // Importa la instancia de Firebase Auth
import { onAuthStateChanged } from 'firebase/auth'; // Importa onAuthStateChanged

// Crea el store de Zustand
export const useAuthStore = create((set) => ({
  user: null, // Objeto de usuario de Firebase
  isAuthenticated: false, // Booleano si el usuario está logueado
  emailVerified: false, // Booleano si el email del usuario está verificado
  isLoading: true, // Para indicar si el estado de autenticación inicial está cargando
  businessInfo: null, // Información del negocio del usuario (ej. { id, name, is_paid_member, ... })
  isBusinessOwner: false, // NUEVO: Estado para el custom claim isBusinessOwner
  hasActiveSubscription: false,

  // Acción para establecer el usuario
  setUser: (user) => {
    set({
      user: user,
      isAuthenticated: !!user, // true si user no es null
      emailVerified: user ? user.emailVerified : false,
      isLoading: false, // El estado inicial ya se cargó
    });
  },
   // --- NUEVA ACCIÓN para actualizar el estado de suscripción ---
  setSubscriptionStatus: (status) => {
    set({ hasActiveSubscription: status });
  },

  // Acción para restablecer el estado al cerrar sesión
  clearAuth: () => {
    set({
      user: null,
      isAuthenticated: false,
      emailVerified: false,
      isLoading: false,
      businessInfo: null, // Limpia también la información del negocio
      isBusinessOwner: false, // Limpia también el estado de dueño de negocio
    });
  },

  // Acción para establecer la información del negocio
  setBusinessInfo: (businessData) => {
    set({ businessInfo: businessData });
  },

  // Función para inicializar el estado de autenticación
  initializeAuth: () => {
    // Suscribe un observador a los cambios de estado de autenticación de Firebase
    onAuthStateChanged(auth, async (currentUser) => { // Agrega 'async' aquí
      if (currentUser) {
        try {
          // Si hay un usuario logueado, actualiza el estado del store
          // Obtener el ID Token y sus claims. Forzamos un refresco para asegurar
          // que los claims personalizados estén actualizados, especialmente después de un cambio.
          const idTokenResult = await currentUser.getIdTokenResult(true); 
          const claims = idTokenResult.claims;
          

          set({
            user: currentUser,
            isAuthenticated: true,
            emailVerified: currentUser.emailVerified,
            isLoading: false,
            // Accede al custom claim 'isBusinessOwner' y actualiza el estado
            isBusinessOwner: claims.isBusinessOwner === true, // Asegúrate de que sea un booleano
            hasActiveSubscription: claims.hasActiveSubscription === true,
          });

        } catch (error) {
          set({
            user: currentUser, // Mantener el usuario pero con isBusinessOwner en false por seguridad
            isAuthenticated: true,
            emailVerified: currentUser.emailVerified,
            isLoading: false,
            isBusinessOwner: false, // Si hay error, asumimos que no es dueño
            hasActiveSubscription: false,
          });
        }
      } else {
        // Si no hay usuario logueado, restablece el estado
        set({
          user: null,
          isAuthenticated: false,
          emailVerified: false,
          isLoading: false,
          businessInfo: null,
          isBusinessOwner: false, // Asegúrate de limpiar isBusinessOwner
        });
      }
    });
  },
}));

// Llama a initializeAuth una vez para configurar el observador de Firebase
// Se recomienda llamar esto en el punto de entrada de tu app (main.jsx o App.jsx)
// para que se inicialice una sola vez y el store esté listo al renderizar la UI.
// Si lo dejas aquí, se ejecutará al importar el store.
useAuthStore.getState().initializeAuth();