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

const METERS_PER_MILE = 1609.34

router.use(bodyParser.json());
passport.use(localStrategy);

router.post('/find_spaces', (req, res) => {
	// req contains either a location or a username query
	console.log(req.body)
	if (req.body.location) {		
		// search radius (in miles)
		const searchRadius = 10;

		Space
			.find({
				location: { 
					$nearSphere: {
						$geometry: { 
							type: "Point", 
							coordinates: req.body.location.coordinates 
						},
						$maxDistance: searchRadius * METERS_PER_MILE
					}					
				}
			})
			.then(spaces => res.json(spaces))
			.catch(err => {
				console.error(err);
				res.status(500).json({ error: 'uh oh. something went awry.' })
			});
	} else if (req.body.username) {
		console.log('username search started')
		Space
			.find({owner: req.body.username})			
			.then(spaces => {
				console.log("spaces found:\n", spaces)
				if (spaces.length === 0) {									
					return Promise.reject({
						code: 404,
						reason: 'User not found',						
					})
				}
				res.json(spaces)
			})
			.catch(err => {
				console.error(err);
				res.status(500).json(err)
			});
	} else {
		return Promise.reject({
			code: 400,
			reason: 'Invalid query'
		})
		.catch(err => {
			console.error(err);
			res.status(500).json(err)
		});
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
			// check if user uploaded photo and, if so, move it to their dir
			photo = req.files.photos;
			fileName = shortId.generate() + '.jpg';
			coverImage = fileName;
			const filePath = './public/userdata/' + owner + '/' + fileName;			
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

router.put('/spaces/:id', fileUpload(), (req, res) => {
	if (!(req.user)) {
		// make sure user is logged in
		return res.status(401).json({message: "You must be logged in to make this request"});	
	}
	const requester = req.user[0].username;

	const updated = {amenities: {}};
	const topLevelFields = ['title', 'description', 'type'];
	topLevelFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}	
	})

	const amenities = ['electricity', 'heat', 'water', 'bathroom'];
	amenities.forEach(field => {
		if (field in req.body) {
			updated.amenities[field] = true;
		} else {
			updated.amenities[field] = false;
		}
	})

	const availabilityBasics = ['hourly', 'daily', 'monthly', 'longTerm'];
	availabilityBasics.forEach(field => {
		if (field in req.body) {
			updated[field] = true;
		} else {
			updated[field] = false;
		};
	})	

	let photoFile;	
	if (req.files && req.files.photos) {			
		// check if user uploaded photo
		photoFile = req.files.photos;
	}

	Space
		.findById(req.params.id)
		.then(space => {
			if (requester !== space.owner) {
				return Promise.reject({
					code: 401,
					reason: 'Unauthorized',
					message: 'Only the owner of this space can make this request'				
				});
			}		
			
			if (photoFile) {			
			// if user uploaded photo and, if so, move it to their dir
			// TODO: remove or replace old file from server
				fileName = shortId.generate() + '.jpg';				
				const filePath = './public/userdata/' + space.owner + '/' + fileName;			
				photo.mv(filePath)
				space.coverImage = fileName;
			}

			for (field in updated) {
				space[field] = updated[field];
			}	

			return space.save();
		})
		.then(updatedSpace => res.status(204).end())
		.catch(err => {
      		console.error(err);
      		res.status(500).json({ error: 'uh oh. something went awry.' });
    	});
})

router.delete('/spaces/:id', (req, res) => {
	if (!(req.user)) {
		// make sure user is logged in
		return res.status(401).json({message: "You must be logged in to make this request"})	
	}
	const requester = req.user[0].username
	Space
		.findById(req.params.id)
		.then(space => {
			if (requester !== space.owner) {
				return Promise.reject({
					code: 401,
					reason: 'Unauthorized',
					message: 'Only the owner of this space can make this request'					
				});
			}
			space.remove();
		})
		.then(() => {
			console.log(`Deleted space with id ${req.params.id}`);
			res.status(204).end();
		})
		.catch(err => {
      		console.error(err);
      		res.status(500).json({ error: 'uh oh. something went awry.' });
    	});
})

module.exports = router;