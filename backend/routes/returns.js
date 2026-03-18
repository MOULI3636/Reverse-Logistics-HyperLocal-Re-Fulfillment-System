const express = require('express');
const router = express.Router();
const {
    requestReturn,
    getReturns,
    approveReturn,
    rejectReturn,
    inspectReturn,
    repackageReturn,
    addToLocalPool,
    redispatch,
    approveReturnByOrder
} = require('../controllers/returnController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('customer'), requestReturn);
router.get('/', protect, getReturns);
router.put('/:id/approve', protect, authorize('seller'), approveReturn);
router.put('/by-order/:orderId/approve', protect, authorize('seller'), approveReturnByOrder);
router.put('/:id/reject', protect, authorize('seller'), rejectReturn);
router.put('/:id/inspect', protect, authorize('admin'), inspectReturn);
router.put('/:id/repackage', protect, authorize('admin'), repackageReturn);
router.put('/:id/local-pool', protect, authorize('admin'), addToLocalPool);
router.put('/:id/redispatch', protect, authorize('admin'), redispatch);

module.exports = router;
