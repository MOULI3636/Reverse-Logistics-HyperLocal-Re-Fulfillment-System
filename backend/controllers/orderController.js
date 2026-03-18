const Order = require('../models/Order');
const ReturnRequest = require('../models/ReturnRequest');

exports.createOrder = async (req, res) => {
    try {
        const { product, customerName, customerAddress, customerCoordinates, distances, calculatedDispatch } = req.body;
        const order = await Order.create({
            product,
            customerName,
            customerAddress,
            customerCoordinates,
            distances,
            calculatedDispatch,
            customer: req.user._id,
            status: 'pending_seller_approval'
        });
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user._id }).sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('customer', 'name email').sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId }).populate('customer', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (req.user.role === 'customer') {
            if (status !== 'return_requested') {
                return res.status(403).json({ message: 'Customers can only request returns' });
            }
            const orderCheck = await Order.findOne({ orderId: req.params.orderId });
            if (!orderCheck) return res.status(404).json({ message: 'Order not found' });
            if (orderCheck.customer.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this order' });
            }
        }

        const order = await Order.findOneAndUpdate(
            { orderId: req.params.orderId },
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({ orderId: req.params.orderId });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        await ReturnRequest.findOneAndDelete({ order: order._id });
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
