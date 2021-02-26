const mongoose = require('mongoose');
const Transaction = require('./Transaction');

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
  tether_balance: {
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
  tether_address: {
    type: String,
    default: ''
  },
  bitcoin_private_key: {
    type: String,
    default: ''
  },
  ethereum_private_key: {
    type: String,
    default: ''
  },
  tether_private_key: {
    type: String,
    default: ''
  },
  bitcoin_public_key: {
    type: String,
    default: ''
  },
  ethereum_public_key: {
    type: String,
    default: ''
  },
  tether_public_key: {
    type: String,
    default: ''
  },
  bitcoin_wifi: {
    type: String,
    default: ''
  },
  ethereum_wifi: {
    type: String,
    default: ''
  },
  tether_wifi: {
    type: String,
    default: ''
  },
  transaction_list:{
    type: Array,
    default: []
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

CustomerSchema.post('remove', function(next){
  const customerId = this._id;
  Transaction.find({ customer:customerId})
    .then(transx => transx.map(async tx => await tx.remove()))
    .catch(err => console.warn('Failed referencial integrity for Customer'))
    next()
});
module.exports = Customer = mongoose.model('customer', CustomerSchema);