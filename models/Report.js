const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['satış', 'stok', 'personel', 'masa', 'ürün', 'gelir-gider']
    },
    dateRange: {
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
    },
    data: {
        type: mongoose.Schema.Schema.Types.Mixed,
        required: true
    },
    summary: {
        totalAmount: Number,
        totalCount: Number,
        averageAmount: Number,
        compareWithPrevious: {
            percentage: Number,
            trend: {
                type: String,
                enum: ['artış', 'azalış', 'sabit']
            }
        }
    },
    format: {
        type: String,
        enum: ['json', 'pdf', 'excel'],
        default: 'json'
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filters: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    status: {
        type: String,
        enum: ['hazırlanıyor', 'hazır', 'hata'],
        default: 'hazırlanıyor'
    },
    error: {
        message: String,
        code: String,
        details: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Rapor verilerini güncelleme
reportSchema.methods.updateData = async function(newData) {
    this.data = newData;
    this.status = 'hazır';
    await this.save();
};

// Özet bilgileri hesaplama
reportSchema.methods.calculateSummary = function() {
    if (this.type === 'satış') {
        const amounts = this.data.map(item => item.amount);
        this.summary = {
            totalAmount: amounts.reduce((a, b) => a + b, 0),
            totalCount: this.data.length,
            averageAmount: amounts.reduce((a, b) => a + b, 0) / this.data.length
        };
    }
    // Diğer rapor tipleri için hesaplamalar eklenebilir
};

// Önceki dönemle karşılaştırma
reportSchema.methods.compareWithPreviousPeriod = async function() {
    const previousPeriodStart = new Date(this.dateRange.start);
    previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
    
    const previousPeriodEnd = new Date(this.dateRange.end);
    previousPeriodEnd.setMonth(previousPeriodEnd.getMonth() - 1);

    const previousReport = await this.model('Report').findOne({
        company: this.company,
        type: this.type,
        'dateRange.start': previousPeriodStart,
        'dateRange.end': previousPeriodEnd
    });

    if (previousReport && previousReport.summary.totalAmount) {
        const difference = ((this.summary.totalAmount - previousReport.summary.totalAmount) / previousReport.summary.totalAmount) * 100;
        
        this.summary.compareWithPrevious = {
            percentage: difference,
            trend: difference > 0 ? 'artış' : difference < 0 ? 'azalış' : 'sabit'
        };
    }
};

module.exports = mongoose.model('Report', reportSchema); 