const express = require('express');
const router = express.Router();
const kitchenController = require('../controllers/kitchenController');
const { protect } = require('../middlewares/authMiddleware');

// Tüm rotalar için authentication gerekli
router.use(protect);

// Mutfak siparişleri route'ları
router.post('/orders', kitchenController.createKitchenOrder);
router.get('/orders', kitchenController.getAllKitchenOrders);
router.get('/orders/active', kitchenController.getActiveKitchenOrders);
router.put('/orders/:orderId/status', kitchenController.updateOrderStatus);
router.put('/orders/:orderId/priority', kitchenController.updateOrderPriority);
router.put('/orders/:orderId/assign', kitchenController.assignOrderToStaff);

module.exports = router; 