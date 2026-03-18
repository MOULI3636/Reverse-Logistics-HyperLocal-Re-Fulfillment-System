const ReturnRequest = require('../models/ReturnRequest');
const Order = require('../models/Order');
const Warehouse = require('../models/Warehouse');

exports.requestReturn = async (req, res) => {
    try {
        const { orderId, reason, productCondition, productSize, productColor, productBrand, pickupAddress, customerNotes } = req.body;
        const order = await Order.findOne({ orderId });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        if (order.returnStatus && order.returnStatus !== 'none') {
            if (order.status !== 'return_requested' && order.status !== 'return_approved' && order.status !== 'returned') {
                order.status = 'return_requested';
                await order.save();
                return res.status(200).json({ message: 'Return was already requested. Re-synced order status.' });
            }
            return res.status(400).json({ message: 'Return already requested for this order' });
        }
        order.returnStatus = 'requested';
        order.status = 'return_requested';
        await order.save();
        const returnReq = await ReturnRequest.create({
            order: order._id,
            customer: req.user._id,
            reason: reason || 'Product not as expected',
            productCondition: productCondition || 'like-new',
            productSize: productSize || '',
            productColor: productColor || '',
            productBrand: productBrand || '',
            pickupAddress: pickupAddress || '',
            customerNotes: customerNotes || ''
        });
        res.status(201).json(returnReq);
    } catch (error) {
        console.error("RETURN POST ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getReturns = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'customer') filter.customer = req.user._id;
        const returns = await ReturnRequest.find(filter)
            .populate({ path: 'order', select: 'orderId productName sourceLocation deliveryAddress returnStatus' })
            .populate('customer', 'name email')
            .populate('assignedWarehouse', 'warehouseName location')
            .sort('-createdAt');
        res.json(returns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveReturn = async (req, res) => {
    try {
        const returnReq = await ReturnRequest.findById(req.params.id).populate('order');
        if (!returnReq) return res.status(404).json({ message: 'Return request not found' });

        returnReq.approvalStatus = 'approved';
        const order = await Order.findById(returnReq.order._id);
        order.returnStatus = 'approved';

        // Auto-assign nearest warehouse based on delivery address
        const warehouses = await Warehouse.find();
        if (warehouses.length > 0) {
            const deliveryCity = (order.customerAddress || '').toLowerCase();
            let assigned = warehouses.find(w => deliveryCity.includes(w.location.city.toLowerCase()));
            if (!assigned) assigned = warehouses[0];
            returnReq.assignedWarehouse = assigned._id;
        }

        await returnReq.save();
        await order.save();

        const populated = await ReturnRequest.findById(returnReq._id)
            .populate('order')
            .populate('assignedWarehouse', 'warehouseName location');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.approveReturnByOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        const returnReq = await ReturnRequest.findOne({ order: order._id }).populate('order');
        if (!returnReq) return res.status(404).json({ message: 'Return request not found for this order' });

        returnReq.approvalStatus = 'approved';
        order.status = 'return_approved';
        order.returnStatus = 'approved';

        const warehouses = await Warehouse.find();
        if (warehouses.length > 0) {
            const deliveryCity = (order.customerAddress || '').toLowerCase();
            let assigned = warehouses.find(w => deliveryCity.includes(w.location.city.toLowerCase()));
            if (!assigned) assigned = warehouses[0];
            returnReq.assignedWarehouse = assigned._id;
        }

        await returnReq.save();
        await order.save();

        const populated = await ReturnRequest.findById(returnReq._id)
            .populate('order')
            .populate('assignedWarehouse', 'warehouseName location');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rejectReturn = async (req, res) => {
    try {
        const returnReq = await ReturnRequest.findById(req.params.id).populate('order');
        if (!returnReq) return res.status(404).json({ message: 'Return request not found' });
        returnReq.approvalStatus = 'rejected';
        const order = await Order.findById(returnReq.order._id);
        order.returnStatus = 'none';
        await returnReq.save();
        await order.save();
        res.json(returnReq);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.inspectReturn = async (req, res) => {
    try {
        const returnReq = await ReturnRequest.findById(req.params.id).populate('order');
        if (!returnReq) return res.status(404).json({ message: 'Return request not found' });
        returnReq.inspectionStatus = 'passed';
        const order = await Order.findById(returnReq.order._id);
        order.returnStatus = 'inspected';
        await returnReq.save();
        await order.save();
        res.json(returnReq);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.repackageReturn = async (req, res) => {
    try {
        const returnReq = await ReturnRequest.findById(req.params.id)
            .populate('order')
            .populate('assignedWarehouse');
        if (!returnReq) return res.status(404).json({ message: 'Return request not found' });

        returnReq.repackaged = true;
        returnReq.newShippingLabel = 'LBL-' + Date.now().toString(36).toUpperCase();
        const order = await Order.findById(returnReq.order._id);
        order.returnStatus = 'repackaged';
        await returnReq.save();
        await order.save();
        res.json(returnReq);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addToLocalPool = async (req, res) => {
    try {
        const returnReq = await ReturnRequest.findById(req.params.id)
            .populate('order')
            .populate('assignedWarehouse');
        if (!returnReq) return res.status(404).json({ message: 'Return request not found' });

        returnReq.addedToLocalPool = true;
        const order = await Order.findById(returnReq.order._id);
        order.returnStatus = 'in-local-pool';

        // Add to warehouse inventory
        if (returnReq.assignedWarehouse) {
            const warehouse = await Warehouse.findById(returnReq.assignedWarehouse._id);
            warehouse.inventory.push({
                productName: order.productName,
                orderId: order.orderId,
                status: 'available'
            });
            await warehouse.save();
        }

        await returnReq.save();
        await order.save();
        res.json(returnReq);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.redispatch = async (req, res) => {
    try {
        const returnReq = await ReturnRequest.findById(req.params.id)
            .populate('order')
            .populate('assignedWarehouse');
        if (!returnReq) return res.status(404).json({ message: 'Return request not found' });

        const { newCustomerAddress } = req.body;
        returnReq.redispatchedTo = newCustomerAddress || 'Delhi Local Customer';
        const order = await Order.findById(returnReq.order._id);
        order.returnStatus = 'redispatched';

        // Mark warehouse inventory as dispatched
        if (returnReq.assignedWarehouse) {
            const warehouse = await Warehouse.findById(returnReq.assignedWarehouse._id);
            const invItem = warehouse.inventory.find(i => i.orderId === order.orderId && i.status === 'available');
            if (invItem) invItem.status = 'dispatched';
            await warehouse.save();
        }

        await returnReq.save();
        await order.save();
        res.json(returnReq);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
