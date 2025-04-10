const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['sabah', 'akşam', 'gece', 'tam_gün'],
        required: true
    },
    status: {
        type: String,
        enum: ['planlandı', 'başladı', 'tamamlandı', 'iptal'],
        default: 'planlandı'
    },
    breakTime: {
        start: String,
        end: String,
        duration: Number // dakika cinsinden
    },
    overtime: {
        duration: Number, // dakika cinsinden
        approved: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    notes: String
}, {
    timestamps: true
});

// Vardiya süresini hesapla (saat cinsinden)
shiftSchema.methods.calculateDuration = function() {
    const start = new Date(`2000-01-01 ${this.startTime}`);
    const end = new Date(`2000-01-01 ${this.endTime}`);
    return (end - start) / (1000 * 60 * 60);
};

// Fazla mesai kontrolü
shiftSchema.methods.checkOvertime = function() {
    const normalDuration = 8; // Normal mesai saati
    const actualDuration = this.calculateDuration();
    return actualDuration > normalDuration ? (actualDuration - normalDuration) * 60 : 0;
};

module.exports = mongoose.model('Shift', shiftSchema); 