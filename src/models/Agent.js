const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AgentSchema = new Schema({
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
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  profileImage: {
    type: String,
    default: ''
  },
  home_address: {
    type: String,
    required: true,
    trim: true
  },
  bank_name: {
    type: String,
    required: true,
    trim: true
  },
  account_name: {
    type: String,
    required: true,
    trim: true
  },
  account_number: {
    type: String,
    required: true,
    trim: true
  },
  payment_alert: {
    type: Boolean,
    required: true,
    default: false
  },
  email_alert: {
    type: Boolean,
    required: true,
    default: false
  },
  sms_alert: {
    type: Boolean,
    required: true,
    default: false
  },
  roles: {
    type: Array,
    default: ['agent']
  },
}, { timestamps: true});

module.exports = Agent = mongoose.model('agent', AgentSchema);