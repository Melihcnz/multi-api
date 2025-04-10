const mongoose = require('mongoose');

const kitchenOrderSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    tableId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        notes: String,
        status: {
            type: String,
            enum: ['beklemede', 'hazırlanıyor', 'hazır', 'teslim_edildi', 'iptal'],
            default: 'beklemede'
        },
        startTime: Date,
        completionTime: Date,
        estimatedTime: Number // Dakika cinsinden tahmini hazırlanma süresi
    }],
    priority: {
        type: String,
        enum: ['normal', 'yüksek', 'acil'],
        default: 'normal'
    },
    status: {
        type: String,
        enum: ['beklemede', 'hazırlanıyor', 'hazır', 'teslim_edildi', 'iptal'],
        default: 'beklemede'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    notes: String,
    preparationStartTime: Date,
    completionTime: Date,
    notificationSent: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Siparişin toplam hazırlanma süresini hesaplama
kitchenOrderSchema.methods.calculatePreparationTime = function() {
    if (this.completionTime && this.preparationStartTime) {
        return (this.completionTime - this.preparationStartTime) / 1000 / 60; // Dakika cinsinden
    }
    return null;
};

// Sipariş durumunu güncelleme
kitchenOrderSchema.methods.updateStatus = async function(newStatus, itemIndex = null) {
    if (itemIndex !== null) {
        // Tek bir ürünün durumunu güncelle
        this.items[itemIndex].status = newStatus;
        if (newStatus === 'hazırlanıyor') {
            this.items[itemIndex].startTime = new Date();
        } else if (newStatus === 'hazır' || newStatus === 'teslim_edildi') {
            this.items[itemIndex].completionTime = new Date();
        }
    } else {
        // Tüm siparişin durumunu güncelle
        this.status = newStatus;
        if (newStatus === 'hazırlanıyor') {
            this.preparationStartTime = new Date();
        } else if (newStatus === 'hazır' || newStatus === 'teslim_edildi') {
            this.completionTime = new Date();
        }
    }
    await this.save();
};

// Öncelik güncelleme
kitchenOrderSchema.methods.updatePriority = async function(newPriority) {
    this.priority = newPriority;
    await this.save();
};

module.exports = mongoose.model('KitchenOrder', kitchenOrderSchema); 