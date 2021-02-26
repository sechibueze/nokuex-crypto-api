const mongoose = require('mongoose');
const { SUPPORTED_NETWORKS, SUPPORTED_TRANSACTION_STATUS } = require('./constants');
// const Customer = require('./Customer');

const Schema = mongoose.Schema;
const TransactionSchema = new Schema({
  customer:{
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  network: {
    type: String,
    required: true,
    enum: SUPPORTED_NETWORKS
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  destination_address: {
    type: String,
    default: ''
  },
  txId: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: "PENDING",
    enum: SUPPORTED_TRANSACTION_STATUS
  },
}, { timestamps: true});

module.exports = Transaction = mongoose.model('transaction', TransactionSchema);