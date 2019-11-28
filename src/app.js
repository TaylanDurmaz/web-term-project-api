const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv/config');

const auth = require('./middleware/auth');
const usersRoute = require('./routes/users');
const loginRoute = require('./routes/login');
const clubsRoute = require('./routes/clubs');
const eventsRoute = require('./routes/events');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/login', loginRoute);
app.use('/users', auth, usersRoute);
app.use('/clubs', clubsRoute);
app.use('/events', auth, eventsRoute);

mongoose.connect(
  process.env.DB_CONNECTION_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('CONNECTED'),
);

app.listen(5000);
