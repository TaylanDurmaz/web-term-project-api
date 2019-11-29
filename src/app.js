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
const topicsRoute = require('./routes/topics');
const commentsRoute = require('./routes/comments');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/login', loginRoute);
app.use('/users', usersRoute);
app.use('/clubs', clubsRoute);
app.use('/events', eventsRoute);
app.use('/topics', auth, topicsRoute);
app.use('/comments', auth, commentsRoute);

mongoose.connect(
  process.env.DB_CONNECTION_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('CONNECTED'),
);

app.listen(5000);
