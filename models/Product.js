const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductCategory'
  },
  name: {
    type: String,
    required: [true, 'Ürün adı zorunludur'],
    trim: true
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: [true, 'Fiyat zorunludur'],
    min: 0
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 