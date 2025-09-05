import React from 'react';
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
  FaEdit,
  FaCameraRetro
} from 'react-icons/fa';

import {MUNICIPALITY_OPTIONS, LOCATION_TYPE_OPTIONS, BUSINESS_TYPE_OPTIONS} from '../data/dataBussines'



// Componente de formulario con los nuevos estilos
function BusinessForm({
  formData,
  handleChange,
  handleFileChange,
  logoPreviewUrl,
  handleRemoveLogo,
  handleSubmit,
  isSubmitting,
  businessExists,
  handleCancelEdit
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br  py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8 tracking-tight">
          {businessExists ? (
            <>
              <FaEdit className="inline-block mr-3 text-indigo-600" />
              Editar Datos del Negocio
            </>
          ) : (
            <>
              <FaPlus className="inline-block mr-3 text-green-600" />
              Registrar Nuevo Negocio
            </>
          )}
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Completa los campos para administrar tu negocio. Los campos marcados con (*) son obligatorios.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Nombre del Negocio */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                <FaTag className="mr-2 text-indigo-500" />
                Nombre del Negocio <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800"
                maxLength="200"
                required
              />
            </div>

            {/* Tipo de Negocio */}
            <div>
              <label htmlFor="business_type" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                <FaTag className="mr-2 text-indigo-500" />
                Tipo de Negocio
              </label>
              <div className="relative">
                <select
                  id="business_type"
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800 appearance-none bg-white pr-8"
                >
                  <option value="">Selecciona un tipo</option>
                  {BUSINESS_TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">Selecciona la categoría que mejor describa tu negocio.</p>
            </div>

            {/* Municipio */}
            <div>
              <label htmlFor="municipality" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                <FaTag className="mr-2 text-indigo-500" />
                Municipio <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  id="municipality"
                  name="municipality"
                  value={formData.municipality}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800 appearance-none bg-white pr-8"
                  required
                >
                  {MUNICIPALITY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="md:col-span-2">
              <label htmlFor="street_address" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                <FaTag className="mr-2 text-indigo-500" />
                Dirección (Calle y número) <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                id="street_address"
                name="street_address"
                value={formData.street_address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800"
                maxLength="255"
                required
              />
            </div>

            {/* Tipo de Ubicación */}
            <div>
              <label htmlFor="location_type" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                <FaTag className="mr-2 text-indigo-500" />
                Tipo de Ubicación <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <select
                  id="location_type"
                  name="location_type"
                  value={formData.location_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800 appearance-none bg-white pr-8"
                  required
                >
                  {LOCATION_TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="contact_phone" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                <FaTag className="mr-2 text-indigo-500" />
                Número de Teléfono <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800"
                maxLength="20"
                required
              />
            </div>

            {/* Qué venden */}
            <div className="md:col-span-2">
              <label htmlFor="what_they_sell" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                <FaTag className="mr-2 text-indigo-500" />
                Qué venden (productos/servicios) <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="what_they_sell"
                name="what_they_sell"
                value={formData.what_they_sell}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800 h-24 resize-y"
                placeholder="Ej: Ropa de mezclilla para dama y caballero, accesorios de moda."
                required
              />
            </div>

            {/* Horarios */}
            <div className="md:col-span-2">
              <label htmlFor="hours" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                <FaCalendarAlt className="mr-2 text-blue-500" />
                Horarios de Atención <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="hours"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800 h-20 resize-y"
                placeholder="Ej: Lunes a Viernes de 9:00 AM a 6:00 PM; Sábados de 10:00 AM a 2:00 PM. Cerrado Domingos."
                maxLength="255"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Sé específico con los días y horas de apertura/cierre.</p>
            </div>

            {/* Redes Sociales */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="social_media_facebook_username" className="block text-sm font-semibold text-gray-800 mb-2">Usuario de Facebook (Opcional)</label>
                <input
                  type="text"
                  id="social_media_facebook_username"
                  name="social_media_facebook_username"
                  value={formData.social_media_facebook_username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800"
                  maxLength="100"
                  placeholder="Ej: miNegocioOficial"
                />
              </div>
              <div>
                <label htmlFor="social_media_instagram_username" className="block text-sm font-semibold text-gray-800 mb-2">Usuario de Instagram (Opcional)</label>
                <input
                  type="text"
                  id="social_media_instagram"
                  name="social_media_instagram_username"
                  value={formData.social_media_instagram_username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800"
                  maxLength="100"
                  placeholder="Ej: @miNegocioOficial"
                />
              </div>
              <div>
                <label htmlFor="social_media_tiktok_username" className="block text-sm font-semibold text-gray-800 mb-2">Usuario de TikTok (Opcional)</label>
                <input
                  type="text"
                  id="social_media_tiktok_username"
                  name="social_media_tiktok_username"
                  value={formData.social_media_tiktok_username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-800"
                  maxLength="100"
                  placeholder="Ej: @miNegocioOficial"
                />
              </div>
            </div>

            {/* Campo de Logo y Previsualización */}
            <div className="md:col-span-2">
              <label htmlFor="logo" className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
                <FaCameraRetro className="mr-2 text-purple-500" />
                Logo/Imagen del Negocio (Opcional)
              </label>
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition duration-200 cursor-pointer"
                />

                {logoPreviewUrl && (
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <img src={logoPreviewUrl} alt="Previsualización del Logo" className="w-full h-full object-contain rounded-md border border-gray-300" />
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                      aria-label="Quitar Logo"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle">
                        <circle cx="12" cy="12" r="10" />
                        <path d="m15 9-6 6" />
                        <path d="m9 9 6 6" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">Sube una imagen para tu logo o representación del negocio.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              className={`flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <FaSpinner className="animate-spin mr-3 text-xl" />
              ) : businessExists ? (
                <FaSave className="mr-3 text-xl" />
              ) : (
                <FaPlus className="mr-3 text-xl" />
              )}
              {isSubmitting ? 'Guardando...' : (businessExists ? 'Actualizar Negocio' : 'Registrar Negocio')}
            </button>

            {businessExists && handleCancelEdit && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className={`flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-md text-gray-800 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isSubmitting}
              >
                <FaTimes className="mr-3 text-xl" />
                Cancelar Edición
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default BusinessForm;
