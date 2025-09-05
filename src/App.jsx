import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from './stores/authStore';

import AuthPage from './components/AuthPage';
import EmailVerificationPrompt from './components/EmailVerificationPrompt';
import Dashboard from './components/Dashboard';
import BecomeBusinessPage from './components/BecomeBusinessPage';
import OfferDetail from './components/OfferDetail';
import HomePage from './components/HomePage';
import ProfilePage from './components/ProfilePage';
import OfferListPage from './components/OfferListPage';
import MyOffersPage from './components/MyOffersPage';
import OfferFormPage from './components/OfferFormPage';
import BusinessDetail from './components/BusinessDetail';
import SubscriptionPage from './components/SubscriptionPage';
import SubscriptionSuccessPage from './components/SubscriptionSuccessPage';
import SubscriptionCanceledPage from './components/SubscriptionCanceledPage';

/**
 * Componente que protege rutas.
 * Redirige a la página de inicio de sesión si el usuario no está autenticado.
 */
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStore();
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl font-semibold text-gray-700">Cargando...</p>
            </div>
        );
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};

/**
 * Componente para rutas que solo deben ser accesibles para usuarios no autenticados.
 * Redirige al dashboard si el usuario ya está logueado.
 */
const PublicOnlyRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStore();
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl font-semibold text-gray-700">Cargando...</p>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col bg-gray-100">
                <Routes>
                    {/* Rutas para usuarios NO autenticados */}
                    <Route path="/" element={<PublicOnlyRoute><AuthPage /></PublicOnlyRoute>} />
                    <Route path="/verify-email" element={<EmailVerificationPrompt />} />

                    {/* Rutas públicas, accesibles para todos (incluso si no están logueados) */}
                    <Route path="/offers/:id" element={<OfferDetail />} />
                    <Route path="/businesses/:id" element={<BusinessDetail />} />
                    <Route path="/subscribe" element={<SubscriptionPage />} />
                    <Route path="/subscription/success" element={<SubscriptionSuccessPage />} />
                    <Route path="/subscription/canceled" element={<SubscriptionCanceledPage />} />

                    {/* Rutas para usuarios AUTENTICADOS */}
                    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
                        <Route index element={<Navigate to="home" replace />} />
                        <Route path="home" element={<HomePage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="offers" element={<OfferListPage />} />
                        <Route path="my-offers" element={<MyOffersPage />} />
                        <Route path="offers/create" element={<OfferFormPage />} />
                        <Route path="offers/:id/edit" element={<OfferFormPage />} />
                        <Route path="become-business" element={<SubscriptionPage />} />
                    </Route>

                    {/* Captura de cualquier otra ruta y redirige al inicio */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <ToastContainer />
            </div>
        </Router>
    );
}

export default App;
