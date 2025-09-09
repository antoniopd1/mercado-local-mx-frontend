// frontend/src/components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'react-toastify';

// Importa los nuevos componentes modulares
import BusinessForm from './BusinessForm';
import BusinessDisplay from './BusinessDisplay';

// Importa las funciones del servicio de API
import { getMyBusiness, createBusiness, updateBusiness } from '../services/apiService';
import { MUNICIPALITY_OPTIONS, LOCATION_TYPE_OPTIONS } from '../data/dataBussines';

// Importa el icono de spinner
import { FaSpinner } from 'react-icons/fa'; 

function ProfilePage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();

    const initialFormData = {
        name: '', what_they_sell: '', hours: '', municipality: MUNICIPALITY_OPTIONS[0].value,
        street_address: '', location_type: LOCATION_TYPE_OPTIONS[0].value, contact_phone: '',
        social_media_facebook_username: '', social_media_instagram_username: '',
        social_media_tiktok_username: '', business_type: '',
    };

    const [formData, setFormData] = useState(initialFormData);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreviewUrl, setLogoPreviewUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [businessExists, setBusinessExists] = useState(false);
    const [existingBusiness, setExistingBusiness] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreviewUrl(URL.createObjectURL(file));
        } else {
            setLogoFile(null);
            setLogoPreviewUrl('');
        }
    };

    useEffect(() => {
        return () => {
            if (logoPreviewUrl && logoPreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(logoPreviewUrl);
            }
        };
    }, [logoPreviewUrl]);

    useEffect(() => {
        const fetchUserBusiness = async () => {
            setPageLoading(true);
            if (authLoading || !isAuthenticated || !user) {
                setBusinessExists(false);
                setExistingBusiness(null);
                setFormData(initialFormData); 
                setLogoFile(null);
                setLogoPreviewUrl('');
                setIsEditMode(false);
                setPageLoading(false);
                return;
            }

            try {
                const userBusiness = await getMyBusiness();
                if (userBusiness && Object.keys(userBusiness).length > 0) {
                    setBusinessExists(true);
                    setExistingBusiness(userBusiness);
                    setFormData({
                        name: userBusiness.name || '',
                        what_they_sell: userBusiness.what_they_sell || '',
                        hours: userBusiness.hours || '',
                        municipality: userBusiness.municipality || MUNICIPALITY_OPTIONS[0].value,
                        street_address: userBusiness.street_address || '',
                        location_type: userBusiness.location_type || LOCATION_TYPE_OPTIONS[0].value,
                        contact_phone: userBusiness.contact_phone || '',
                        social_media_facebook_username: userBusiness.social_media_facebook_username || '',
                        social_media_instagram_username: userBusiness.social_media_instagram_username || '',
                        social_media_tiktok_username: userBusiness.social_media_tiktok_username || '',
                        business_type: userBusiness.business_type || ''
                    });
                    setLogoPreviewUrl(userBusiness.logo || '');
                    setLogoFile(null);
                } else {
                    setBusinessExists(false);
                    setExistingBusiness(null);
                    setFormData(initialFormData);
                    setLogoFile(null);
                    setLogoPreviewUrl('');
                }
            } catch (error) {
                console.error("Error al cargar el perfil de negocio:", error);
                if (error.response && error.response.status === 404) {
                    setBusinessExists(false);
                    setExistingBusiness(null);
                } else if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    toast.error("Tu sesión ha expirado o no estás autorizado. Por favor, inicia sesión de nuevo.");
                    setBusinessExists(false);
                    setExistingBusiness(null);
                } else {
                    toast.error("Error inesperado al cargar el perfil de negocio. Inténtalo de nuevo más tarde.");
                    setBusinessExists(false);
                    setExistingBusiness(null);
                }
            } finally {
                setPageLoading(false);
            }
        };

        if (!authLoading && isAuthenticated && user) {
            fetchUserBusiness();
        } else if (!authLoading && !isAuthenticated) {
            setPageLoading(false);
        }
    }, [isAuthenticated, user, authLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!isAuthenticated || !user) {
            toast.error("Debes iniciar sesión para registrar o actualizar un negocio.");
            setIsSubmitting(false);
            return;
        }

        // --- Inicio de la lógica corregida ---
        const dataToSend = new FormData();
        
        // 1. Adjunta cada campo de texto del estado 'formData'
        for (const key in formData) {
            // Se agregan todos los campos del formulario al objeto FormData
            dataToSend.append(key, formData[key]);
        }

        // 2. Adjunta el archivo del logo si existe en el estado 'logoFile'
        if (logoFile) {
            dataToSend.append('logo', logoFile);
        } 
        
        // 3. Maneja el caso de eliminación del logo si el usuario lo quitó del formulario
        // Esta lógica envía una cadena vacía al backend para indicar la eliminación del logo existente.
        else if (isEditMode && existingBusiness?.logo && !logoFile && !logoPreviewUrl) {
            dataToSend.append('logo', '');
        }

        try {
            let response;
            if (isEditMode && existingBusiness) {
                // Se pasa el objeto FormData a la función de la API
                response = await updateBusiness(existingBusiness.id, dataToSend); 
                toast.success("¡Negocio actualizado exitosamente!");
            } else {
                // Se pasa el objeto FormData a la función de la API
                response = await createBusiness(dataToSend); 
                toast.success("¡Negocio registrado exitosamente!");
            }

            setExistingBusiness(response);
            setBusinessExists(true);
            setIsEditMode(false);
            setLogoPreviewUrl(response.logo || '');
            setLogoFile(null);

        } catch (error) {
            console.error("Error al registrar/actualizar negocio:", error);
            if (error.response && error.response.data && error.response.data.detail) {
                toast.error(error.response.data.detail);
                if (error.response.data.detail.includes("Ya tienes un negocio registrado.")) {
                    setBusinessExists(true);
                    setIsEditMode(false);
                }
            } else if (error.response && error.response.data) {
                const errorMessages = Object.values(error.response.data).flat();
                toast.error(`Error: ${errorMessages.join(' ')}`);
            } else {
                toast.error("Error al registrar/actualizar el negocio. Por favor, verifica los datos e intenta de nuevo.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    // --- Fin de la lógica corregida ---

    const handleEditClick = () => {
        if (existingBusiness) {
            setFormData({
                name: existingBusiness.name || '',
                what_they_sell: existingBusiness.what_they_sell || '',
                hours: existingBusiness.hours || '',
                municipality: existingBusiness.municipality || MUNICIPALITY_OPTIONS[0].value,
                street_address: existingBusiness.street_address || '',
                location_type: existingBusiness.location_type || LOCATION_TYPE_OPTIONS[0].value,
                contact_phone: existingBusiness.contact_phone || '',
                social_media_facebook_username: existingBusiness.social_media_facebook_username || '',
                social_media_instagram_username: existingBusiness.social_media_instagram_username || '',
                social_media_tiktok_username: existingBusiness.social_media_tiktok_username || '',
                business_type: existingBusiness.business_type || ''
            });
            setLogoPreviewUrl(existingBusiness.logo || '');
            setLogoFile(null);
            setIsEditMode(true);
        }
    };

    const handleCancelEdit = () => {
        setIsEditMode(false);
        if (existingBusiness) {
            setFormData({
                name: existingBusiness.name || '',
                what_they_sell: existingBusiness.what_they_sell || '',
                hours: existingBusiness.hours || '',
                municipality: existingBusiness.municipality || MUNICIPALITY_OPTIONS[0].value,
                street_address: existingBusiness.street_address || '',
                location_type: existingBusiness.location_type || LOCATION_TYPE_OPTIONS[0].value,
                contact_phone: existingBusiness.contact_phone || '',
                social_media_facebook_username: existingBusiness.social_media_facebook_username || '',
                social_media_instagram_username: existingBusiness.social_media_instagram_username || '',
                social_media_tiktok_username: existingBusiness.social_media_tiktok_username || '',
                business_type: existingBusiness.business_type || ''
            });
            setLogoPreviewUrl(existingBusiness.logo || '');
        } else {
            setFormData(initialFormData);
            setLogoPreviewUrl('');
        }
        setLogoFile(null);
    };

    const handleRemoveLogo = () => {
        setLogoFile(null);
        setLogoPreviewUrl('');
    };

    if (pageLoading || authLoading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[500px] flex-col bg-gray-100">
                <FaSpinner className="animate-spin text-indigo-600 text-5xl mb-4" />
                <p className="text-xl font-semibold text-gray-700">Cargando perfil de negocio...</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 w-full max-w-4xl mx-auto rounded-lg shadow-md my-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-white">Mi Perfil de Negocio</h1>

            {!isAuthenticated ? (
                <div className="text-center p-4 border-l-4 border-yellow-500 text-yellow-700">
                    <p className="font-bold">¡Atención!</p>
                    <p>Para registrar o ver tu negocio, por favor, inicia sesión.</p>
                </div>
            ) : (
                businessExists && !isEditMode && existingBusiness ? (
                    <BusinessDisplay
                        existingBusiness={existingBusiness}
                        handleEditClick={handleEditClick}
                    />
                ) : (
                    <BusinessForm
                        formData={formData}
                        handleChange={handleChange}
                        handleFileChange={handleFileChange}
                        logoPreviewUrl={logoPreviewUrl}
                        handleRemoveLogo={handleRemoveLogo}
                        handleSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        businessExists={businessExists}
                        handleCancelEdit={isEditMode ? handleCancelEdit : null}
                    />
                )
            )}
        </div>
    );
}

export default ProfilePage;