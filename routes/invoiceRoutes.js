const express = require('express');
const router = express.Router();
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  getInvoiceByOrder
} = require('../controllers/invoiceController');
const { protect } = require('../middlewares/authMiddleware');

// Tüm rotalar korumalı (oturum gerektirir)
router.use(protect);

router.route('/')
  .post(createInvoice)
  .get(getInvoices);

router.route('/:id')
  .get(getInvoiceById);

// Fatura durumu güncelleme
router.put('/:id/status', updateInvoiceStatus);

// Sipariş bazlı fatura
router.get('/order/:orderId', getInvoiceByOrder);

module.exports = router; 