const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    minQuantity: {
        type: Number,
        required: true,
        default: 0
    },
    maxQuantity: {
        type: Number,
        required: false
    },
    unit: {
        type: String,
        required: true,
        enum: ['adet', 'kg', 'lt', 'paket']
    },
    location: {
        type: String,
        required: false
    },
    notes: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Stok miktarı minimum seviyenin altına düştüğünde kontrol
stockSchema.methods.isLowStock = function() {
    return this.quantity <= this.minQuantity;
};

// Stok miktarı maximum seviyeyi aştığında kontrol
stockSchema.methods.isOverStock = function() {
    if (this.maxQuantity) {
        return this.quantity >= this.maxQuantity;
    }
    return false;
};

module.exports = mongoose.model('Stock', stockSchema); 