import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getOfferById, createOffer, updateOffer } from '../services/apiService'

// Importamos algunos iconos para mejorar la presentación (asegúrate de instalar react-icons)
import {
  FaTag,
  FaDollarSign,
  FaCalendarAlt,
  FaToggleOn,
  FaImage,
  FaSave,
  FaTimes,
  FaSpinner,
  FaPlus,
  FaEdit
} from 'react-icons/fa'

const OfferFormPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    original_price: '',
    discount_price: '',
    image: null,
    start_date: '',
    end_date: '',
    is_active: true
  })
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(null) // Para mostrar la imagen actual en modo edición

  useEffect(() => {
    if (id) {
      setIsEditing(true)
      const fetchOffer = async () => {
        try {
          const offerData = await getOfferById(id)
          setFormData({
            title: offerData.title,
            description: offerData.description,
            original_price: offerData.original_price || '',
            discount_price: offerData.discount_price,
            image: null, // Siempre nulo para no pre-llenar el campo de archivo
            start_date: offerData.start_date,
            end_date: offerData.end_date,
            is_active: offerData.is_active
          })
          setCurrentImageUrl(offerData.image) // Guardar la URL de la imagen actual
        } catch (err) {
          console.error('Error al cargar la oferta para edición:', err)
          setError(
            'No se pudo cargar la oferta. Por favor, verifica el ID o tus permisos.'
          )
          toast.error('Error al cargar la oferta.')
        } finally {
          setLoading(false)
        }
      }
      fetchOffer()
    } else {
      setLoading(false)
    }
  }, [id])

  const handleChange = e => {
    const { name, value, type, files, checked } = e.target
    let newValue = value;

    // Validación: Si el campo es un precio y el valor es menor a 0, se establece en 0.
    if ((name === 'original_price' || name === 'discount_price') && parseFloat(value) < 0) {
      newValue = 0;
    }

    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : newValue
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    toast.dismiss()

    // 1. Crear un objeto FormData
    const data = new FormData()

    // 2. Recorrer los campos del formulario
    for (const key in formData) {
      // 3. Lógica para manejar campos específicos
      if (key === 'image') {
        // CÓDIGO CRÍTICO: SOLO AÑADIR LA IMAGEN SI ES UN ARCHIVO REAL
        // Si 'formData.image' es un objeto 'File', lo agregamos al FormData.
        // Si es null (no se seleccionó una nueva imagen), simplemente lo ignoramos.
        if (formData.image instanceof File) {
          data.append(key, formData.image)
        }
      } else if (key === 'original_price' && formData[key] === '') {
        // Manejar campos opcionales que se envían como cadena vacía
        // para que el backend pueda tratarlos como null si es necesario
        data.append(key, '')
      } else if (formData[key] !== null && formData[key] !== '') {
        // Agregar todos los demás campos que no son nulos ni cadenas vacías
        data.append(key, formData[key])
      }
    }

    setLoading(true)
    try {
      if (isEditing) {
        await updateOffer(id, data)
        toast.success('Oferta actualizada exitosamente!')
      } else {
        await createOffer(data)
        toast.success('Oferta creada exitosamente!')
      }
      navigate('/dashboard/my-offers')
    } catch (err) {
      console.error(
        'Error al guardar la oferta:',
        err.response ? err.response.data : err
      )
      const errorData = err.response && err.response.data
      let errorMsg = 'Error desconocido al guardar la oferta.'

      if (errorData) {
        if (typeof errorData === 'object') {
          errorMsg = Object.entries(errorData)
            .map(
              ([key, value]) =>
                `${key}: ${Array.isArray(value) ? value.join(', ') : value}`
            )
            .join('\n')
        } else {
          errorMsg = errorData.toString()
        }
      }
      setError('Error al guardar la oferta: ' + errorMsg)
      toast.error('Error al guardar la oferta: ' + errorMsg)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    // Solo mostrar loader si estamos editando y cargando datos
    return (
      <div className='flex justify-center items-center h-screen bg-gray-100'>
        <FaSpinner className='animate-spin text-blue-500 text-6xl' />
        <p className='ml-4 text-xl text-gray-700'>Cargando oferta...</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br   py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center'>
      <div className='max-w-3xl w-full bg-white rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-200'>
        <h1 className='text-4xl font-extrabold text-center text-gray-900 mb-8 tracking-tight'>
          {isEditing ? (
            <>
              <FaEdit className='inline-block mr-3 text-indigo-600' />
              Editar Oferta
            </>
          ) : (
            <>
              <FaPlus className='inline-block mr-3 text-green-600' />
              Crear Nueva Oferta
            </>
          )}
        </h1>

        {error && (
          <div
            className='bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md'
            role='alert'
          >
            <div className='flex'>
              <div className='py-1'>
                <svg
                  className='fill-current h-6 w-6 text-red-500 mr-4'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                >
                  <path d='M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z' />
                </svg>
              </div>
              <div>
                <p className='font-bold'>¡Error al procesar la oferta!</p>
                <p className='text-sm'>{error}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Título */}
          <div>
            <label
              htmlFor='title'
              className='block text-gray-800 text-sm font-semibold mb-2 flex items-center'
            >
              <FaTag className='mr-2 text-indigo-500' /> Título de la Oferta{' '}
              <span className='text-red-500 ml-1'>*</span>
            </label>
            <input
              type='text'
              className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800'
              id='title'
              name='title'
              value={formData.title}
              onChange={handleChange}
              placeholder='Ej: 20% de descuento en Pizzas'
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor='description'
              className='block text-gray-800 text-sm font-semibold mb-2 flex items-center'
            >
              <FaTag className='mr-2 text-indigo-500' /> Descripción{' '}
              <span className='text-red-500 ml-1'>*</span>
            </label>
            <textarea
              className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800'
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              rows='5'
              placeholder='Detalles completos de la oferta, condiciones, etc.'
              required
            ></textarea>
          </div>

          {/* Precios */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label
                htmlFor='original_price'
                className='block text-gray-800 text-sm font-semibold mb-2 flex items-center'
              >
                <FaDollarSign className='mr-2 text-green-500' /> Precio Original
                (Opcional)
              </label>
              <input
                type='number'
                step='0.5'
                min='0' // SE AGREGA LA VALIDACIÓN HTML AQUÍ
                className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-800'
                id='original_price'
                name='original_price'
                value={formData.original_price}
                onChange={handleChange}
                placeholder='Ej: 150.00'
              />
            </div>
            <div>
              <label
                htmlFor='discount_price'
                className='block text-gray-800 text-sm font-semibold mb-2 flex items-center'
              >
                <FaDollarSign className='mr-2 text-green-500' /> Precio con
                Descuento <span className='text-red-500 ml-1'>*</span>
              </label>
              <input
                type='number'
                step='0.5'
                min='0' // SE AGREGA LA VALIDACIÓN HTML AQUÍ
                className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200 text-gray-800'
                id='discount_price'
                name='discount_price'
                value={formData.discount_price}
                onChange={handleChange}
                placeholder='Ej: 120.00'
                required
              />
            </div>
          </div>

          {/* Imagen de la Oferta */}
          <div>
            <label
              htmlFor='image'
              className='block w-full text-sm font-medium text-gray-800 mb-2 flex items-center'
            >
              <FaImage className='mr-2 text-purple-500' /> Imagen de la Oferta (
              {isEditing ? 'dejar vacío para no cambiar' : 'opcional'})
            </label>
            <input
              type='file'
              className='block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-200 cursor-pointer'
              id='image'
              name='image'
              onChange={handleChange}
              accept='image/*'
            />
            {isEditing && currentImageUrl && !formData.image && (
              <div className='mt-3 text-sm text-gray-600 flex items-center'>
                <span className='mr-2'>Imagen actual:</span>
                <img
                  src={currentImageUrl}
                  alt='Imagen actual de la oferta'
                  className='w-20 h-20 object-cover rounded-md border border-gray-300'
                />
              </div>
            )}
            {formData.image && (
              <div className='mt-3 text-sm text-gray-600 flex items-center'>
                <span className='mr-2'>Nueva imagen seleccionada:</span>
                <img
                  src={URL.createObjectURL(formData.image)}
                  alt='Vista previa de la nueva imagen'
                  className='w-20 h-20 object-cover rounded-md border border-gray-300'
                />
              </div>
            )}
          </div>

          {/* Fechas */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label
                htmlFor='start_date'
                className='block text-gray-800 text-sm font-semibold mb-2 flex items-center'
              >
                <FaCalendarAlt className='mr-2 text-blue-500' /> Fecha de Inicio{' '}
                <span className='text-red-500 ml-1'>*</span>
              </label>
              <input
                type='date'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-800'
                id='start_date'
                name='start_date'
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor='end_date'
                className='block text-gray-800 text-sm font-semibold mb-2 flex items-center'
              >
                <FaCalendarAlt className='mr-2 text-blue-500' /> Fecha de Fin{' '}
                <span className='text-red-500 ml-1'>*</span>
              </label>
              <input
                type='date'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-gray-800'
                id='end_date'
                name='end_date'
                value={formData.end_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Oferta Activa Checkbox */}
          <div className='flex items-center pt-4 border-t border-gray-200'>
            <input
              type='checkbox'
              className='form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer'
              id='is_active'
              name='is_active'
              checked={formData.is_active}
              onChange={handleChange}
            />
            <label
              className='ml-3 text-gray-800 text-sm font-semibold flex items-center'
              htmlFor='is_active'
            >
              <FaToggleOn className='mr-2 text-indigo-500 text-lg' /> Oferta
              Activa
            </label>
          </div>

          {/* Botones de acción */}
          <div className='flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200'>
            <button
              type='submit'
              className='flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 transform hover:scale-105'
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className='animate-spin mr-3 text-xl' />
              ) : isEditing ? (
                <FaSave className='mr-3 text-xl' />
              ) : (
                <FaPlus className='mr-3 text-xl' />
              )}
              {loading
                ? 'Guardando...'
                : isEditing
                ? 'Guardar Cambios'
                : 'Crear Oferta'}
            </button>
            <button
              type='button'
              className='flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-md text-gray-800 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-200 transform hover:scale-105'
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              <FaTimes className='mr-3 text-xl' />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default OfferFormPage
