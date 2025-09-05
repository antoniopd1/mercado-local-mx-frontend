import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import OfferCard from '../components/OfferCard'
import { getMyOffers, deleteOffer, getMyBusiness } from '../services/apiService'
import { useAuthStore } from '../stores/authStore'

// Iconos que necesitarás para el modal
import {
  FaSpinner,
  FaFileSignature,
  FaInfoCircle,
  FaCheckCircle,
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaExclamationTriangle,
  FaTimes,
  FaArrowLeft
} from 'react-icons/fa'

const MyOffersPage = () => {
  const [myOffers, setMyOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [businessExists, setBusinessExists] = useState(false)

  // --- Nuevos estados para el modal de eliminación ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [offerToDelete, setOfferToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false) // Estado para el spinner del botón

  const {
    isBusinessOwner,
    isAuthenticated,
    isLoading: authLoading
  } = useAuthStore()

  const fetchUserSpecificData = async () => {
    setLoading(true)
    setError(null)
    setMyOffers([])
    setBusinessExists(false)

    try {
      if (!isAuthenticated) {
        setError('Debes iniciar sesión para ver tus ofertas.')
        return
      }
      if (!isBusinessOwner) {
        return
      }

      let businessFoundSuccessfully = false
      try {
        const userBusiness = await getMyBusiness()
        if (
          userBusiness &&
          typeof userBusiness === 'object' &&
          userBusiness.id
        ) {
          businessFoundSuccessfully = true
        } else {
          businessFoundSuccessfully = false
        }
      } catch (businessErr) {
        if (businessErr.response && businessErr.response.status === 404) {
          businessFoundSuccessfully = false
        } else {
          setError(
            'Ocurrió un error al verificar tu negocio. Inténtalo de nuevo.'
          )
          setLoading(false)
          return
        }
      }

      setBusinessExists(businessFoundSuccessfully)

      if (businessFoundSuccessfully) {
        try {
          const offersData = await getMyOffers()
          setMyOffers(offersData)
        } catch (offersErr) {
          if (offersErr.response && offersErr.response.status === 404) {
            setMyOffers([])
          } else if (
            offersErr.response &&
            (offersErr.response.status === 401 ||
              offersErr.response.status === 403)
          ) {
            setError(
              'Tu sesión ha expirado o no tienes permiso para ver tus ofertas. Por favor, inicia sesión de nuevo.'
            )
          } else {
            setError(
              'No se pudieron cargar tus ofertas. Inténtalo de nuevo más tarde.'
            )
          }
        }
      } else {
        setMyOffers([])
      }
    } catch (err) {
      console.error('Error general en fetchUserSpecificData:', err)
      setError(
        'Ocurrió un error inesperado en la página de ofertas. Inténtalo de nuevo.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchUserSpecificData()
    }
  }, [isAuthenticated, isBusinessOwner, authLoading])

  // --- Nueva función para abrir el modal ---
  const openDeleteModal = offerId => {
    setOfferToDelete(offerId)
    setIsDeleteModalOpen(true)
  }

  // --- Nueva función para confirmar la eliminación ---
  const handleConfirmDelete = async () => {
    if (!offerToDelete) return

    setIsDeleting(true)
    try {
      await deleteOffer(offerToDelete.id)
      toast.success('Oferta eliminada exitosamente!')
      fetchUserSpecificData()
    } catch (err) {
      console.error('Error al eliminar la oferta:', err)
      toast.error('Error al eliminar la oferta. Asegúrate de tener permisos.')
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false) // Cierra el modal de todas formas
      setOfferToDelete(null) // Limpia la oferta seleccionada
    }
  }

  // --- Renderizado Condicional de Estados (Carga, Error, Permiso, Negocio No Registrado) ---
  // ... (Tu código de renderizado condicional de la carga, error y otros estados se mantiene igual) ...

  if (loading || authLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex-col'>
        <FaSpinner className='animate-spin text-indigo-600 text-5xl mb-4' />
        <p className='text-xl text-indigo-800 font-semibold drop-shadow-sm'>
          Cargando tus datos...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-red-50 p-6 flex-col'>
        <div
          className='bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md relative text-center'
          role='alert'
        >
          <strong className='font-bold text-xl block mb-2'>¡Error!</strong>
          <span className='block text-lg'>{error}</span>
        </div>
        {isAuthenticated ? (
          <button
            onClick={fetchUserSpecificData}
            className='mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out flex items-center gap-2'
          >
            <FaSpinner className='mr-2 animate-spin hidden group-hover:block' />{' '}
            Reintentar
          </button>
        ) : (
          <Link
            to='/login'
            className='mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out flex items-center gap-2'
          >
            <FaArrowLeft className='mr-2' /> Iniciar Sesión
          </Link>
        )}
      </div>
    )
  }

  if (isAuthenticated && !isBusinessOwner) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6 flex-col text-center'>
        <FaInfoCircle className='text-purple-600 text-7xl mb-6 opacity-80' />
        <h2 className='text-3xl font-bold text-gray-800 mb-4'>
          Conviértete en Dueño de Negocio
        </h2>
        <p className='text-lg text-gray-700 mb-6 max-w-lg'>
          Para acceder a esta sección y gestionar tus ofertas, necesitas activar
          tu membresía de negocio.
        </p>
        <Link
          to='/dashboard/become-business'
          className='px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-xl hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-center text-lg transform hover:scale-105'
        >
          <FaCheckCircle className='inline-block mr-2 text-xl' /> Activar
          Membresía de Negocio
        </Link>
      </div>
    )
  }

  if (!businessExists) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6 flex-col text-center'>
        <FaFileSignature className='text-green-600 text-7xl mb-6 opacity-80' />
        <h2 className='text-3xl font-bold text-gray-800 mb-4'>
          ¡Registra tu Comercio Ahora!
        </h2>
        <p className='text-lg text-gray-700 mb-6 max-w-lg'>
          Has activado tu membresía de negocio. ¡Excelente! Ahora, el siguiente
          paso es registrar los detalles de tu comercio para que podamos mostrar
          tus ofertas.
        </p>
        <Link
          to='/dashboard/profile'
          className='px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out text-center text-lg transform hover:scale-105'
        >
          <FaCheckCircle className='inline-block mr-2 text-xl' /> Ir al Registro
          de Negocio
        </Link>
        <p className='text-sm text-gray-500 mt-4'>
          Una vez completado el registro, podrás crear y ver todas tus ofertas
          aquí.
        </p>
      </div>
    )
  }

  return (
    <div className='container  mx-auto p-4 md:p-8  min-h-screen'>
      <h1 className='text-4xl font-extrabold text-center text-white mb-8 tracking-tight'>
        Mis Ofertas
      </h1>

      <div className='flex justify-end mb-8'>
        <Link
          to='/dashboard/offers/create'
          className='px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out text-center transform hover:scale-105'
        >
          <FaPlus className='inline-block mr-2 text-xl' /> Crear Nueva Oferta
        </Link>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center'>
        {myOffers.length > 0 ? (
          myOffers.map(offer => (
            <OfferCard key={offer.id} offer={offer}>
              <div className='mt-4 flex justify-around space-x-2'>
                <Link
                  to={`/dashboard/offers/${offer.id}/edit`}
                  className='flex-1 inline-flex items-center justify-center px-4 py-2 bg-yellow-500 text-white font-semibold rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition duration-200 text-sm transform hover:scale-105'
                >
                  <FaEdit className='inline-block mr-2' /> Editar
                </Link>
                <button
                  onClick={() => openDeleteModal(offer)}
                  className='flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 text-center text-sm transform hover:scale-105'
                >
                  <FaTrashAlt className='inline-block mr-2' /> Eliminar
                </button>
              </div>
            </OfferCard>
          ))
        ) : (
          <div className='col-span-full text-center p-10 bg-white rounded-lg shadow-md'>
            <p className='text-xl text-gray-600 mb-4'>
              Aún no tienes ofertas. ¡Crea una ahora!
            </p>
            <Link
              to='/dashboard/offers/create'
              className='px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out text-center'
            >
              <FaPlus className='inline-block mr-2 text-xl' /> Crear mi primera
              oferta
            </Link>
          </div>
        )}
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 backdrop-blur-sm p-4'>
          <div className='bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md transform transition-all duration-300 scale-100 opacity-100'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-2xl font-bold text-gray-800 flex items-center'>
                <FaExclamationTriangle className='text-red-500 mr-3' />{' '}
                Confirmar Eliminación
              </h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className='text-gray-400 hover:text-gray-600 transition-colors'
              >
                <FaTimes size={20} />
              </button>
            </div>
            <p className='text-gray-700 mb-6 text-base leading-relaxed'>
              ¿Estás seguro de que quieres eliminar la oferta
              <strong className='font-semibold text-gray-900'>
                "{offerToDelete?.title}"
              </strong>
              ? Esta acción es{' '}
              <span className='font-bold text-red-600'>irreversible</span> y la
              oferta se eliminará permanentemente.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-end'>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className='w-full sm:w-auto px-6 py-3 font-semibold rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-colors duration-200'
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className='w-full sm:w-auto px-6 py-3 font-semibold rounded-lg shadow-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2'
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <FaSpinner className='animate-spin' /> Eliminando...
                  </>
                ) : (
                  <>
                    <FaTrashAlt /> Eliminar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyOffersPage
