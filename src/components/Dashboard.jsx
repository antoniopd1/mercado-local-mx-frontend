// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
// Asegúrate de que la ruta sea correcta a tu store de autenticación actualizado
import { useAuthStore } from '../stores/authStore'; 
import { toast } from 'react-toastify';
// Ya no necesitamos getMyBusiness aquí para determinar si es dueño,
// ya que usaremos el custom claim 'isBusinessOwner' del store.
// import { getMyBusiness } from '../services/apiService'; 

function Dashboard() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    // Ahora obtenemos isBusinessOwner directamente del store
    const { isAuthenticated, user, clearAuth, isBusinessOwner, isLoading: authLoading } = useAuthStore(); 
    const navigate = useNavigate();

    // Ya no necesitamos isPaidMember ni loadingBusiness como estado local aquí,
    // porque usaremos isBusinessOwner y isLoading del useAuthStore.
    // const [isPaidMember, setIsPaidMember] = useState(true);
    // const [loadingBusiness, setLoadingBusiness] = useState(true);

    // El useEffect para cargar el estado del negocio se simplifica o elimina,
    // ya que la lógica de isBusinessOwner se maneja en el store.
    // Si aún necesitas cargar los detalles *completos* del negocio para mostrarlos
    // en alguna parte del dashboard (no solo si existe o es pagado),
    // entonces sí, mantendrías una lógica similar, pero con un propósito diferente.
    // Por ahora, lo removemos para simplificar y usar la fuente de verdad (isBusinessOwner del store).
    useEffect(() => {
        // Redirigir si no está autenticado (o mientras carga la autenticación y luego falla)
        if (!authLoading && !isAuthenticated) {
            //toast.error("Necesitas iniciar sesión para acceder al dashboard.");
            navigate('/login');
        }
    }, [isAuthenticated, authLoading, navigate]);


    const handleSignOut = async () => {
        try {
            await signOut(auth);
            clearAuth(); // Limpia el estado de autenticación en Zustand
            toast.info('Sesión cerrada.');
            navigate('/');
        } catch (error) {
            toast.error(`Error al cerrar sesión: ${error.message}`);
            console.error("Error al cerrar sesión:", error);
        }
    };

    // Muestra un mensaje de carga mientras el estado de autenticación se está inicializando
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl font-semibold text-gray-700">Cargando perfil de usuario...</p>
            </div>
        );
    }
    
    // Si no está autenticado después de cargar, redirigimos arriba
    // Esto es un fallback, la redirección principal está en el useEffect.
    if (!isAuthenticated) {
        return null; // O un componente de redirección/mensaje
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 bg-cover bg-center"
            style={{ backgroundImage: 'url("/Uriangato-Guanajuato-principal-1200x500.jpg")' }}
        >
            {/* Navbar */}
            <nav className="bg-white opacity-90 shadow-md p-4 flex items-center justify-between flex-wrap">
                {/* Logo/Nombre de la app */}
                <div className="flex items-center flex-shrink-0 text-gray-800 mr-6">
                    <Link to="/dashboard/home" className="text-2xl font-bold no-underline text-gray-800 hover:text-gray-900">
                        Mercado Local MX
                    </Link>
                </div>

                {/* Botón de menú hamburguesa */}
                <div className="block md:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex items-center px-3 py-2 border rounded text-gray-500 border-gray-600 hover:text-gray-800 hover:border-gray-800"
                    >
                        <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <title>Menú</title>
                            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
                        </svg>
                    </button>
                </div>

                {/* Contenedor de enlaces de navegación y botón de cerrar sesión */}
                <div className={`${isMobileMenuOpen ? 'block' : 'hidden'}  w-full block flex-grow md:flex md:items-center md:w-auto`}>
                    {/* Enlaces de navegación */}
                    <div className="text-sm md:flex-grow">
                        <Link to="/dashboard/home" className="block mt-4 md:inline-block md:mt-0 text-gray-600 hover:text-indigo-600 mr-4 font-medium">Todos los Negocios</Link>
                        
                        {/* Enlace para ver TODAS las ofertas (para todos los usuarios autenticados) */}
                        <Link to="/dashboard/offers" className="block mt-4 md:inline-block md:mt-0 text-gray-600 hover:text-indigo-600 mr-4 font-medium">Todas las Ofertas</Link>

                        {/* Mostrar enlaces específicos de negocio SOLO si isBusinessOwner es true */}
                        {isBusinessOwner && (
                            <>
                                <Link to="/dashboard/my-offers" className="block mt-4 md:inline-block md:mt-0 text-gray-600 hover:text-indigo-600 mr-4 font-medium">Mis Ofertas</Link>
                                <Link to="/dashboard/profile" className="block mt-4 md:inline-block md:mt-0 text-gray-600 hover:text-indigo-600 mr-4 font-medium">Mi Negocio</Link>
                            </>
                        )}
                        {/* Si no es isBusinessOwner, pero está autenticado, podría ver una opción para "Convertirse en Negocio" o "Mi Cuenta de Usuario" */}
                        {!isBusinessOwner && isAuthenticated && (
                            <Link to="/dashboard/become-business" className="block mt-4 md:inline-block md:mt-0 text-gray-600 hover:text-indigo-600 mr-4 font-medium">Conviértete en Negocio</Link>
                        )}
                    </div>
                    {/* Botón de Cerrar Sesión */}
                    <div>
                        <button
                            onClick={handleSignOut}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mt-4 md:mt-0"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            {/* Contenido principal del Dashboard */}
            <main className="flex-grow p-4">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>&copy; {new Date().getFullYear()} Mercado Local MX. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
}

export default Dashboard;