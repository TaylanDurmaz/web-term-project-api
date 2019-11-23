const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

const usersRoute = require('./routes/users');
const clubsRoute = require('./routes/clubs');

const app = express();
app.use(bodyParser.json());

app.use('/clubs', clubsRoute);
app.use('/users', usersRoute);

mongoose.connect(
  process.env.DB_CONNECTION_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('conneted'),
);

app.listen(5000);
