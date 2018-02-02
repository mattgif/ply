const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const {locations, userStatus, demoUser} = require('./mock');
const {User} = require('./models')
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('./config');
const {localStrategy, jwtStrategy} = require('./auth')

const localAuth = passport.authenticate('local', {session: false});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
passport.use(localStrategy);

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

router.post('/find_spaces', (req, res) => {
	// req is JSON with either username or location
	// res is array of locations or error
	if (req.body.location) {
		res.json(locations);	
	} else if (req.body.username) {
		let locres = [];
		for (let i=0; i<locations.length; i++) {
			if (locations[i].owner === req.body.username) {
				locres.push(locations[i])
			}
		}
		if (locres.length) {
			res.json(locres);	
		} else {
			res.status(404).json({error: "user not found"})
		}
		
	} else {
		res.status(404).json({error: "user or location not found"});
	}	
})

// user

// router.get('/login', (req, res) => {
// 	res.json(userStatus);
// })

router.post('/login', localAuth, (req, res) => {
	const authToken = createAuthToken(req.user.serialize());
	res.json({authToken});
})

router.post('/logout', (req, res) => {
	userStatus.userName = '';
	userStatus.loggedIn = false;
	res.json(userStatus)
})



// spaces
router.post('/spaces', (req, res) => {
	res.json({'placeholder':'create req received'})
})

router.put('/spaces/:id', (req, res) => {
	res.json({'placeholder':'update req received for space ID: ' + req.body.spaceID})
})

router.delete('/spaces/:id', (req, res) => {
	res.json({'placeholder':'del request received for space ID: ' + req.body.spaceID})
})

module.exports = router;