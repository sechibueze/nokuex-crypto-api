const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  firstname: {
    type: String,
    required: true,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  bitcoin_balance: {
    type: Number,
    default: 0,
  },
  ethereum_balance: {
    type: Number,
    default: 0,
  },
  binance_balance: {
    type: Number,
    default: 0,
  },
  bitcoin_address: {
    type: String,
    default: ''
  },
  ethereum_address: {
    type: String,
    default: ''
  },
  binance_address: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  roles: {
    type: Array,
    default: ['customer']
  },
}, { timestamps: true});

module.exports = Customer = mongoose.model('customer', CustomerSchema);