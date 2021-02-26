const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const RateSchema = new Schema({
  bitcoin_rate: {
    type: Number,
    default: 0
  },
  ethereum_rate: {
    type: Number,
    default: 0
  },
  tether_rate: {
    type: Number,
    default: 0
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
}, { timestamps: true});

module.exports = Rate = mongoose.model('Rate', RateSchema);