const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const {locations, userStatus, demoUser} = require('./mock');
const {Space, User} = require('./models');
const passport = require('passport');
const config = require('./config');
const fileUpload = require('express-fileupload');
const shortId = require('shortid');
const {localStrategy} = require('./auth');

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
				if (locations[i].owner === req.username) {
					// check to see if the ownername matches the user MAKING the request
					locations[i].isOwner = true;
				} else {
					locations[i].isOwner = false;
				}
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
router.post('/spaces', fileUpload(), (req, res) => {
	if (!req.user) {
		res.status(401).redirect('/login');
	} else {
		const requiredFields = ['title', 'street', 'city', 'state', 'zip', 'lat', 'lng']

		const missingField = requiredFields.find(field => 
			!(field in req.body));

		if (missingField) {
			return res.status(422).json({
				code: 422,
				reason: 'ValidationError',
				message: missingField + ' is required',
				location: missingField
			});
		}

		let {title, street, city, state, zip, lat, lng, hourly, 
			daily, monthly, longTerm, electricity, heat, water, 
			bathroom, description, spaceType, type} = req.body;
		const owner = req.user[0].username;
		lng = parseFloat(lng);
		lat = parseFloat(lat);

		let coverImage;		
		if (req.files && req.files.photos) {
			console.log('req.files found:', req.files)
			// check if user uploaded photo and, if so, move it to their dir
			photo = req.files.photos;
			fileName = shortId.generate() + '.jpg';
			coverImage = fileName;
			const filePath = './public/userdata/' + owner + '/' + fileName;
			console.log('filepath created, moving file to', filePath)
			photo.mv(filePath)
		}

		return Space
			.create({
				title,
				type,
				owner,
				description,
				coverImage,
				amenities: {
					electricity: electricity ? true : false,
					heat: heat ? true : false,
					water: water ? true : false,
					bathroom: bathroom ? true : false
				},
				availability: {},
				hourly: hourly ? true : false,
				daily: daily ? true : false,
				monthly: monthly ? true : false,
				longTerm: longTerm ? true : false,
				location: {
					coordinates: [lng, lat]
				}, 
				street,
				city,
				state,
				zip
			})
			.then(space => {				
				return res.status(201).json(space);
			})
			.catch(err => {
				if (err.reason === 'ValidationError') {
					return res.status(err.code).json(err);
				}
				console.error(err)
				res.status(500).json({code: 500, message: 'Internal server error'});
			})
	}
	

	res.json({'placeholder':'create req received'})
})

router.put('/spaces/:id', (req, res) => {
	res.json({'placeholder':'update req received for space ID: ' + req.body.spaceID})
})

router.delete('/spaces/:id', (req, res) => {
	res.json({'placeholder':'del request received for space ID: ' + req.body.spaceID})
})

module.exports = router;