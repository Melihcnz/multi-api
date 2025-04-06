const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  addOrderItem,
  getActiveOrderByTable
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

// Tüm rotalar korumalı (oturum gerektirir)
router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getOrders);

router.route('/:id')
  .get(getOrderById);

// Sipariş durumu güncelleme
router.put('/:id/status', updateOrderStatus);

// Siparişe ürün ekleme
router.post('/:id/items', addOrderItem);

// Masa bazlı aktif sipariş
router.get('/table/:tableId/active', getActiveOrderByTable);

module.exports = router; 