// src/pages/SubscriptionSuccessPage.jsx
import React, { useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

const SubscriptionSuccessPage = () => {
  const navigate = useNavigate();
  const { setSubscriptionStatus } = useAuthStore();

  useEffect(() => {
    // Aquí podrías tener lógica para verificar la sesión de Stripe
    // y actualizar el estado en tu backend si es necesario.
    // Por ahora, asumimos que fue exitoso y actualizamos el estado de Zustand
    // Esto es temporal; el enfoque correcto es con Stripe Webhooks.
    setSubscriptionStatus(true);
    // Limpiar el estado de "loading" si lo tuvieras
  }, [setSubscriptionStatus]);

  return (
    <div className="flex items-center justify-center h-screen bg-green-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-green-600 mb-4">¡Suscripción exitosa! 🎉</h1>
        <p className="text-lg text-gray-700">Gracias por tu pago. Tu cuenta ha sido actualizada.</p>
        <button 
          onClick={() => navigate('/my-business')} 
          className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          Ir a mi negocio
        </button>
      </div>
    </div>
  );
};

export default SubscriptionSuccessPage;