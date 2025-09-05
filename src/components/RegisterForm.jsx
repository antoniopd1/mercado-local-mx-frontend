// frontend/src/components/RegisterForm.jsx
import  { useState } from 'react'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from 'firebase/auth'
import { auth } from '../firebase' // Corregida la ruta de importación
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
function RegisterForm () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()
  const handleSignUp = async e => {
    e.preventDefault()
    // Validación: Las contraseñas deben coincidir.
    if (password !== confirmPassword) {
      toast.error(
        'Las contraseñas no coinciden. Por favor, asegúrate de que ambos campos sean iguales.'
      )
      return
    }
    try {
      // 1. Crea el usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      // 2. Envía un correo de verificación
      await sendEmailVerification(userCredential.user)
      toast.success(
        '¡Registro exitoso! Se ha enviado un correo de verificación a tu email. Por favor, verifica tu bandeja de entrada.'
      )
      // 3. Limpia los campos del formulario
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      // 4. Cierra la sesión para forzar la verificación de email
      await signOut(auth)
      // 5. Redirige al usuario a la página de verificación
      navigate('/verify-email')
    } catch (error) {
      let errorMessage = 'Error al registrar. Por favor, inténtalo de nuevo.'
      if (error.code === 'auth/email-already-in-use') {
        errorMessage =
          'Este correo electrónico ya está registrado. Intenta iniciar sesión o usa otro correo.'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña debe tener al menos 6 caracteres.'
      }
      toast.error(errorMessage)
      console.error('Error al registrar:', error)
    }
  }
  return (
    <form className='space-y-6' onSubmit={handleSignUp}>
      <div>
        <label
          htmlFor='register-email'
          className='block text-sm font-medium text-gray-700'
        >
          Correo Electrónico
        </label>
        <input
          id='register-email'
          name='email'
          type='email'
          autoComplete='email'
          placeholder='tucorreo@gmail.com'
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base transition duration-150 ease-in-out'
        />
      </div>
      <div>
        <label
          htmlFor='register-password'
          className='block text-sm font-medium text-gray-700'
        >
          Contraseña
        </label>
        <input
          id='register-password'
          name='password'
          type='password'
          autoComplete='new-password'
          required
          value={password}
          placeholder='••••••••'
          onChange={e => setPassword(e.target.value)}
          className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base transition duration-150 ease-in-out'
        />
      </div>
      <div>
        <label
          htmlFor='confirm-password'
          className='block text-sm font-medium text-gray-700'
        >
          Confirmar Contraseña
        </label>
        <input
          id='confirm-password'
          name='confirmPassword'
          type='password'
          autoComplete='new-password'
          placeholder='••••••••'
          required
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base transition duration-150 ease-in-out'
        />
      </div>
      <div>
        <button
          type='submit'
          className='w-full flex justify-center py-3 px-4 border-2 border-indigo-600 rounded-lg shadow-sm text-lg font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out'
        >
          Registrar Nuevo Negocio
        </button>
      </div>
    </form>
  )
}
export default RegisterForm
