const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Müşteri adı zorunludur'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String
  }
}, {
  timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer; 