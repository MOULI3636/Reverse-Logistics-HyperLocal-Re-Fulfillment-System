const mongoose = require('mongoose');

const returnRequestSchema = new mongoose.Schema({
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, default: 'Product not as expected' },
    productCondition: {
        type: String,
        enum: ['unopened', 'like-new', 'used-good', 'used-fair', 'damaged'],
        default: 'like-new'
    },
    productSize: { type: String, default: '' },
    productColor: { type: String, default: '' },
    productBrand: { type: String, default: '' },
    pickupAddress: { type: String, default: '' },
    customerNotes: { type: String, default: '' },
    approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    inspectionStatus: {
        type: String,
        enum: ['pending', 'passed', 'failed'],
        default: 'pending'
    },
    repackaged: { type: Boolean, default: false },
    newShippingLabel: { type: String, default: '' },
    addedToLocalPool: { type: Boolean, default: false },
    assignedWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
    redispatchedTo: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ReturnRequest', returnRequestSchema);
