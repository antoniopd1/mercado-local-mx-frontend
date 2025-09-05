import  { useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { FaStore, FaHandshake, FaChartLine, FaRegCheckCircle, FaDollarSign } from 'react-icons/fa'; // Iconos de ejemplo

const BecomeBusinessPage = () => {
    const { isAuthenticated, isBusinessOwner, isLoading } = useAuthStore();
    const navigate = useNavigate();

    // Redirigir si el usuario ya es dueño de negocio o no está autenticado
    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                navigate('/', { replace: true });
            } else if (isBusinessOwner) {
                navigate('/dashboard/profile', { replace: true });
            }
        }
    }, [isAuthenticated, isBusinessOwner, isLoading, navigate]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <FaSpinner className="animate-spin text-indigo-600 text-5xl mb-4" />
                <p className="text-xl font-semibold text-gray-700">Cargando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-4xl w-full bg-white rounded-xl shadow-2xl overflow-hidden p-8 sm:p-10 border border-gray-200">
                <div className="text-center mb-8">
                    <FaStore className="mx-auto h-20 w-20 text-indigo-600 mb-4 animate-bounce-slow" /> {/* Icono principal */}
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                        ¡Conviértete en Dueño de Negocio!
                    </h1>
                    <p className="text-xl text-gray-600">
                        Impulsa tu comercio local con Mercado Local MX
                    </p>
                </div>

                
                <div className="text-center pt-8 border-t border-gray-200">
                    <button
                        onClick={() => alert("¡Excelente decisión! Por favor, contáctanos en contacto@mercadolocalmx.com para procesar tu pago y activar tu membresía de dueño de negocio. ¡Estamos listos para ayudarte a crecer!")}
                        className="inline-flex items-center px-10 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-xl hover:bg-indigo-700 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 text-xl tracking-wide"
                    >
                        <FaDollarSign className="mr-3 text-2xl" /> Activar Membresía Ahora
                    </button>
                    <p className="text-sm text-gray-500 mt-6">
                        Una vez completado el pago y activada tu membresía, podrás acceder a todas las herramientas para tu negocio.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BecomeBusinessPage;