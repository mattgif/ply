const express = require('express');
const app = express();
const morgan = require('morgan');
const ejs = require('ejs');

const userRouter = require('./userRouter');
const spacesRouter = require('./spacesRouter');
const apiRouter = require('./apiRouter');

// authentication packages
const session = require('express-session');

const {locations} = require('./mock')

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

app.use('/spaces', spacesRouter);
app.use('/user', userRouter);
app.use('/api', apiRouter);

app.listen(process.env.PORT || 8080)

module.exports = {app}