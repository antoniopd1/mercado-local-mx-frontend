import React from 'react';
import { Link } from 'react-router-dom';
import formatDate from '../utils/dateFormat';

// Importamos los iconos
import { FaCalendarAlt, FaStore } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const OfferCard = ({ offer, children }) => {
    // Se utiliza la variable de entorno para construir la URL de la imagen
    const imageUrl = offer.image && offer.image.startsWith('http')
        ? offer.image
        : (offer.image ? `${API_BASE_URL}${offer.image}` : null);

    return (
        <div className="
            w-[350px] mx-auto sm:w-full sm:max-w-none h-full flex flex-col pb-3 bg-white rounded-xl shadow-lg overflow-hidden
            transition-transform duration-300 ease-in-out group-hover:scale-[1.02] group-hover:shadow-2xl border border-gray-100
        ">
            {/* ENLACE PRINCIPAL: Este Link solo envuelve el contenido clicable de la tarjeta para ir al detalle */}
            <Link to={`/offers/${offer.id}`} className="block h-full flex-grow p-5 sm:p-6 pb-0"> {/* Añadido p-5/p-6 aquí, y pb-0 para que el padding inferior sea gestionado por el div de contenido. Flex-grow para ocupar espacio. */}
                {imageUrl && (
                    <div className="relative w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 mb-4 rounded-md"> {/* Añadido mb-4 y rounded-md para espaciado y consistencia */}
                        <img
                            src={imageUrl}
                            className="w-full h-full object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-105"
                            alt={offer.title}
                        />
                        <div className="absolute top-4 left-4 bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                            Oferta Especial
                        </div>
                    </div>
                )}
                {!imageUrl && (
                    <div className="relative w-full h-56 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 text-6xl font-extrabold select-none flex-shrink-0 mb-4 rounded-md"> {/* Añadido mb-4 y rounded-md */}
                        <span className="text-center p-4 leading-none">{offer.title ? offer.title.charAt(0).toUpperCase() : '¡!'}</span>
                        <div className="absolute top-4 left-4 bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                            Oferta Especial
                        </div>
                    </div>
                )}

                {/* Contenido de texto y detalles, aún dentro del Link principal si queremos que sean clicables */}
                <div className="flex flex-col flex-grow"> {/* Flex-grow aquí para que ocupe el espacio disponible y empuje el resto hacia abajo */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                            <span className="line-clamp-2">
                                {offer.title}
                            </span>
                        </h3>
                        <p className="text-gray-700 text-base mb-4 overflow-hidden leading-relaxed">
                            <span className="line-clamp-3">
                                {offer.description ? offer.description : 'No hay descripción disponible para esta oferta.'}
                            </span>
                        </p>
                        {offer.business?.name && ( // Uso de optional chaining para mayor seguridad
                            <p className="flex items-center text-md text-indigo-600 font-medium mb-3">
                                <FaStore className="mr-2" />
                                <span className="truncate">{offer.business.name}</span>
                            </p>
                        )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-end">
                        <div className="flex flex-col mb-3 sm:mb-0">
                            <span className="text-3xl font-extrabold text-green-600 leading-none">
                                ${parseFloat(offer.discount_price).toFixed(2)}
                            </span>
                            {offer.original_price && parseFloat(offer.original_price) > parseFloat(offer.discount_price) && (
                                <del className="text-lg text-gray-500 ml-1 mt-1">
                                    ${parseFloat(offer.original_price).toFixed(2)}
                                </del>
                            )}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            Válido hasta: <span className="font-semibold ml-1">{formatDate(offer.end_date)}</span>
                        </div>
                    </div>
                </div>
            </Link> {/* CIERRA EL LINK AQUÍ */}

            {/* Acciones de edición/eliminación: ESTÁN FUERA DEL ENLACE PRINCIPAL */}
            {/* Ahora, el 'children' está fuera del Link, eliminando el anidamiento de <a> */}
            {children && (
                <div className="p-5 sm:p-6 pt-0"> {/* Ajustado el padding para el área de botones */}
                    {children}
                </div>
            )}
        </div>
    );
};

export default OfferCard;
