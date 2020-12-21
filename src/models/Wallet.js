const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const WalletSchema = new Schema({
  owner:{
    type: Schema.Types.ObjectId,
    ref: Customer,
    required: true
  },
  bitcoin_balance: {
    type: Number,
    required: true,
    default: 0
  },
  etherium_balance: {
    type: Number,
    required: true,
    default: 0
  },
  
}, { timestamps: true});

module.exports = Wallet = mongoose.model('wallet', WalletSchema);