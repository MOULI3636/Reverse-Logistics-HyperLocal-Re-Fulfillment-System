const User = require('../models/User');
const Order = require('../models/Order');
const ReturnRequest = require('../models/ReturnRequest');
const Warehouse = require('../models/Warehouse');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

exports.runDemo = async (req, res) => {
    try {
        const steps = [];

        // STEP 1 — Create Customer A and place order from Bangalore
        let customerA = await User.findOne({ email: 'demo.customer.a@test.com' });
        if (!customerA) {
            customerA = await User.create({
                name: 'Customer A (Demo)',
                email: 'demo.customer.a@test.com',
                password: 'demo1234',
                role: 'customer'
            });
        }
        const order = await Order.create({
            productName: 'Premium Cotton T-Shirt – Navy Blue',
            sourceLocation: 'Bangalore',
            deliveryAddress: 'Delhi',
            customer: customerA._id,
            status: 'delivered'
        });
        steps.push({ step: 1, title: 'Customer A places order from Bangalore', detail: `Order ${order.orderId} placed for "${order.productName}"`, data: { orderId: order.orderId } });

        // STEP 2 — Order delivered to Delhi
        steps.push({ step: 2, title: 'Order delivered to Delhi', detail: `Order ${order.orderId} delivered to Delhi`, data: { orderId: order.orderId, deliveryAddress: 'Delhi' } });

        // STEP 3 — Customer A requests return
        order.returnStatus = 'requested';
        await order.save();
        const returnReq = await ReturnRequest.create({
            order: order._id,
            customer: customerA._id,
            reason: 'Size does not fit'
        });
        steps.push({ step: 3, title: 'Customer A requests return', detail: `Return requested for Order ${order.orderId}`, data: { returnId: returnReq._id } });

        // STEP 4 — Seller approves return
        let seller = await User.findOne({ email: 'demo.seller@test.com' });
        if (!seller) {
            seller = await User.create({
                name: 'Seller (Demo)',
                email: 'demo.seller@test.com',
                password: 'demo1234',
                role: 'seller'
            });
        }
        returnReq.approvalStatus = 'approved';
        order.returnStatus = 'approved';
        await returnReq.save();
        await order.save();
        steps.push({ step: 4, title: 'Seller approves return request', detail: 'Return approved by seller', data: { approvalStatus: 'approved' } });

        // STEP 5 — Assign nearest Delhi warehouse
        let warehouses = await Warehouse.find();
        if (warehouses.length === 0) {
            warehouses = await Warehouse.insertMany([
                { warehouseName: 'Delhi Central Warehouse', location: { city: 'Delhi', lat: 28.6139, lng: 77.2090 } },
                { warehouseName: 'Mumbai West Warehouse', location: { city: 'Mumbai', lat: 19.0760, lng: 72.8777 } },
                { warehouseName: 'Bangalore South Warehouse', location: { city: 'Bangalore', lat: 12.9716, lng: 77.5946 } },
                { warehouseName: 'Chennai East Warehouse', location: { city: 'Chennai', lat: 13.0827, lng: 80.2707 } }
            ]);
        }
        const delhiWarehouse = warehouses.find(w => w.location.city === 'Delhi') || warehouses[0];
        returnReq.assignedWarehouse = delhiWarehouse._id;
        await returnReq.save();
        steps.push({ step: 5, title: 'System assigns nearest Delhi warehouse', detail: `Assigned to ${delhiWarehouse.warehouseName}`, data: { warehouse: delhiWarehouse.warehouseName } });

        // STEP 6 — Admin inspects product
        let admin = await User.findOne({ email: 'demo.admin@test.com' });
        if (!admin) {
            admin = await User.create({
                name: 'Admin (Demo)',
                email: 'demo.admin@test.com',
                password: 'demo1234',
                role: 'admin'
            });
        }
        returnReq.inspectionStatus = 'passed';
        order.returnStatus = 'inspected';
        await returnReq.save();
        await order.save();
        steps.push({ step: 6, title: 'Admin inspects the product', detail: 'Inspection passed — product in good condition', data: { inspectionStatus: 'passed' } });

        // STEP 7 — Admin repackages product
        returnReq.repackaged = true;
        returnReq.newShippingLabel = 'LBL-DEMO-' + Date.now().toString(36).toUpperCase();
        order.returnStatus = 'repackaged';
        await returnReq.save();
        await order.save();
        steps.push({ step: 7, title: 'Admin repackages product with new label', detail: `New shipping label: ${returnReq.newShippingLabel}`, data: { label: returnReq.newShippingLabel } });

        // STEP 8 — Add to Local Inventory Pool
        returnReq.addedToLocalPool = true;
        order.returnStatus = 'in-local-pool';
        delhiWarehouse.inventory.push({
            productName: order.productName,
            orderId: order.orderId,
            status: 'available'
        });
        await delhiWarehouse.save();
        await returnReq.save();
        await order.save();
        steps.push({ step: 8, title: 'Product added to Local Inventory Pool', detail: `"${order.productName}" now available at ${delhiWarehouse.warehouseName}`, data: { warehouse: delhiWarehouse.warehouseName } });

        // STEP 9 — Customer B places same order from Delhi
        let customerB = await User.findOne({ email: 'demo.customer.b@test.com' });
        if (!customerB) {
            customerB = await User.create({
                name: 'Customer B (Demo)',
                email: 'demo.customer.b@test.com',
                password: 'demo1234',
                role: 'customer'
            });
        }
        const orderB = await Order.create({
            productName: 'Premium Cotton T-Shirt – Navy Blue',
            sourceLocation: 'Delhi',
            deliveryAddress: 'Delhi',
            customer: customerB._id,
            status: 'placed'
        });
        steps.push({ step: 9, title: 'Customer B places same order from Delhi', detail: `New order ${orderB.orderId} for "${orderB.productName}" in Delhi`, data: { orderId: orderB.orderId } });

        // STEP 10 — System detects locally returned product
        steps.push({ step: 10, title: 'System detects locally returned product', detail: `Found "${order.productName}" in ${delhiWarehouse.warehouseName} local pool`, data: { matchedProduct: order.productName } });

        // STEP 11 — Dispatch locally
        const invItem = delhiWarehouse.inventory.find(i => i.orderId === order.orderId && i.status === 'available');
        if (invItem) invItem.status = 'dispatched';
        await delhiWarehouse.save();
        orderB.status = 'delivered';
        await orderB.save();
        returnReq.redispatchedTo = 'Customer B – Delhi';
        order.returnStatus = 'redispatched';
        await returnReq.save();
        await order.save();
        steps.push({ step: 11, title: 'Product dispatched locally from Delhi warehouse', detail: `"${order.productName}" delivered to Customer B locally — no long-distance shipping!`, data: { dispatchedFrom: delhiWarehouse.warehouseName, deliveredTo: 'Customer B – Delhi' } });

        res.json({
            message: 'Demo simulation completed successfully!',
            steps,
            credentials: {
                customerA: { email: 'demo.customer.a@test.com', password: 'demo1234' },
                customerB: { email: 'demo.customer.b@test.com', password: 'demo1234' },
                seller: { email: 'demo.seller@test.com', password: 'demo1234' },
                admin: { email: 'demo.admin@test.com', password: 'demo1234' }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
