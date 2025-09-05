import React from 'react';
import { Link } from 'react-router-dom';

// Obtén la URL base de la API desde las variables de entorno
// En desarrollo, será http://localhost:8000
// En producción, será https://tu-dominio-en-produccion.com
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const BusinessCard = ({ business }) => {
    // Usa la URL base de la API para construir la ruta de la imagen
    // La lógica se encarga de determinar si el logo ya es una URL completa o una ruta relativa
    const imageUrl = business.logo && business.logo.startsWith('http')
        ? business.logo
        : (business.logo ? `${API_BASE_URL}${business.logo}` : null);

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 transform flex flex-col h-full border border-gray-200">
            {/* Sección de la imagen/logo */}
            {imageUrl ? (
                <div className="relative w-full h-48 sm:h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={`Logo de ${business.name}`}
                        className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                    {/* Indicador de miembro de pago */}
                    {business.is_paid_member && (
                        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            Miembro Premium
                        </span>
                    )}
                </div>
            ) : (
                <div className="relative w-full h-48 sm:h-56 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 text-6xl font-extrabold select-none">
                    {business.name ? business.name.charAt(0).toUpperCase() : 'N/A'}
                    {/* Indicador de miembro de pago */}
                    {business.is_paid_member && (
                        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                            Miembro Premium
                        </span>
                    )}
                </div>
            )}

            {/* Contenido de la tarjeta */}
            <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-2xl font-bold mb-3 text-indigo-800 leading-tight">
                    {business.name}
                </h3>

                {/* Se reemplazaron los íconos de 'react-icons' por SVG en línea para evitar errores de compilación y dependencias. */}
                <div className="space-y-2 text-gray-700 text-sm">
                    <p className="flex items-center">
                        <svg className="text-indigo-500 mr-2 flex-shrink-0 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                            <path d="M0 192C0 86 86 0 192 0h128c106 0 192 86 192 192V448h-80V192c0-35.3-28.7-64-64-64H192c-35.3 0-64 28.7-64 64V448H0V192zm224 224a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm-32-96a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
                        </svg>
                        <strong className="font-semibold mr-1">Ofrecen:</strong> {business.what_they_sell || 'No especificado'}
                    </p>
                    <p className="flex items-center">
                        <svg className="text-indigo-500 mr-2 flex-shrink-0 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                            <path d="M256 0c141.4 0 256 114.6 256 256S397.4 512 256 512 0 397.4 0 256 114.6 0 256 0zm0 480c123.7 0 224-100.3 224-224S379.7 32 256 32 32 132.3 32 256s100.3 224 224 224zm-16-192h32V256h64V224h-64V128h-32v96h-64v32h64v96z"/>
                        </svg>
                        <strong className="font-semibold mr-1">Horario:</strong> {business.hours || 'No especificado'}
                    </p>
                    <p className="flex items-center">
                        <svg className="text-indigo-500 mr-2 flex-shrink-0 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor">
                            <path d="M172.268 501.67C24.704 291.31 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-24.704 99.31-172.268 309.67-9.535 13.774-28.948 13.773-38.484 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"/>
                        </svg>
                        <strong className="font-semibold mr-1">Ubicación:</strong> {business.street_address}, {business.municipality}, Uriangato, Guanajuato, México
                    </p>
                    <p className="flex items-center">
                        <svg className="text-indigo-500 mr-2 flex-shrink-0 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="currentColor">
                            <path d="M560 224H416V16a16 16 0 0 0-16-16H176a16 16 0 0 0-16 16v208H16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h144v224a16 16 0 0 0 16 16h224a16 16 0 0 0 16-16V288h144a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM320 288H256v-96h64v96z"/>
                        </svg>
                        <strong className="font-semibold mr-1">Giro:</strong> {business.business_type || 'No especificado'}
                    </p>
                    {business.contact_phone && (
                        <p className="flex items-center">
                            <svg className="text-indigo-500 mr-2 flex-shrink-0 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                                <path d="M497.63 361.26a48 48 0 0 0-35.91-45.74L351.48 290.7a48 48 0 0 0-46.12 11.23l-18.84 14.88c-1.3.87-3.08 1.34-4.79 1.34-1.71 0-3.5-.47-4.79-1.34L256 312.44c-1.3-.87-3.08-1.34-4.79-1.34-1.71 0-3.5.47-4.79 1.34l-18.84 14.88a48 48 0 0 0-46.12-11.23L50.28 315.52a48 48 0 0 0-35.91 45.74l0 100.27a48 48 0 0 0 35.91 45.74l102.13 25.4a48 48 0 0 0 46.12-11.23L256 426.33l62.29 27.02a48 48 0 0 0 46.12 11.23l102.13-25.4a48 48 0 0 0 35.91-45.74L497.63 361.26z"/>
                            </svg>
                            <strong className="font-semibold mr-1">Teléfono:</strong> {business.contact_phone}
                        </p>
                    )}
                </div>

                {/* Redes Sociales - Opcional, con iconos y enlaces discretos */}
                {(business.social_media_facebook_username || business.social_media_instagram_username || business.social_media_tiktok_username) && (
                    <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-3 justify-center">
                        {business.social_media_facebook_username && (
                            <a
                                href={`https://facebook.com/${business.social_media_facebook_username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-700 hover:text-blue-800 transition-colors duration-200"
                                aria-label="Facebook"
                            >
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
                                    <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.79 209.7 245.89V326.68h-41.54v-64.21h41.54v-47.53c0-41.34 25.17-63.78 61.85-63.78 17.58 0 34.6 3.12 34.6 3.12v38.16h-19.56c-19.26 0-25.29 11.95-25.29 24.51v29.62h43.34l-6.92 64.21h-36.42v173.21c119.01-19.1 209.7-122.11 209.7-245.89z"/>
                                </svg>
                            </a>
                        )}
                        {business.social_media_instagram_username && (
                            <a
                                href={`https://instagram.com/${business.social_media_instagram_username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-pink-600 hover:text-pink-700 transition-colors duration-200"
                                aria-label="Instagram"
                            >
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                                    <path d="M224.1 141.6c-48.4 0-87.7 39.3-87.7 87.7s39.3 87.7 87.7 87.7 87.7-39.3 87.7-87.7-39.3-87.7-87.7-87.7zM224 352c-70.7 0-128-57.3-128-128s57.3-128 128-128 128 57.3 128 128-57.3 128-128 128zM448 100.2c-5.5-1.8-11.2-2.7-17.2-2.7-27.6 0-50 22.4-50 50s22.4 50 50 50c6 0 11.7-0.9 17.2-2.7-1.1-12.7-3.2-24.9-6.4-36.5s-6.4-23.2-9.6-34.1c-1.6-5.5-3.1-11-4.7-16.5-1.6-5.5-3.1-11-4.7-16.5c-4-13.8-6.1-28.1-6.1-42.5 0-79.5 64.5-144 144-144s144 64.5 144 144-64.5 144-144 144-144-64.5-144-144c0-14.4 2.1-28.7 6.1-42.5 1.6-5.5 3.1-11 4.7-16.5s3.1-11 4.7-16.5c3.2-11.6 5.3-23.8 6.4-36.5z"/>
                                </svg>
                            </a>
                        )}
                        {business.social_media_tiktok_username && (
                            <a
                                href={`https://tiktok.com/${business.social_media_tiktok_username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-800 hover:text-gray-900 transition-colors duration-200"
                                aria-label="TikTok"
                            >
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor">
                                    <path d="M448 209.9a210.1 210.1 0 0 1-28.4 116.8 206.3 206.3 0 0 1-52.1 68.3 207.6 207.6 0 0 1-72.2 41.5l-40.4 8.1-2.4 12.8-1.6 8.5-1.6 8.5a16 16 0 0 1-13.1 14.5c-6.8 1.4-13.6-1.5-14.7-8.1l-1.4-7.6-1.4-7.6c-.3-1.6-.7-3.1-1.1-4.7s-.8-3.1-1.1-4.7l-4.7-18.7a12.8 12.8 0 0 1 12.1-14.9c5.1-.9 10.3-2.6 15.3-5.2l32.1-16.7c7.4-3.8 11.2-12.7 8.3-20.9-2.9-8.3-12-12.6-20.6-9.1l-34.1 17.7a166 166 0 0 1-56.1-19.3 158.4 158.4 0 0 1-38.6-28.9 161.4 161.4 0 0 1-27.1-39.7A168.1 168.1 0 0 1 32 209.9c0-62.8 38.6-116.8 95.8-135.5A162.7 162.7 0 0 1 209.9 32c62.8 0 116.8 38.6 135.5 95.8a162.7 162.7 0 0 1 19.3 56.1l17.7 34.1c3.5 8.6-.8 17.7-9.1 20.6-8.2 2.9-17.1-1.1-20.9-8.3l-16.7-32.1c-2.6-5-4.3-10.2-5.2-15.3a12.8 12.8 0 0 1 14.9-12.1l18.7 4.7a16 16 0 0 1 14.5 13.1c1.4 6.8-1.5 13.6-8.1 14.7l-7.6 1.4-7.6 1.4c-1.6.3-3.1.7-4.7 1.1a210.1 210.1 0 0 1-116.8 28.4A206.3 206.3 0 0 1 209.9 448c-79.5 0-144-64.5-144-144z"/>
                                </svg>
                            </a>
                        )}
                    </div>
                )}

                {/* Este es el Link para ver los detalles del negocio. */}
                <div className="mt-6">
                    <Link
                        to={`/businesses/${business.id}`}
                        className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 text-base font-semibold shadow-md"
                    >
                        Ver Detalles del Negocio
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BusinessCard;
