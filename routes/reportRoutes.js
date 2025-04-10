const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { protect } = require('../middlewares/authMiddleware');

// Tüm rotalar için authentication gerekli
router.use(protect);

// Rapor listeleme ve detay
router.get('/', reportController.getReports);
router.get('/:id', reportController.getReportById);
router.delete('/:id', reportController.deleteReport);

// Farklı rapor tipleri için rotalar
router.post('/sales', reportController.createSalesReport);
router.post('/stock', reportController.createStockReport);
router.post('/product', reportController.createProductReport);
router.post('/table', reportController.createTableReport);

module.exports = router; 