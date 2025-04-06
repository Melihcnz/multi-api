const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Kategori adı zorunludur'],
    trim: true
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);

module.exports = ProductCategory; 