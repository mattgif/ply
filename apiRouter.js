const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const {locations, userStatus, demoUser} = require('./mock');
const {User} = require('./models')
const passport = require('passport');
const config = require('./config');
const {localStrategy} = require('./auth')

const localAuth = passport.authenticate('local', {session: true});

router.use(bodyParser.json());

passport.use(localStrategy);

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
router.post('/login', localAuth, (req, res) => {
	res.json({message: "login succeeded"});
})

router.post('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
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