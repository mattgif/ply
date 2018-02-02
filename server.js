const express = require('express');
const app = express();
const morgan = require('morgan');
const ejs = require('ejs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const userRouter = require('./userRouter');
const spacesRouter = require('./spacesRouter');
const apiRouter = require('./apiRouter');

const {PORT, DATABASE_URL} = require('./config');

// authentication packages
const session = require('express-session');

app.use(morgan('common'));
app.use(express.static('public'));

app.use(session({
  secret: 'LvtpAbkLobryFMqJWK8l90tLNtqCxV9lm1AELBCzsuswVh6IuYeACSUydL4naPUYyHg0MNUpv5tPMavs',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true }
  // set secure to true once https is enabled
}))

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
	res.render('index');
})

app.get('/login', (req, res) => {
	res.render('login')
});

app.get('/register', (req, res) => {
	res.render('register')
});

app.use('/spaces', spacesRouter);
app.use('/user', userRouter);
app.use('/api', apiRouter);

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }

      server = app.listen(port, () => {
        console.log(`ply server is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer}