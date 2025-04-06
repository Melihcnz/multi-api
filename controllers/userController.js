const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT Token oluşturma fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id, type: 'user' }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Kullanıcı Ekleme
const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const companyId = req.user._id; // Firma hesabından geliyor (protected + companyAccess)
    
    // Email kontrolü
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Bu email adresine sahip bir kullanıcı zaten kayıtlı' });
    }
    
    // Yeni kullanıcı oluştur
    const user = await User.create({
      company: companyId,
      name,
      email,
      password, // Şifre model içindeki pre-save middleware'i ile hashlenir
      role
    });
    
    if (user) {
      res.status(201).json({
        message: 'Kullanıcı başarıyla oluşturuldu',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
  } catch (error) {
    console.error('Kullanıcı oluşturma hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Kullanıcı Girişi
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Email ile kullanıcıyı bul
    const user = await User.findOne({ email }).populate('company', 'name');
    
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }
    
    // Şifre kontrolü
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz email veya şifre' });
    }
    
    res.json({
      message: 'Giriş başarılı',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: {
          id: user.company._id,
          name: user.company.name
        },
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    console.error('Kullanıcı giriş hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Kullanıcıları Listele
const getUsers = async (req, res) => {
  try {
    const companyId = req.user._id; // Firma hesabından geliyor (protected + companyAccess)
    
    const users = await User.find({ company: companyId }).select('-password');
    
    res.json({ users });
  } catch (error) {
    console.error('Kullanıcı listeleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

// Kullanıcı Profili
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('company', 'name');
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Kullanıcı profil hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası', error: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
  getUserProfile
}; 