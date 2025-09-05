// frontend/src/components/BusinessDisplay.jsx
import React from 'react';
import { LOCATION_TYPE_OPTIONS, BUSINESS_TYPE_OPTIONS } from '../data/dataBussines';
// Iconos de ejemplo (asegúrate de tener una librería como Heroicons instalada o similar)
// Si no tienes una librería de iconos, puedes omitir estas líneas o usar iconos SVG directamente
import {
    MapPinIcon, ClockIcon, PhoneIcon, TagIcon,
    ArrowPathIcon, CurrencyDollarIcon, CalendarIcon
} from '@heroicons/react/24/outline'; // Ejemplo de importación desde Heroicons
import {
    FaFacebook, FaInstagram, FaTwitter
} from 'react-icons/fa'; // Ejemplo de importación desde react-icons/fa (requiere instalación)


function BusinessDisplay({ existingBusiness, handleEditClick }) {
    if (!existingBusiness) {
        return (
            <div className="flex items-center justify-center p-6 bg-red-50 border border-red-200 text-red-800 rounded-lg shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <p className="font-bold text-lg">Error al cargar:</p>
                    <p>No se pudo cargar la información del negocio. Por favor, inténtalo de nuevo.</p>
                </div>
            </div>
        );
    }

    // Funciones para formatear la fecha si existe
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-200 mb-8 transform hover:scale-[1.005] transition-transform duration-200 ease-out">
            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 border-b pb-4 border-indigo-100">
                {existingBusiness.logo ? (
                    <img
                        src={existingBusiness.logo}
                        alt={`Logo de ${existingBusiness.name}`}
                        className="w-32 h-32 object-contain rounded-full shadow-md border-2 border-white bg-white flex-shrink-0 mb-4 sm:mb-0 sm:mr-6"
                    />
                ) : (
                    <div className="w-32 h-32 flex items-center justify-center rounded-full bg-indigo-200 text-indigo-700 text-5xl font-bold flex-shrink-0 mb-4 sm:mb-0 sm:mr-6 shadow-md">
                        {existingBusiness.name ? existingBusiness.name.charAt(0).toUpperCase() : 'N/A'}
                    </div>
                )}
                <div className="text-center sm:text-left flex-grow">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-indigo-800 leading-tight mb-2">
                        {existingBusiness.name}
                    </h2>
                    <p className="text-lg text-gray-600 italic">
                        {BUSINESS_TYPE_OPTIONS.find(opt => opt.value === existingBusiness.business_type)?.label || 'Tipo de Negocio no especificado'}
                    </p>
                </div>
            </div>

            <div className="space-y-4 text-gray-700">
                <p className="flex items-center text-lg">
                    <TagIcon className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
                    <strong className="font-semibold text-gray-800 mr-2">Qué ofrecen:</strong> {existingBusiness.what_they_sell || 'No especificado'}
                </p>
                <p className="flex items-start text-lg">
                    <ClockIcon className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0 mt-0.5" />
                    <strong className="font-semibold text-gray-800 mr-2">Horarios:</strong> {existingBusiness.hours || 'No especificado'}
                </p>
                <p className="flex items-start text-lg">
                    <MapPinIcon className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0 mt-0.5" />
                    <strong className="font-semibold text-gray-800 mr-2">Ubicación:</strong>
                    {existingBusiness.street_address}, {existingBusiness.municipality} (
                    {LOCATION_TYPE_OPTIONS.find(opt => opt.value === existingBusiness.location_type)?.label || 'Tipo de Ubicación no especificado'})
                </p>
                <p className="flex items-center text-lg">
                    <PhoneIcon className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0" />
                    <strong className="font-semibold text-gray-800 mr-2">Teléfono:</strong> {existingBusiness.contact_phone || 'No especificado'}
                </p>

                {(existingBusiness.social_media_facebook_username || existingBusiness.social_media_instagram_username || existingBusiness.social_media_twitter_username) && (
                    <div className="pt-4 border-t border-indigo-100 mt-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Redes Sociales:</h3>
                        <div className="flex flex-wrap gap-4">
                            {existingBusiness.social_media_facebook_username && (
                                <a
                                    href={`https://facebook.com/${existingBusiness.social_media_facebook_username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <FaFacebook className="h-5 w-5 mr-2" />
                                    Facebook
                                </a>
                            )}
                            {existingBusiness.social_media_instagram_username && (
                                <a
                                    href={`https://instagram.com/${existingBusiness.social_media_instagram_username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <FaInstagram className="h-5 w-5 mr-2" />
                                    Instagram
                                </a>
                            )}
                            {existingBusiness.social_media_twitter_username && (
                                <a
                                    href={`https://twitter.com/${existingBusiness.social_media_twitter_username}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    <FaTwitter className="h-5 w-5 mr-2" />
                                    X (Twitter)
                                </a>
                            )}
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-indigo-100 mt-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Información de Membresía:</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-lg">
                        <p className="flex items-center">
                            <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-2" />
                            <strong className="font-semibold text-gray-800">Miembro de Pago:</strong> {existingBusiness.is_paid_member ? 'Sí' : 'No'}
                        </p>
                        {existingBusiness.membership_expires_at && (
                            <p className="flex items-center">
                                <CalendarIcon className="h-5 w-5 text-purple-600 mr-2" />
                                <strong className="font-semibold text-gray-800">Expira:</strong> {formatDateTime(existingBusiness.membership_expires_at)}
                            </p>
                        )}
                        {existingBusiness.last_payment_date && (
                            <p className="flex items-center">
                                <CurrencyDollarIcon className="h-5 w-5 text-blue-600 mr-2" />
                                <strong className="font-semibold text-gray-800">Último Pago:</strong> {formatDate(existingBusiness.last_payment_date)}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <button
                    onClick={handleEditClick}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-105"
                >
                    <ArrowPathIcon className="h-5 w-5 mr-2" /> {/* Icono de editar */}
                    Editar Negocio
                </button>
            </div>
        </div>
    );
}

export default BusinessDisplay;