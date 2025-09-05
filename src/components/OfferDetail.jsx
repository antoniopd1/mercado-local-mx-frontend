import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOfferById } from '../services/apiService'; // Asegúrate de que esta ruta sea correcta
import { toast } from 'react-toastify';

// Importa iconos para una mejor presentación
import {
    FaSpinner, FaMapMarkerAlt, FaPhoneAlt, FaGlobe, FaFacebook, FaInstagram, FaTwitter,
    FaRegCalendarAlt, FaTag, FaStore, FaClock, FaInfoCircle, FaArrowLeft, FaTiktok // Añadido FaTiktok para consistencia
} from 'react-icons/fa';

// Se utiliza la variable de entorno para la URL base de la API.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function OfferDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOfferDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getOfferById(id);
                setOffer(data);
            } catch (err) {
                console.error("Error al cargar los detalles de la oferta:", err);
                if (err.response && err.response.status === 404) {
                    setError("Oferta no encontrada.");
                } else if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError("No tienes permiso para ver esta oferta o tu sesión ha expirado.");
                } else {
                    setError("No se pudieron cargar los detalles de la oferta. Inténtalo de nuevo más tarde.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOfferDetails();
        } else {
            setError("No se proporcionó un ID de oferta.");
            setLoading(false);
        }
    }, [id]);

    // Función para manejar el botón de regreso
    const handleGoBack = () => {
        navigate(-1); // Esto te lleva a la última página en el historial
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex-col">
                <FaSpinner className="animate-spin text-indigo-600 text-6xl mb-4" />
                <p className="text-xl text-indigo-800 font-semibold drop-shadow-sm">Cargando detalles de la oferta...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-red-50 p-6 flex-col text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md relative max-w-md w-full" role="alert">
                    <strong className="font-bold text-xl block mb-2">¡Error!</strong>
                    <span className="block text-lg">{error}</span>
                </div>
                <button
                    onClick={handleGoBack}
                    className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out flex items-center gap-2"
                >
                    <FaArrowLeft /> Volver
                </button>
            </div>
        );
    }

    if (!offer) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6 flex-col text-center">
                <FaInfoCircle className="text-gray-500 text-7xl mb-6 opacity-75" />
                <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Oferta No Disponible</h2>
                <p className="text-xl text-gray-600 max-w-md">La oferta que buscas no existe o ha sido eliminada.</p>
                <button
                    onClick={() => navigate('/offers')} // Redirige a la página de ofertas
                    className="mt-8 px-8 py-4 bg-purple-600 text-white font-bold rounded-full shadow-xl hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-300 ease-in-out transform hover:scale-105"
                >
                    Explorar todas las ofertas
                </button>
            </div>
        );
    }

    // --- Destructuración de datos para mayor claridad ---
    const {
        title, description, original_price, discount_price, image,
        start_date, end_date, is_active, business
    } = offer;

    // Asume que el objeto business viene anidado y tiene los campos completos
    const {
        name: businessName,
        what_they_sell,
        street_address: businessStreet_address,
        contact_phone: businessPhone,
        social_media_facebook_username,
        social_media_instagram_username,
        social_media_tiktok_username, // Agregado Tiktok para consistencia
        hours: businessHours,
        logo: businessLogo,
        municipality // Asegúrate que 'municipality' existe en tu modelo Business
    } = business || {}; // Asegura que business no sea null si la API no lo trae

    const imageUrl = image && (image.startsWith('http') ? image : `${API_BASE_URL}${image}`);
    const businessLogoUrl = businessLogo && (businessLogo.startsWith('http') ? businessLogo : `${API_BASE_URL}${businessLogo}`);

    const uriangatoLocation = "Uriangato, Guanajuato, México";

    return (
        <div className="relative container mx-auto p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
            {/* Botón de regreso flotante */}
            <button
                onClick={handleGoBack}
                className="absolute top-6 left-6 md:top-8 md:left-8 z-10 p-3 bg-white text-indigo-600 rounded-full shadow-lg hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-200 ease-in-out flex items-center justify-center text-xl animate-fade-in"
                title="Volver a la lista de ofertas"
            >
                <FaArrowLeft />
            </button>

            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-3xl overflow-hidden transform transition-all duration-300 ease-in-out hover:shadow-4xl border border-gray-100 animate-slide-up p-6 sm:p-10 md:p-12">
                {/* Sección de la Oferta */}
                <section className="mb-10 pb-8 border-b-2 border-indigo-100">
                    <h1 className="text-5xl font-extrabold text-indigo-900 text-center mb-6 leading-tight">
                        {title}
                    </h1>

                    {imageUrl && (
                        <div className="mb-8 rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                            <img src={imageUrl} alt={title} className="w-full h-96 object-cover object-center transform hover:scale-105 transition-transform duration-500 ease-in-out" />
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
                        <span className="text-6xl font-extrabold text-green-700 leading-none">
                            ${parseFloat(discount_price).toFixed(2)}
                        </span>
                        {original_price && parseFloat(original_price) > parseFloat(discount_price) && (
                            <del className="text-4xl text-gray-500 font-semibold ml-4">
                                ${parseFloat(original_price).toFixed(2)}
                            </del>
                        )}
                    </div>

                    <p className="text-gray-800 text-xl leading-relaxed mb-8 text-center px-4">
                        {description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-base font-medium px-4">
                        <div className="flex items-center bg-indigo-50 p-3 rounded-lg shadow-sm">
                            <FaRegCalendarAlt className="mr-3 text-indigo-600 text-xl" />
                            <span>Válido de: <strong className="text-indigo-800">{new Date(start_date).toLocaleDateString('es-ES')}</strong></span>
                        </div>
                        <div className="flex items-center bg-indigo-50 p-3 rounded-lg shadow-sm">
                            <FaRegCalendarAlt className="mr-3 text-indigo-600 text-xl" />
                            <span>Hasta: <strong className="text-indigo-800">{new Date(end_date).toLocaleDateString('es-ES')}</strong></span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 text-right mt-4 pr-4">Estado: <span className={`font-bold ${is_active ? 'text-green-600' : 'text-red-600'}`}>{is_active ? 'Activa' : 'Inactiva'}</span></p>
                </section>

                {/* Sección de Información del Negocio */}
                {business && (
                    <section className="mt-10 pt-8 border-t-2 border-gray-100">
                        <h2 className="text-4xl font-bold text-indigo-900 text-center mb-8">
                            <FaStore className="inline-block mr-4 text-indigo-600 text-4xl" />
                            Acerca de <span className="text-purple-700">{businessName}</span>
                        </h2>
                        {businessLogoUrl && (
                            <div className="text-center mb-8">
                                <img
                                    src={businessLogoUrl}
                                    alt={`Logo de ${businessName}`}
                                    className="w-40 h-40 object-contain rounded-full shadow-lg border-4 border-indigo-200 mx-auto transform hover:scale-110 transition-transform duration-300 ease-in-out"
                                />
                            </div>
                        )}
                        {what_they_sell && (
                            <p className=" mb-3 flex items-start bg-gray-50 p-4 gap-2 rounded-lg shadow-sm">
                                <FaTag className="mr-4 text-purple-500 text-2xl flex-shrink-0 mt-1" />
                                <strong className="font-semibold mr-2">Productos/Servicios:</strong>
                                <span>{what_they_sell}</span>
                            </p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800 text-lg mb-8">
                            <p className="flex items-start bg-gray-50 p-4 rounded-lg shadow-sm">
                                <FaMapMarkerAlt className="mr-4 text-red-500 text-2xl flex-shrink-0 mt-1" />
                                <strong className="font-semibold mr-2">Dirección:</strong>
                                <span>{businessStreet_address}, {municipality}, {uriangatoLocation}</span>
                            </p>
                            {businessPhone && (
                                <p className="flex items-start bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <FaPhoneAlt className="mr-4 text-green-500 text-2xl flex-shrink-0 mt-1" />
                                    <strong className="font-semibold mr-2">Teléfono:</strong>
                                    <a href={`tel:${businessPhone}`} className="text-blue-600 hover:underline">{businessPhone}</a>
                                </p>
                            )}
                            {businessHours && (
                                <p className="flex items-start md:col-span-2 bg-gray-50 p-4 rounded-lg shadow-sm">
                                    <FaClock className="mr-4 text-blue-500 text-2xl flex-shrink-0 mt-1" />
                                    <strong className="font-semibold mr-2">Horario:</strong>
                                    <span>{businessHours}</span>
                                </p>
                            )}
                        </div>

                        {(social_media_facebook_username || social_media_instagram_username || social_media_tiktok_username) && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-5 text-center">Síguenos en redes:</h3>
                                <div className="flex gap-6 justify-center">
                                    {social_media_facebook_username && (
                                        <a href={`https://facebook.com/${social_media_facebook_username}`} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-800 text-5xl transform hover:scale-110 transition-transform duration-300 ease-in-out" aria-label="Facebook">
                                            <FaFacebook />
                                        </a>
                                    )}
                                    {social_media_instagram_username && (
                                        <a href={`https://instagram.com/${social_media_instagram_username}`} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 text-5xl transform hover:scale-110 transition-transform duration-300 ease-in-out" aria-label="Instagram">
                                            <FaInstagram />
                                        </a>
                                    )}
                                    {social_media_tiktok_username && (
                                        <a href={`https://tiktok.com/${social_media_tiktok_username}`} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-gray-900 text-5xl transform hover:scale-110 transition-transform duration-300 ease-in-out" aria-label="Tiktok">
                                            <FaTiktok />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}

export default OfferDetail;
