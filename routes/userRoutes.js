const express = require('express');
const router = express.Router();
const { 
  createUser,
  loginUser,
  getUsers,
  getUserProfile
} = require('../controllers/userController');
const { protect, companyAccess } = require('../middlewares/authMiddleware');

// Kullanıcı girişi (public route)
router.post('/login', loginUser);

// Kullanıcı oluşturma (sadece firma erişimi)
router.post('/', protect, companyAccess, createUser);

// Kullanıcıları listeleme (sadece firma erişimi)
router.get('/', protect, companyAccess, getUsers);

// Kullanıcı profili (kullanıcı kendisi)
router.get('/profile', protect, getUserProfile);

module.exports = router; 