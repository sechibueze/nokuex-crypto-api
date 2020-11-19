const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RateSchema = new Schema({
  product: {
    type: String,
    required: true,
    trim: true
  },
  trade_type: {
    type: String,
    required: true,
    trim: true
  },
  agent_name: {
    type: String,
    required: true,
    trim: true
  },
  rate_per_usd: {
    type: String,
    required: true,
    trim: true
  },
  min: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  bank: {
    type: String,
    required: true,
    trim: true
  },
}, { timestamps: true});

module.exports = Rate = mongoose.model('Rate', RateSchema);