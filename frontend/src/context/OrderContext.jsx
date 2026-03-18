import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setOrders([]);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const endpoint = user?.role === 'customer' ? '/orders/my' : '/orders/all';
            const { data } = await API.get(endpoint);
            const formattedOrders = (data || []).map(o => ({
                ...o,
                id: o.orderId,
                date: o.createdAt
            }));
            setOrders(formattedOrders);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    const placeOrder = async (orderConfig) => {
        try {
            const { data } = await API.post('/orders', orderConfig);
            const newOrder = {
                ...data,
                id: data.orderId,
                date: data.createdAt
            };
            setOrders([newOrder, ...orders]);
            return newOrder.id;
        } catch (error) {
            console.error("Error placing order:", error);
            throw error;
        }
    };

    const updateOrderStatus = async (orderId, newStatus, extraData = {}) => {
        try {
            await API.put(`/orders/${orderId}/status`, { status: newStatus, ...extraData });
            const updatedOrders = orders.map(o => {
                if (o.id === orderId) {
                    return { ...o, status: newStatus, ...extraData, updatedAt: new Date().toISOString() };
                }
                return o;
            });
            setOrders(updatedOrders);
        } catch (error) {
            console.error("Error updating order status:", error);
            throw error;
        }
    };

    const approveReturn = async (orderId) => {
        try {
            await API.put(`/returns/by-order/${orderId}/approve`);
            await fetchOrders(); // REFRESH THE ORDERS TO REFLECT STATUS CHANGE
        } catch (error) {
            console.error("Error approving return request:", error);
            throw error;
        }
    };

    const requestReturn = async (orderId) => {
        try {
            await API.post('/returns', { orderId });
            await fetchOrders();
        } catch (error) {
            console.error("Error creating return request:", error);
            throw error;
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            await API.delete(`/orders/${orderId}`);
            const updatedOrders = orders.filter(o => o.id !== orderId);
            setOrders(updatedOrders);
        } catch (error) {
            console.error("Error deleting order:", error);
        }
    };

    return (
        <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus, fetchOrders, requestReturn, approveReturn, deleteOrder }}>
            {children}
        </OrderContext.Provider>
    );
};
