const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require('../controllers/productCategoryController');
const { protect } = require('../middlewares/authMiddleware');

// Tüm rotalar korumalı (oturum gerektirir)
router.use(protect);

router.route('/')
  .post(createCategory)
  .get(getCategories);

router.route('/:id')
  .get(getCategoryById)
  .put(updateCategory)
  .delete(deleteCategory);

module.exports = router; 