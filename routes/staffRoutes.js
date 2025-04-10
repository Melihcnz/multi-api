const express = require('express');
const router = express.Router();
const staffController = require('../controllers/staffController');
const { protect } = require('../middlewares/authMiddleware');

// Tüm rotalar için authentication gerekli
router.use(protect);

// Vardiya rotaları
router.route('/shifts')
    .get(staffController.getShifts)
    .post(staffController.createShift);

router.route('/shifts/:id')
    .put(staffController.updateShift)
    .delete(staffController.deleteShift);

// İzin rotaları
router.route('/leaves')
    .get(staffController.getLeaves)
    .post(staffController.createLeave);

router.route('/leaves/:id')
    .put(staffController.updateLeave)
    .delete(staffController.deleteLeave);

module.exports = router; 