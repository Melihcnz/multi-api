const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Atlas bağlantı URL'si
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB'ye bağlanma
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas bağlantısı başarılı');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB }; 