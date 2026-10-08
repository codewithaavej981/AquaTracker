const WaterConsumption = require('../models/WaterConsumption');

// Helper to round numbers to 2 decimal places
const round2 = (num) => Math.round(Number(num) * 100) / 100;

// @desc    Create a new water consumption record
// @route   POST /api/consumption
// @access  Private (authMiddleware)
const createConsumption = async (req, res) => {
  try {
    const { date, morning, afternoon, evening } = req.body;

    // Validate date
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ message: 'Date is required in YYYY-MM-DD format' });
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return res.status(400).json({ message: 'Invalid date format. Expected YYYY-MM-DD' });
    }

    // Validate numeric values
    if (
      morning === undefined || morning === null ||
      afternoon === undefined || afternoon === null ||
      evening === undefined || evening === null
    ) {
      return res.status(400).json({
        message: 'Morning, afternoon, and evening litres are all required',
      });
    }

    const m = Number(morning);
    const a = Number(afternoon);
    const e = Number(evening);

    if (isNaN(m) || isNaN(a) || isNaN(e)) {
      return res.status(400).json({
        message: 'Water consumption values must be valid numbers',
      });
    }

    if (m < 0 || a < 0 || e < 0) {
      return res.status(400).json({
        message: 'Water consumption litres cannot be negative',
      });
    }

    // Compute backend-controlled total (never trust frontend total)
    const computedTotal = round2(m + a + e);

    const record = await WaterConsumption.create({
      userId: req.user._id,
      date,
      morning: round2(m),
      afternoon: round2(a),
      evening: round2(e),
      total: computedTotal,
    });

    return res.status(201).json({
      message: 'Water consumption record saved successfully',
      data: record,
    });
  } catch (error) {
    console.error('Error creating water consumption record:', error.message);
    return res.status(500).json({ message: 'Server error saving consumption record' });
  }
};

// @desc    Get all consumption records for logged-in user
// @route   GET /api/consumption
// @access  Private (authMiddleware)
const getConsumptions = async (req, res) => {
  try {
    const records = await WaterConsumption.find({ userId: req.user._id })
      .sort({ date: -1, createdAt: -1 });

    return res.status(200).json({
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error('Error fetching consumption records:', error.message);
    return res.status(500).json({ message: 'Server error retrieving consumption records' });
  }
};

// @desc    Get consumption statistics for logged-in user
// @route   GET /api/consumption/stats
// @access  Private (authMiddleware)
const getConsumptionStats = async (req, res) => {
  try {
    const records = await WaterConsumption.find({ userId: req.user._id });

    // Today's date YYYY-MM-DD in local/server time
    const todayStr = new Date().toISOString().split('T')[0];
    const currentMonthPrefix = todayStr.substring(0, 7); // YYYY-MM

    let todayIntake = null;
    let monthlyTotal = 0;
    let monthlyDaysCount = 0;
    let lifetimeTotal = 0;

    records.forEach((rec) => {
      lifetimeTotal += rec.total;

      if (rec.date === todayStr) {
        todayIntake = (todayIntake || 0) + rec.total;
      }

      if (rec.date && rec.date.startsWith(currentMonthPrefix)) {
        monthlyTotal += rec.total;
        monthlyDaysCount += 1;
      }
    });

    const monthlyAverage = monthlyDaysCount > 0 ? round2(monthlyTotal / monthlyDaysCount) : null;

    return res.status(200).json({
      todayIntake: todayIntake !== null ? round2(todayIntake) : null,
      monthlyAverage,
      totalEntries: records.length,
      lifetimeTotal: round2(lifetimeTotal),
    });
  } catch (error) {
    console.error('Error fetching consumption stats:', error.message);
    return res.status(500).json({ message: 'Server error computing consumption statistics' });
  }
};

// @desc    Get single consumption record by ID (scoped to logged-in user)
// @route   GET /api/consumption/:id
// @access  Private (authMiddleware)
const getConsumptionById = async (req, res) => {
  try {
    const record = await WaterConsumption.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({ message: 'Water consumption record not found' });
    }

    return res.status(200).json({ data: record });
  } catch (error) {
    console.error('Error fetching consumption record by ID:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Water consumption record not found' });
    }
    return res.status(500).json({ message: 'Server error retrieving consumption record' });
  }
};

// @desc    Update consumption record by ID (scoped to logged-in user)
// @route   PUT /api/consumption/:id
// @access  Private (authMiddleware)
const updateConsumption = async (req, res) => {
  try {
    const record = await WaterConsumption.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({ message: 'Water consumption record not found' });
    }

    const { date, morning, afternoon, evening } = req.body;

    if (date !== undefined) {
      if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: 'Invalid date format. Expected YYYY-MM-DD' });
      }
      record.date = date;
    }

    const m = morning !== undefined ? Number(morning) : record.morning;
    const a = afternoon !== undefined ? Number(afternoon) : record.afternoon;
    const e = evening !== undefined ? Number(evening) : record.evening;

    if (isNaN(m) || isNaN(a) || isNaN(e)) {
      return res.status(400).json({ message: 'Litres must be valid numbers' });
    }

    if (m < 0 || a < 0 || e < 0) {
      return res.status(400).json({ message: 'Litres cannot be negative' });
    }

    record.morning = round2(m);
    record.afternoon = round2(a);
    record.evening = round2(e);
    // Strict backend recalculation
    record.total = round2(m + a + e);

    await record.save();

    return res.status(200).json({
      message: 'Water consumption record updated successfully',
      data: record,
    });
  } catch (error) {
    console.error('Error updating consumption record:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Water consumption record not found' });
    }
    return res.status(500).json({ message: 'Server error updating consumption record' });
  }
};

// @desc    Delete consumption record by ID (scoped to logged-in user)
// @route   DELETE /api/consumption/:id
// @access  Private (authMiddleware)
const deleteConsumption = async (req, res) => {
  try {
    const record = await WaterConsumption.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!record) {
      return res.status(404).json({ message: 'Water consumption record not found' });
    }

    return res.status(200).json({
      message: 'Water consumption record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting consumption record:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Water consumption record not found' });
    }
    return res.status(500).json({ message: 'Server error deleting consumption record' });
  }
};

module.exports = {
  createConsumption,
  getConsumptions,
  getConsumptionStats,
  getConsumptionById,
  updateConsumption,
  deleteConsumption,
};
