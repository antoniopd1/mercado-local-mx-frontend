import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000')  ;

// Función para obtener la configuración de autenticación (para TODAS las rutas)
const getAuthConfig = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        throw new Error("Autenticación requerida. Inicia sesión para acceder a esta función.");
    }

    try {
        const idToken = await user.getIdToken(true); 
        return {
            headers: {
                Authorization: `Bearer ${idToken}`,
            },
        };
    } catch (error) {
        console.error("Error al obtener el token de ID de Firebase:", error);
        throw new Error("No se pudo obtener el token de autenticación. Por favor, vuelve a iniciar sesión.");
    }
};

// --- Funciones para la API de Negocios (Todas requieren autenticación) ---

// Función para obtener todos los negocios, ahora con parámetros de filtro opcionales
export const getBusinesses = async (params = {}) => {
    try {
        const config = await getAuthConfig();
        
        // Se construye la cadena de consulta de manera eficiente
        // Se utiliza el objeto 'params' directamente para generar la URL
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/businesses/${queryString ? `?${queryString}` : ''}`;
        
        const response = await axios.get(url, config);
        
        return response.data;
    } catch (error) {
        console.error('Error al obtener los negocios:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export const getBusinessById = async (businessId) => {
    const config = await getAuthConfig();
    const response = await axios.get(`${API_BASE_URL}/businesses/${businessId}/`, config);
    return response.data;
};

export const getMyBusiness = async () => {
    const config = await getAuthConfig();
    const response = await axios.get(`${API_BASE_URL}/businesses/my_business/`, config);
    return response.data;
};

export const createBusiness = async (businessData) => {
    const config = await getAuthConfig();
    const response = await axios.post(`${API_BASE_URL}/businesses/`, businessData, config);
    return response.data;
};

export const updateBusiness = async (businessId, businessData) => {
    const config = await getAuthConfig();
    const response = await axios.patch(`${API_BASE_URL}/businesses/${businessId}/`, businessData, config);
    return response.data;
};

export const deleteBusiness = async (businessId) => {
    const config = await getAuthConfig();
    const response = await axios.delete(`${API_BASE_URL}/businesses/${businessId}/`, config);
    return response.data;
};

// --- Funciones para la API de Ofertas (Todas requieren autenticación) ---

// getOffers ya acepta un objeto de parámetros para filtros
export const getOffers = async (params = {}) => {
    const config = await getAuthConfig();

    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/offers/${queryString ? `?${queryString}` : ''}`;

    const response = await axios.get(url, config);
    return response.data;
};

export const getMyOffers = async () => {
    const config = await getAuthConfig();
    const response = await axios.get(`${API_BASE_URL}/offers/my_offers/`, config); 
    return response.data;
};

export const getOfferById = async (offerId) => {
    const config = await getAuthConfig();
    const response = await axios.get(`${API_BASE_URL}/offers/${offerId}/`, config);
    return response.data;
};

export const createOffer = async (offerData) => {
    const config = await getAuthConfig();
    const response = await axios.post(`${API_BASE_URL}/offers/`, offerData, config);
    return response.data;
};

export const updateOffer = async (offerId, offerData) => {
    const config = await getAuthConfig();
    const response = await axios.patch(`${API_BASE_URL}/offers/${offerId}/`, offerData, config);
    return response.data;
};

export const deleteOffer = async (offerId) => {
    const config = await getAuthConfig();
    const response = await axios.delete(`${API_BASE_URL}/offers/${offerId}/`, config);
    return response.data;
};

export const getMunicipalities = async () => {
    const config = await getAuthConfig(); 
    const response = await axios.get(`${API_BASE_URL}/businesses/municipalities/`, config);
    return response.data;
};

export const createCheckoutSession = async () => {
    try {
        const config = await getAuthConfig();
        const response = await axios.post(`${API_BASE_URL}/create-checkout-session/`, {}, config);
        return response.data;
    } catch (error) {
        console.error('Error al crear la sesión de checkout:', error.response ? error.response.data : error.message);
        throw error;
    }
};