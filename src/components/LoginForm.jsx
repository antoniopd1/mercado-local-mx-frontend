// frontend/src/components/LoginForm.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // Corregida la ruta de importación
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore'; // Importa tu store

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const clearAuth = useAuthStore((state) => state.clearAuth); // Obtén la acción para limpiar el estado

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {

      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      if (!userCredential.user.emailVerified) {
        toast.error('Por favor, verifica tu correo electrónico para continuar.');
        await auth.signOut();
        clearAuth();
        navigate('/login');
        // El 'return' detiene la ejecución aquí
        return; 
      }
      

      // Si el email está verificado, continúa
      toast.success('¡Inicio de sesión exitoso!');
      setEmail('');
      setPassword('');
      navigate('/dashboard')


    } catch (error) {
      let errorMessage = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Correo electrónico o contraseña incorrectos.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'Tu cuenta ha sido deshabilitada.';
      }
      toast.error(errorMessage);
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSignIn}>
      <div>
        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tucorreo@gmail.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base transition duration-150 ease-in-out"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
          id="login-password"
          placeholder="••••••••"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base transition duration-150 ease-in-out"
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
        >
          Iniciar Sesión
        </button>
      </div>
    </form>
  );
}

export default LoginForm;
