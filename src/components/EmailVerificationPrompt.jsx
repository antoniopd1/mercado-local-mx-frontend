// frontend/src/components/EmailVerificationPrompt.jsx
import React, { useState } from 'react';
// Importamos los íconos necesarios para el nuevo diseño
import { FaExclamationTriangle, FaSignOutAlt } from 'react-icons/fa';
// Importaciones de Firebase y React Router
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function EmailVerificationPrompt({ userEmail }) {
  const [message] = useState(''); // Mantener message para el prompt específico
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      clearAuth();
      toast.info('Sesión cerrada correctamente.');
      navigate('/'); // Redirige a la página de autenticación
    } catch (error) {
      toast.error(`Error al cerrar sesión: ${error.message}`);
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-200">
        <div className="flex flex-col items-center text-center space-y-6">
          <FaExclamationTriangle className="text-yellow-500 text-6xl" />
          <h2 className="text-3xl font-extrabold text-gray-900">
            ¡Atención, <span className="text-indigo-600">{userEmail}</span>!
          </h2>
          <p className="text-gray-700 max-w-sm">
            Tu cuenta aún no ha sido verificada. Es necesario que confirmes tu correo electrónico para poder acceder a todas las funcionalidades.
          </p>
          <p className="text-gray-700 max-w-sm">
            Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para encontrar el correo de verificación.
          </p>
          <div className="w-full flex justify-center">
            <button
              onClick={handleSignOut}
              className="mt-6 flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-200 transform hover:scale-105"
            >
              <FaSignOutAlt className="mr-3 text-xl" />
              Cerrar Sesión
            </button>
          </div>
          {message && (
            <p className={`mt-4 text-center font-semibold ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </p>
          )}
          <p className="text-sm text-gray-500 max-w-sm pt-4 border-t border-gray-200">
            Una vez que hayas verificado tu email, simplemente inicia sesión de nuevo para continuar.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailVerificationPrompt;
