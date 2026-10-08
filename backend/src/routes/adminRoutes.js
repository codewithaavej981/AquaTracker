const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  getAdminStats,
  getAllUsers,
  getAllComplaints,
  updateComplaintStatus,
} = require('../controllers/adminController');

// All routes strictly require Authentication + Admin Authorization
router.use(authMiddleware);
router.use(adminMiddleware);

// Admin Dashboard statistics
router.get('/stats', getAdminStats);

// Admin User listing (read-only)
router.get('/users', getAllUsers);

// Admin Complaints management
router.get('/complaints', getAllComplaints);
router.patch('/complaints/:id/status', updateComplaintStatus);
router.put('/complaints/:id/status', updateComplaintStatus); // Support both PATCH and PUT

module.exports = router;
