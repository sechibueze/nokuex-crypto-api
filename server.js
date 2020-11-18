const express = require('express');
const { config } = require('dotenv');
config();
const app = express();

const dbConnection = require('./src/config/db.config');
dbConnection()
const apiRoute = require('./src/routes/api');

const PORT = process.env.PORT || 5000;
app.use(express.json({ extended: true }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", 'x-access-token, Content-Type, Access-Control-Allow-Headers');
  res.header("Access-Control-Allow-Methods", 'GET, POST, DELETE, PUT');
  next();
});

app.use('/api', apiRoute);
app.use('/', (req, res) => {
  return res.json({
    message: 'Nokuex OK'
  })
});

app.listen(PORT, () => console.log(`Nokuex api  is on http://localhost:${PORT}`));

module.exports = app;