const User = require('../models/User');
const WaterConsumption = require('../models/WaterConsumption');
const Complaint = require('../models/Complaint');

// @desc    Get system-wide metrics and counts for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalConsumptionRecords,
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
    ] = await Promise.all([
      User.countDocuments(),
      WaterConsumption.countDocuments(),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
    ]);

    return res.status(200).json({
      totalUsers,
      totalConsumptionRecords,
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
    });
  } catch (error) {
    console.error('Error in getAdminStats:', error.message);
    return res.status(500).json({ message: 'Server error retrieving admin statistics' });
  }
};

// @desc    Get all registered users (read-only for Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Error in getAllUsers:', error.message);
    return res.status(500).json({ message: 'Server error retrieving registered users' });
  }
};

// @desc    Get all complaints across the platform with filtering
// @route   GET /api/admin/complaints
// @access  Private/Admin
const getAllComplaints = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const filter = {};

    if (status && ['Pending', 'In Progress', 'Resolved'].includes(status)) {
      filter.status = status;
    }

    if (priority && ['Low', 'Medium', 'High'].includes(priority)) {
      filter.priority = priority;
    }

    const complaints = await Complaint.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error('Error in getAllComplaints:', error.message);
    return res.status(500).json({ message: 'Server error retrieving complaints' });
  }
};

// @desc    Update complaint resolution status (Admin only)
// @route   PATCH /api/admin/complaints/:id/status
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Pending', 'In Progress', 'Resolved'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed statuses are: ${allowedStatuses.join(', ')}`,
      });
    }

    const complaint = await Complaint.findById(req.params.id).populate('userId', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint record not found' });
    }

    complaint.status = status;
    complaint.updatedAt = new Date();

    await complaint.save();

    return res.status(200).json({
      message: `Complaint status updated to "${status}" successfully`,
      data: complaint,
    });
  } catch (error) {
    console.error('Error in updateComplaintStatus:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Complaint record not found' });
    }
    return res.status(500).json({ message: 'Server error updating complaint status' });
  }
};

module.exports = {
  getAdminStats,
  getAllUsers,
  getAllComplaints,
  updateComplaintStatus,
};
