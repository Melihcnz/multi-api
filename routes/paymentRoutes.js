const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPayments,
  getPaymentById,
  cancelPayment,
  getPaymentsByInvoice
} = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

// Tüm rotalar korumalı (oturum gerektirir)
router.use(protect);

router.route('/')
  .post(createPayment)
  .get(getPayments);

router.route('/:id')
  .get(getPaymentById);

// Ödeme iptal etme
router.put('/:id/cancel', cancelPayment);

// Fatura bazlı ödemeler
router.get('/invoice/:invoiceId', getPaymentsByInvoice);

module.exports = router; 