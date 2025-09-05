import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BusinessCard from '../components/BusinessCard';
import { getBusinesses } from '../services/apiService';
import { FaSpinner, FaSearch, FaCity, FaTags } from 'react-icons/fa'; // Importa los nuevos iconos
// Importa las opciones de los filtros, ya que son estáticas
import { MUNICIPALITY_OPTIONS, BUSINESS_TYPE_OPTIONS } from '../data/dataBussines'; 

function HomePage() {
    // Estado principal para la data, carga y errores
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hooks para gestionar la URL
    const location = useLocation();
    const navigate = useNavigate();

    // Estados locales para los filtros, inicializados desde la URL
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBusinessType, setSelectedBusinessType] = useState('');
    const [selectedMunicipality, setSelectedMunicipality] = useState('');

    // Función para analizar la URL y actualizar los estados de los filtros
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setSearchTerm(queryParams.get('search') || '');
        setSelectedBusinessType(queryParams.get('business_type') || '');
        setSelectedMunicipality(queryParams.get('municipality') || '');
    }, [location.search]);

    // Función para obtener los negocios, utilizando los parámetros de la URL
    const fetchBusinesses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams(location.search);
            const params = {
                search: queryParams.get('search') || '',
                business_type: queryParams.get('business_type') || '',
                municipality: queryParams.get('municipality') || '',
            };
            
            const data = await getBusinesses(params);
            setBusinesses(data);
        } catch (err) {
            console.error("Error al cargar los negocios:", err);
            let errorMessage = "No se pudieron cargar los negocios. Intenta de nuevo más tarde.";
            if (err.response && err.response.status === 403) {
                errorMessage = "Acceso denegado. Necesitas iniciar sesión para ver los negocios.";
            } else if (err.response && err.response.data && err.response.data.detail) {
                errorMessage = err.response.data.detail;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [location.search]);

    // Dispara la carga de negocios cada vez que cambia la URL
    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

    // Manejadores de cambios para actualizar el estado local
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleBusinessTypeChange = (event) => {
        setSelectedBusinessType(event.target.value);
    };

    const handleMunicipalityChange = (event) => {
        setSelectedMunicipality(event.target.value);
    };
    
    // Construye la URL y navega para aplicar los filtros
    const handleApplyFilters = () => {
        const newParams = new URLSearchParams();
        if (searchTerm) {
            newParams.set('search', searchTerm);
        }
        if (selectedBusinessType) {
            newParams.set('business_type', selectedBusinessType);
        }
        if (selectedMunicipality) {
            newParams.set('municipality', selectedMunicipality);
        }
        navigate(`?${newParams.toString()}`);
    };

    // Limpia los filtros y navega a la URL base
    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedBusinessType('');
        setSelectedMunicipality('');
        navigate('');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100 flex-col">
                <FaSpinner className="animate-spin text-indigo-600 text-5xl mb-4" />
                <p className="text-xl text-gray-700 font-semibold">Cargando negocios...</p>
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
                    onClick={fetchBusinesses}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen">
            <h1 className="text-4xl font-extrabold text-center text-white mb-8 tracking-tight">
                Negocios Locales
            </h1>

            {/* Nuevo Contenedor de Filtros con un diseño mejorado */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
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
                            onChange={handleSearchChange}
                        />
                    </div>
                    
                    {/* Campo de selección de municipio con icono */}
                    <div className="relative flex-grow w-full md:w-auto">
                        <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 appearance-none"
                            value={selectedMunicipality}
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
                            value={selectedBusinessType}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                {businesses.length > 0 ? (
                    businesses.map(business => (
                        <BusinessCard key={business.id} business={business} />
                    ))
                ) : (
                    <div className="col-span-full text-center p-10 bg-white rounded-lg shadow-md">
                        <p className="text-xl text-gray-600">No se encontraron negocios que coincidan con tu búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;
