const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
    stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    previousQuantity: {
        type: Number,
        required: true
    },
    newQuantity: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['giriş', 'çıkış']
    },
    reason: {
        type: String,
        required: true,
        enum: ['satış', 'iade', 'fire', 'sayım', 'transfer', 'diğer']
    },
    notes: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: false
    }
}, {
    timestamps: true
});

// Değişim miktarını hesaplama
stockHistorySchema.virtual('changeAmount').get(function() {
    return this.newQuantity - this.previousQuantity;
});

// Virtuals'ı JSON çıktısına dahil etme
stockHistorySchema.set('toJSON', { virtuals: true });
stockHistorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('StockHistory', stockHistorySchema); 