const mongoose = require('mongoose');

const waterConsumptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      index: true,
    },
    date: {
      type: String, // Stored as YYYY-MM-DD
      required: [true, 'Date is required'],
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Date must be formatted as YYYY-MM-DD'],
    },
    morning: {
      type: Number,
      required: [true, 'Morning litres are required'],
      min: [0, 'Morning litres cannot be negative'],
    },
    afternoon: {
      type: Number,
      required: [true, 'Afternoon litres are required'],
      min: [0, 'Afternoon litres cannot be negative'],
    },
    evening: {
      type: Number,
      required: [true, 'Evening litres are required'],
      min: [0, 'Evening litres cannot be negative'],
    },
    total: {
      type: Number,
      required: true,
      min: [0, 'Total litres cannot be negative'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'water_consumption',
    versionKey: false,
  }
);

// Compound index for querying user's consumption by date
waterConsumptionSchema.index({ userId: 1, date: -1 });

const WaterConsumption = mongoose.model('WaterConsumption', waterConsumptionSchema);

module.exports = WaterConsumption;
