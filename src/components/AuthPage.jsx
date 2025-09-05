// frontend/src/components/AuthPage.jsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    // Contenedor principal que ocupa toda la altura de la pantalla (min-h-screen)
    // y utiliza flexbox para centrar su contenido.
    <div className="flex flex-col items-center justify-center min-h-screen p-4  bg-cover bg-center bg-fixed"
      style={{ backgroundImage: 'url("/Uriangato-Guanajuato-principal-1200x500.jpg")' }}
    >
      {/* La tarjeta del formulario. Ocupa el 100% del ancho en móviles, pero está
          limitada a un tamaño máximo en pantallas más grandes (max-w-md).
          El padding (p-8) y la sombra mejoran la estética y la legibilidad. */}
      <div className="w-full max-w-md p-8 bg-white opacity-90 rounded-2xl shadow-2xl space-y-8 transform transition-all duration-300 ease-in-out hover:scale-105">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          {/* Tamaños de texto adaptativos y tipografía limpia */}
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Mercado Local MX</h1>
          <p className="mt-2 text-lg text-gray-600">
            {isLoginMode ? 'Accede a tu cuenta de negocio' : 'Registra tu nuevo negocio'}
          </p>
        </div>

        {isLoginMode ? <LoginForm /> : <RegisterForm />}

        {/* El botón de alternar entre modos, con un estilo sutil. */}
        <p className="text-center text-sm text-gray-500">
          {isLoginMode ? "¿No tienes una cuenta?" : "¿Ya tienes una cuenta?"}
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="font-medium text-indigo-600 hover:text-indigo-500 ml-1 focus:outline-none focus:underline"
          >
            {isLoginMode ? "Regístrate aquí" : "Inicia sesión aquí"}
          </button>
        </p>

      </div>
    </div>
  );
}

export default AuthPage;
