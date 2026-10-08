const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createConsumption,
  getConsumptions,
  getConsumptionStats,
  getConsumptionById,
  updateConsumption,
  deleteConsumption,
} = require('../controllers/consumptionController');

// All routes require authenticated user
router.use(authMiddleware);

router.route('/')
  .post(createConsumption)
  .get(getConsumptions);

router.get('/stats', getConsumptionStats);

router.route('/:id')
  .get(getConsumptionById)
  .put(updateConsumption)
  .delete(deleteConsumption);

module.exports = router;
