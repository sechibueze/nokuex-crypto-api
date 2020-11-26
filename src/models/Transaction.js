const mongoose = require('mongoose');
const Agent = require('./Agent');

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  customer:{
    type: Schema.Types.ObjectId,
    ref: Customer,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  agent_username: {
    type: String,
    ref: Agent,
  },
  wallet_address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "processing", "completed"]
  },
  
}, { timestamps: true});

module.exports = Transaction = mongoose.model('transaction', TransactionSchema);