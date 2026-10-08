const Complaint = require('../models/Complaint');

const VALID_TYPES = [
  'Water Leakage',
  'No Water Supply',
  'Low Water Pressure',
  'Dirty Water',
  'Pipeline Damage',
  'Other',
];

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

// @desc    Create a new water grievance complaint
// @route   POST /api/complaints
// @access  Private (authMiddleware)
const createComplaint = async (req, res) => {
  try {
    const { type, location, description, priority } = req.body;

    // Validate type
    if (!type || !VALID_TYPES.includes(type)) {
      return res.status(400).json({
        message: `Please select a valid complaint type: ${VALID_TYPES.join(', ')}`,
      });
    }

    // Validate location
    if (!location || typeof location !== 'string' || location.trim().length < 3) {
      return res.status(400).json({
        message: 'Location is required and must be at least 3 characters long',
      });
    }

    // Validate description
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return res.status(400).json({
        message: 'Description is required and must be at least 10 characters long',
      });
    }

    // Validate priority
    const finalPriority = priority && VALID_PRIORITIES.includes(priority) ? priority : 'Medium';

    // Strictly enforce status = 'Pending' for all citizen submissions
    const complaint = await Complaint.create({
      userId: req.user._id,
      type,
      location: location.trim(),
      description: description.trim(),
      priority: finalPriority,
      status: 'Pending', // Force default pending, ignore any client input
    });

    return res.status(201).json({
      message: 'Complaint submitted successfully',
      data: complaint,
    });
  } catch (error) {
    console.error('Error creating complaint:', error.message);
    return res.status(500).json({ message: 'Server error filing complaint' });
  }
};

// @desc    Get all complaints lodged by the logged-in user
// @route   GET /api/complaints
// @access  Private (authMiddleware)
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    console.error('Error fetching complaints:', error.message);
    return res.status(500).json({ message: 'Server error retrieving complaints' });
  }
};

// @desc    Get single complaint by ID (scoped to logged-in user)
// @route   GET /api/complaints/:id
// @access  Private (authMiddleware)
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    return res.status(200).json({ data: complaint });
  } catch (error) {
    console.error('Error fetching complaint by ID:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    return res.status(500).json({ message: 'Server error retrieving complaint' });
  }
};

// @desc    Update complaint details (scoped to logged-in user)
// @route   PUT /api/complaints/:id
// @access  Private (authMiddleware)
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const { type, location, description, priority } = req.body;

    if (type !== undefined) {
      if (!VALID_TYPES.includes(type)) {
        return res.status(400).json({ message: 'Invalid complaint type' });
      }
      complaint.type = type;
    }

    if (location !== undefined) {
      if (typeof location !== 'string' || location.trim().length < 3) {
        return res.status(400).json({ message: 'Location must be at least 3 characters' });
      }
      complaint.location = location.trim();
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim().length < 10) {
        return res.status(400).json({ message: 'Description must be at least 10 characters' });
      }
      complaint.description = description.trim();
    }

    if (priority !== undefined) {
      if (!VALID_PRIORITIES.includes(priority)) {
        return res.status(400).json({ message: 'Invalid priority level' });
      }
      complaint.priority = priority;
    }

    // Citizens CANNOT alter complaint status.
    // If req.body.status is provided, we intentionally ignore it to protect administrative workflow.
    complaint.updatedAt = new Date();

    await complaint.save();

    return res.status(200).json({
      message: 'Complaint updated successfully',
      data: complaint,
    });
  } catch (error) {
    console.error('Error updating complaint:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    return res.status(500).json({ message: 'Server error updating complaint' });
  }
};

// @desc    Delete complaint (scoped to logged-in user)
// @route   DELETE /api/complaints/:id
// @access  Private (authMiddleware)
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    return res.status(200).json({
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting complaint:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    return res.status(500).json({ message: 'Server error deleting complaint' });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};
