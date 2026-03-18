const express = require('express');
const router = express.Router();
const { getWarehouses, seedWarehouses } = require('../controllers/warehouseController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getWarehouses);
router.post('/seed', seedWarehouses);

module.exports = router;
