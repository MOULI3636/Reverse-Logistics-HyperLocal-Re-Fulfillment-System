const Warehouse = require('../models/Warehouse');

const defaultWarehouses = [
    { warehouseName: 'Delhi Central Warehouse', location: { city: 'Delhi', lat: 28.6139, lng: 77.2090 } },
    { warehouseName: 'Mumbai West Warehouse', location: { city: 'Mumbai', lat: 19.0760, lng: 72.8777 } },
    { warehouseName: 'Bangalore South Warehouse', location: { city: 'Bangalore', lat: 12.9716, lng: 77.5946 } },
    { warehouseName: 'Chennai East Warehouse', location: { city: 'Chennai', lat: 13.0827, lng: 80.2707 } }
];

exports.getWarehouses = async (req, res) => {
    try {
        let warehouses = await Warehouse.find();
        if (warehouses.length === 0) {
            warehouses = await Warehouse.insertMany(defaultWarehouses);
        }
        res.json(warehouses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.seedWarehouses = async (req, res) => {
    try {
        await Warehouse.deleteMany({});
        const warehouses = await Warehouse.insertMany(defaultWarehouses);
        res.json({ message: 'Warehouses seeded', warehouses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
