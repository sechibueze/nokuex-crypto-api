const mongoose = require('mongoose');

const dbConnection = _ => {
  const localMongoDbUrl = 'mongodb://localhost:27017/nokuex';
  const uri = process.env.NODE_ENV === 'production' ? process.env.MONGODBURI : localMongoDbUrl ;
  const options = { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };

  mongoose.connect(uri, options,  err => {
    if (err) {
      return console.log('failed to connect to DB ', err);
    }
    return console.log('connect to DB ', uri);
  });
};

module.exports = dbConnection;