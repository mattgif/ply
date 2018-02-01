const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const {locations, userStatus, demoUser} = require('./mock');

const jsonParser = bodyParser.json();

router.use(bodyParser.urlencoded({ extended: true }));

router.post('/find_spaces', jsonParser, (req, res) => {
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
router.get('/login', (req, res) => {
	res.json(userStatus);
})

router.post('/login', jsonParser, (req, res) => {
	if (demoUser[req.body.email] && demoUser[req.body.email] === req.body['login-password']) {
		userStatus.userName = demoUser[req.body.email];
		userStatus.loggedIn = true;
	}	
	res.json(userStatus);
})

router.post('/logout', (req, res) => {
	userStatus.userName = '';
	userStatus.loggedIn = false;
	res.json(userStatus)
})

router.post('/user', jsonParser, (req, res) => {
	res.json({'placeholder':'created user with email ' + req.body.email})
})

// spaces
router.post('/spaces', (req, res) => {
	res.json({'placeholder':'create req received'})
})

router.put('/spaces/:id', jsonParser, (req, res) => {
	res.json({'placeholder':'update req received for space ID: ' + req.body.spaceID})
})

router.delete('/spaces/:id', jsonParser, (req, res) => {
	res.json({'placeholder':'del request received for space ID: ' + req.body.spaceID})
})

module.exports = router;