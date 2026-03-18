const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String },
    customerAddress: { type: String },
    customerCoordinates: {
        lat: { type: Number },
        lng: { type: Number }
    },
    product: {
        id: { type: Number },
        name: { type: String },
        category: { type: String },
        price: { type: Number },
        image: { type: String },
        sourceWarehouse: {
            name: { type: String },
            lat: { type: Number },
            lng: { type: Number }
        },
        localWarehouse: {
            name: { type: String },
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    distances: {
        sourceDist: { type: Number },
        localDist: { type: Number }
    },
    calculatedDispatch: { type: String },
    status: {
        type: String,
        enum: ['pending_seller_approval', 'dispatched_local', 'dispatched_source', 'accepted', 'delivered', 'rejected', 'return_requested', 'return_approved', 'returned'],
        default: 'pending_seller_approval'
    },
    returnStatus: {
        type: String,
        default: 'none'
    }
}, { timestamps: true });

orderSchema.pre('save', function (next) {
    if (!this.orderId) {
        this.orderId = 'ORD-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
