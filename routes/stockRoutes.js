const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const { protect } = require('../middlewares/authMiddleware');

// Tüm rotalar için authentication gerekli
router.use(protect);

// Stok işlemleri
router.route('/')
    .get(stockController.getAllStocks)
    .post(stockController.createStock);

router.route('/:id')
    .put(stockController.updateStock)
    .delete(stockController.deleteStock);

// Stok geçmişi işlemleri
router.get('/:id/history', stockController.getStockHistory);
router.post('/:id/movements', stockController.addStockMovement);

module.exports = router; 