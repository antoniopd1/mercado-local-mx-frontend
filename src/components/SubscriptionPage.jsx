// src/pages/SubscriptionPage.jsx
import React, { useState } from 'react';
import { CheckCircle, Crown, BarChart, Rocket, HeartHandshake, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '../services/apiService';
import { useAuthStore } from '../stores/authStore';

import { loadStripe } from '@stripe/stripe-js';

// Tu clave publicable de Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const SubscriptionPage = () => {
  const { hasActiveSubscription, isLoading: isAuthLoading } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Llama a tu backend de Django para crear la sesión de checkout
      const response = await createCheckoutSession();
      // ¡CORRECCIÓN AQUÍ!
      // Se extrae el sessionId directamente del objeto de respuesta, sin .data
      const { sessionId } = response; 
      
      console.log('debug: voy iniciar el proceso de compra');

      // 2. Carga Stripe y redirige al usuario al checkout
      const stripe = await stripePromise;
      if (stripe && sessionId) {
        console.log('debug: todo resulto correctamente', sessionId);
        const { error: redirectError } = await stripe.redirectToCheckout({ 
          sessionId: sessionId 
        });

        if (redirectError) {
          setError('Error al redirigir al pago: ' + redirectError.message);
          setLoading(false);
        }
      } else {
        setError('No se pudo cargar Stripe. Inténtalo de nuevo.');
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      const errorMessage = e.response?.data?.error || 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
      setError(errorMessage);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl">Cargando...</p>
      </div>
    );
  }

  if (hasActiveSubscription) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-green-600 mb-4">¡Ya eres miembro Premium!</h1>
          <p className="text-gray-700">Gracias por tu apoyo. Ya tienes acceso a todas las funciones de negocios.</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            Ir a mi negocio
          </button>
        </div>
      </div>
    );
  }

  return (
     <div className="flex items-center justify-center  bg-gray-100 font-inter">
      <div className="text-center p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 hover:scale-105">
        <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Potencia tu Negocio</h1>
        <p className="text-xl text-gray-600 mb-6">Paga <span className="font-bold text-green-500">$99.99 MXN</span> al mes y forma parte de nuestra comunidad digital para conectar con más clientes.</p>
        <ul className="text-left text-gray-700 mb-8 space-y-3">
          <li className="flex items-center">
            <Rocket className="w-5 h-5 text-indigo-500 mr-2" />
            <span className="font-semibold">Forma parte del mercado digital:</span> Accede a una plataforma exclusiva para negocios locales.
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            <span className="font-semibold">Publica ofertas ilimitadas:</span> Crea y gestiona tantas promociones como necesites.
          </li>
          <li className="flex items-center">
            <BarChart className="w-5 h-5 text-blue-500 mr-2" />
            <span className="font-semibold">Multiplica la visibilidad de tu marca:</span> Expande tu alcance y conecta con miles de clientes en todo Internet.
          </li>
          <li className="flex items-center">
            <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
            <span className="font-semibold">Acceso a futuras funcionalidades:</span> Desbloquea todas las próximas mejoras y herramientas sin costo adicional.
          </li>
          <li className="flex items-center">
            <HeartHandshake className="w-5 h-5 text-pink-500 mr-2" />
            <span className="font-semibold">Soporte prioritario:</span> Recibe ayuda rápida para cualquier duda o problema.
          </li>
        </ul>
        <button 
          onClick={handleSubscribe} 
          disabled={loading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
        >
          {loading ? 'Cargando...' : 'Suscribirse ahora'}
        </button>
        {error && <div className="text-red-500 mt-4 text-sm">{error}</div>}
      </div>
    </div>
  );
};

export default SubscriptionPage;
