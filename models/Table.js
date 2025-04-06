const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  tableNumber: {
    type: String,
    required: [true, 'Masa numarası zorunludur'],
    trim: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved'],
    default: 'available'
  },
  capacity: {
    type: Number,
    min: 1
  }
}, {
  timestamps: true
});

// Firma ve masa numarası birlikte eşsiz olmalı
tableSchema.index({ company: 1, tableNumber: 1 }, { unique: true });

const Table = mongoose.model('Table', tableSchema);

module.exports = Table; 