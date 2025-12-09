const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const auth = require('./routes/auth');
const task = require('./routes/task');
const dashboard = require('./routes/dashboard');
const profile = require('./routes/profile');
const api = require('./routes/api');
const { setUser } = require('./middleware/auth');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true
    }
  })
);

app.use(setUser);

app.use('/', auth);
app.use('/', dashboard);
app.use('/', task);
app.use('/', profile);
app.use('/api', api);

app.get('/', (req, res) => {
  return res.redirect('/dashboard');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
