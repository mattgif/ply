const express = require('express');
const app = express();
const morgan = require('morgan');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config()

const {localStrategy, jwtStrategy} = require('./auth');

mongoose.Promise = global.Promise;

const userRouter = require('./userRouter');
const spacesRouter = require('./spacesRouter');
const apiRouter = require('./apiRouter');

const {PORT, DATABASE_URL} = require('./config');

// authentication packages
const session = require('express-session');

app.use(morgan('common'));
app.use(express.static('public'));

app.set('view engine', 'ejs');

// CORS
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.send(204);
    }
    next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

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