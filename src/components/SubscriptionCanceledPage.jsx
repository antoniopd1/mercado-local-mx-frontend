// src/pages/SubscriptionCanceledPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionCanceledPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-red-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Pago cancelado 😔</h1>
        <p className="text-lg text-gray-700">Tu suscripción no ha sido procesada. Puedes volver a intentarlo.</p>
        <button 
          onClick={() => navigate('/subscribe')} 
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
        >
          Volver a la suscripción
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCanceledPage;