import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <AuthProvider>
            <OrderProvider>
                <App />
            </OrderProvider>
        </AuthProvider>
    </BrowserRouter>
);
