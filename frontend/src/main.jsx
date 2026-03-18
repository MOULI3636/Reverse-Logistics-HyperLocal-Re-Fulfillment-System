import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';

createRoot(document.getElementById('root')).render(
    <HashRouter>
        <AuthProvider>
            <OrderProvider>
                <App />
            </OrderProvider>
        </AuthProvider>
    </HashRouter>
);
