import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import OfferCard from '../components/OfferCard';
import { getOffers, getMyBusiness } from '../services/apiService'; // Asegúrate de que getMyBusiness exista
import { useAuthStore } from '../stores/authStore';
import { MUNICIPALITY_OPTIONS, BUSINESS_TYPE_OPTIONS } from '../data/dataBussines';
import { FaSpinner, FaPlus, FaSearch, FaCity, FaTags } from 'react-icons/fa';

const OfferListPage = () => {
    const [offers, setOffers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [municipalityFilter, setMunicipalityFilter] = useState('');
    const [businessTypeFilter, setBusinessTypeFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [businessExists, setBusinessExists] = useState(false); // Estado para verificar si el negocio existe

    // Usamos las variables directamente del store como pediste
    const { isAuthenticated, isBusinessOwner } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();

    // Función para analizar los parámetros de la URL y establecer los estados iniciales de los filtros
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setSearchTerm(queryParams.get('search') || '');
        setMunicipalityFilter(queryParams.get('municipality') || '');
        setBusinessTypeFilter(queryParams.get('business_type') || '');
    }, [location.search]);

    // Función para construir los parámetros de consulta y cargar las ofertas
    const fetchOffers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams(location.search);
            const params = {};
            if (queryParams.get('search')) {
                params.search = queryParams.get('search');
            }
            if (queryParams.get('municipality')) {
                params.municipality = queryParams.get('municipality');
            }
            if (queryParams.get('business_type')) {
                params.business_type = queryParams.get('business_type');
            }
            const data = await getOffers(params);
            setOffers(data);
        } catch (err) {
            console.error("Error al cargar las ofertas:", err);
            setError("No se pudieron cargar las ofertas. Por favor, inténtalo de nuevo más tarde.");
        } finally {
            setLoading(false);
        }
    }, [location.search]);

    // Disparar la carga de ofertas cuando cambian los parámetros de la URL
    useEffect(() => {
        fetchOffers();
    }, [fetchOffers]);

    // Efecto para verificar si el usuario tiene un negocio registrado
    // Este efecto se ejecuta cada vez que el estado de autenticación cambia
    useEffect(() => {
        const checkBusinessExistence = async () => {
            if (isAuthenticated) {
                try {
                    await getMyBusiness();
                    setBusinessExists(true); // El negocio existe si la llamada es exitosa
                } catch (error) {
                    // Si la respuesta es 404, el negocio no existe. No es un error crítico.
                    if (error.response && error.response.status === 404) {
                        setBusinessExists(false);
                    } else {
                        // Para cualquier otro error, lo registramos para depurar
                        console.error("Error inesperado al verificar el negocio:", error);
                        setBusinessExists(false);
                    }
                }
            } else {
                // Si no hay usuario autenticado, no puede tener un negocio
                setBusinessExists(false);
            }
        };

        checkBusinessExistence();
    }, [isAuthenticated]);

    // Handlers para los cambios en los inputs/selects
    const handleSearchInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleMunicipalityChange = (event) => {
        setMunicipalityFilter(event.target.value);
    };

    const handleBusinessTypeChange = (event) => {
        setBusinessTypeFilter(event.target.value);
    };

    // Función para aplicar los filtros (navega a la URL con los parámetros)
    const handleApplyFilters = () => {
        const currentParams = new URLSearchParams();
        if (searchTerm) {
            currentParams.set('search', searchTerm);
        }
        if (municipalityFilter) {
            currentParams.set('municipality', municipalityFilter);
        }
        if (businessTypeFilter) {
            currentParams.set('business_type', businessTypeFilter);
        }
        navigate(`?${currentParams.toString()}`);
    };

    // Función para limpiar todos los filtros
    const handleClearFilters = () => {
        setSearchTerm('');
        setMunicipalityFilter('');
        setBusinessTypeFilter('');
        navigate('');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 flex-col">
                <FaSpinner className="animate-spin text-indigo-600 text-5xl mb-4" />
                <p className="text-xl text-gray-700 font-semibold">Cargando ofertas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-red-50 p-6 flex-col">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
                    <strong className="font-bold">¡Error!</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
                <button
                    onClick={fetchOffers}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="relative  container mx-auto p-4 md:p-8  min-h-screen ">
            <h1 className="text-4xl font-extrabold text-center text-white mb-8 tracking-tight">
                Explora Todas las Ofertas de la Región
            </h1>

            {/* Nuevo Contenedor de Filtros con un diseño mejorado */}
            <div className="bg-white opacity-95 p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <FaSearch className="mr-2 text-indigo-600" />
                    Filtros de Búsqueda
                </h2>
                <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
                    {/* Campo de búsqueda de texto con icono */}
                    <div className="relative flex-grow w-full md:w-auto">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                            placeholder="Buscar por palabra clave..."
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                        />
                    </div>
                    
                    {/* Campo de selección de municipio con icono */}
                    <div className="relative flex-grow w-full md:w-auto">
                        <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 appearance-none"
                            value={municipalityFilter}
                            onChange={handleMunicipalityChange}
                        >
                            <option value="">Municipio</option>
                            {MUNICIPALITY_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Campo de selección de tipo de negocio con icono */}
                    <div className="relative flex-grow w-full md:w-auto">
                        <FaTags className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 appearance-none"
                            value={businessTypeFilter}
                            onChange={handleBusinessTypeChange}
                        >
                            <option value="">Tipo de negocio</option>
                            {BUSINESS_TYPE_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col-2 sm:flex-row gap-2 mt-auto">
                        <button
                            onClick={handleApplyFilters}
                            className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                        >
                            Aplicar
                        </button>
                        <button
                            onClick={handleClearFilters}
                            className="w-full sm:w-auto px-6 py-2 bg-gray-300 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {offers.length > 0 ? (
                    offers.map(offer => (
                        <OfferCard key={offer.id} offer={offer} />
                    ))
                ) : (
                    <div className="col-span-full text-center p-10 bg-white rounded-lg shadow-md">
                        <p className="text-xl text-gray-600">No se encontraron ofertas que coincidan con tu búsqueda.</p>
                    </div>
                )}
            </div>

            {/* Botón flotante para crear una nueva oferta. */}
            {/* Solo se muestra si el usuario es un propietario de negocio Y existe un negocio ya registrado. */}
            {isBusinessOwner && businessExists && (
                <Link
                    to="/dashboard/offers/create"
                    className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-16 h-16 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition duration-300 ease-in-out transform hover:scale-110"
                >
                    <FaPlus className="text-3xl" />
                </Link>
            )}
        </div>
    );
};

export default OfferListPage;
