const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const User = require('../models/User');

// JWT token doğrulama middleware'i
const protect = async (req, res, next) => {
  let token;

  // Header'dan token'ı al
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Firma veya kullanıcıyı bul
      if (decoded.type === 'company') {
        // Firma girişi
        req.user = await Company.findById(decoded.id).select('-password');
        req.userType = 'company';
      } else {
        // Kullanıcı girişi
        req.user = await User.findById(decoded.id).select('-password');
        req.userType = 'user';
        req.companyId = req.user.company;
      }

      next();
    } catch (error) {
      console.error('Token doğrulama hatası:', error);
      res.status(401).json({ message: 'Yetkilendirme başarısız, geçersiz token' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Yetkilendirme başarısız, token bulunamadı' });
  }
};

// Firma erişimi kontrolü
const companyAccess = (req, res, next) => {
  if (req.userType === 'company') {
    next();
  } else {
    res.status(403).json({ message: 'Bu işlem için firma erişimi gerekiyor' });
  }
};

// Yönetici erişimi kontrolü
const adminAccess = (req, res, next) => {
  if (req.userType === 'user' && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Bu işlem için yönetici erişimi gerekiyor' });
  }
};

module.exports = { protect, companyAccess, adminAccess };