const express = require('express');
const router = express.Router();
const {
  createTable,
  getTables,
  getTableById,
  updateTable,
  deleteTable,
  updateTableStatus
} = require('../controllers/tableController');
const { protect } = require('../middlewares/authMiddleware');

// Tüm rotalar korumalı (oturum gerektirir)
router.use(protect);

router.route('/')
  .post(createTable)
  .get(getTables);

router.route('/:id')
  .get(getTableById)
  .put(updateTable)
  .delete(deleteTable);

// Masa durumu güncelleme
router.put('/:id/status', updateTableStatus);

module.exports = router; 