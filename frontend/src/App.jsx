import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DemoSimulation from './pages/DemoSimulation';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ShoppingPage from './pages/ShoppingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CustomerSetupPage from './pages/CustomerSetupPage';
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin"></div></div>;
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
};
function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/demo" element={<DemoSimulation />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/setup" element={<ProtectedRoute allowedRoles={['customer']}><CustomerSetupPage /></ProtectedRoute>} />
                <Route path="/seller" element={<ProtectedRoute allowedRoles={['seller']}><SellerDashboard /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/shop" element={<ShoppingPage />} />
            </Routes>
        </>
    );
}

export default App;
