const express = require('express');
const app = express();
const morgan = require('morgan');
const ejs = require('ejs');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
require('dotenv').config()
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

const {localStrategy} = require('./auth');
const {User} = require('./models')

mongoose.Promise = global.Promise;

const userRouter = require('./userRouter');
const spacesRouter = require('./spacesRouter');
const apiRouter = require('./apiRouter');

const { PORT, DATABASE_URL, SESSION_DATABASE_URL, SESSION_SECRET } = require('./config');

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

// session store
const store = new MongoDBStore({
  url: SESSION_DATABASE_URL,
  collection: 'sessions'
})
app.use(session({
  secret: SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 *24 * 7 // 1 week    
  },
  store: store,
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  User.find({username: username}, function(err,user) {
    done(null, user);  
  })  
});

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

app.use(function(req, res, next) {
  if (req.user) {
    req.isLoggedIn = true
  } else {
    req.isLoggedIn = false
  }
  next();
})

app.get('/', (req, res) => {  
	res.render('index',{isLoggedIn: req.isLoggedIn});
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