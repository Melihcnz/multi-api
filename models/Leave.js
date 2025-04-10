const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
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
    type: {
        type: String,
        enum: ['yıllık', 'hastalık', 'ücretsiz', 'idari', 'diğer'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // Gün sayısı
        required: true
    },
    status: {
        type: String,
        enum: ['beklemede', 'onaylandı', 'reddedildi'],
        default: 'beklemede'
    },
    approver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvalDate: Date,
    reason: {
        type: String,
        required: true
    },
    notes: String,
    attachments: [{
        name: String,
        url: String,
        type: String
    }]
}, {
    timestamps: true
});

// İzin süresini hesapla (iş günü olarak)
leaveSchema.methods.calculateWorkingDays = function() {
    let days = 0;
    let currentDate = new Date(this.startDate);
    
    while (currentDate <= this.endDate) {
        // Hafta sonu günlerini hariç tut (6: Cumartesi, 0: Pazar)
        if (currentDate.getDay() !== 6 && currentDate.getDay() !== 0) {
            days++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
};

// İzin hakkı kontrolü
leaveSchema.statics.checkLeaveBalance = async function(userId, type, year) {
    const totalLeave = await this.aggregate([
        {
            $match: {
                user: mongoose.Types.ObjectId(userId),
                type: type,
                status: 'onaylandı',
                startDate: {
                    $gte: new Date(year, 0, 1),
                    $lte: new Date(year, 11, 31)
                }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$duration' }
            }
        }
    ]);

    return totalLeave.length > 0 ? totalLeave[0].total : 0;
};

module.exports = mongoose.model('Leave', leaveSchema); 