const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Firma adı zorunludur'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email adresi zorunludur'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur'],
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String
  }
}, {
  timestamps: true // Otomatik olarak createdAt ve updatedAt alanları oluşturur
});

// Şifre şifreleme middleware
companySchema.pre('save', async function(next) {
  // Şifre değişmemişse hash işlemi yapma
  if (!this.isModified('password')) return next();
  
  try {
    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Şifre karşılaştırma metodu
companySchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Company = mongoose.model('Company', companySchema);

module.exports = Company; 