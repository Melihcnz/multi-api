const express = require('express');
const router = express.Router();
const { 
  registerCompany, 
  loginCompany,
  getCompanyProfile,
  updateCompanyProfile
} = require('../controllers/companyController');
const { protect, companyAccess } = require('../middlewares/authMiddleware');

// Firma kaydı ve girişi (public routes)
router.post('/register', registerCompany);
router.post('/login', loginCompany);

// Korumalı firma rotaları
router.get('/profile', protect, companyAccess, getCompanyProfile);
router.put('/profile', protect, companyAccess, updateCompanyProfile);

module.exports = router; 