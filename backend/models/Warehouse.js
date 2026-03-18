const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
    warehouseName: { type: String, required: true },
    location: {
        city: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    inventory: [{
        productName: String,
        orderId: String,
        status: { type: String, enum: ['available', 'dispatched'], default: 'available' }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);
