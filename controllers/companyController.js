const Company = require('../models/Company');
const jwt = require('jsonwebtoken');

// JWT Token oluşturma fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id, type: 'company' }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Firma Kaydı
const registerCompany = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Email kontrolü
    const companyExists = await Company.findOne({ email });
    if (companyExists) {
      return res.status(400).json({ message: 'Bu email adresine sahip bir firma zaten kayıtlı' });
    }

    // Yeni firma oluştur
    const company = await Company.create({
      name,
      email,
      password, // Şifre model içindeki pre-save middleware'i ile hashlenir
      phone,
      address
    });

    if (company) {
      res.status(201).json({
        message: 'Firma başarıyla kaydedildi',
        company: {
          id: company._id,
          name: company.name,
          email: company.email,
          token: generateToken(company._id)
        }
      });
    }
  } catch (error) {
    console.error('Firma kayıt hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Firma Girişi
const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email ile firmayı bul
    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    // Şifre kontrolü
    const isMatch = await company.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }

    res.json({
      message: 'Giriş başarılı',
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        token: generateToken(company._id)
      }
    });
  } catch (error) {
    console.error('Firma giriş hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Firma Profili Görüntüleme
const getCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.user._id).select('-password');
    if (!company) {
      return res.status(404).json({ message: 'Firma bulunamadı' });
    }
    res.json({ company });
  } catch (error) {
    console.error('Firma profil hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Firma Profili Güncelleme
const updateCompanyProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    const company = await Company.findById(req.user._id);
    if (!company) {
      return res.status(404).json({ message: 'Firma bulunamadı' });
    }

    // Email değiştirilmişse benzersizlik kontrolü yap
    if (email && email !== company.email) {
      const emailExists = await Company.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: 'Bu email adresi zaten kullanımda' });
      }
    }

    // Alanları güncelle
    company.name = name || company.name;
    company.email = email || company.email;
    company.phone = phone || company.phone;
    company.address = address || company.address;

    const updatedCompany = await company.save();

    res.json({
      message: 'Firma profili güncellendi',
      company: {
        id: updatedCompany._id,
        name: updatedCompany.name,
        email: updatedCompany.email,
        phone: updatedCompany.phone,
        address: updatedCompany.address
      }
    });
  } catch (error) {
    console.error('Firma profil güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  registerCompany,
  loginCompany,
  getCompanyProfile,
  updateCompanyProfile
}; 