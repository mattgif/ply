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
const emailValidator = require("email-validator");

const localAuth = passport.authenticate('local', {session: true});

const METERS_PER_MILE = 1609.34

router.use(bodyParser.json());
passport.use(localStrategy);

// user
router.post('/login', localAuth, (req, res) => {
	res.json({message: "login succeeded"});
})

router.post('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
})

router.get('/user/:id', (req, res) => {
	User
		.findOne({username: req.user[0].username})
		.then(user => {res.json(user.serialize())})
})

router.put('/user/:id', (req, res) => {
	if (!(req.user) || !(req.user[0].username === req.params.id)) {
		res.status(401).json({reason: 'Unauthorized'})
	} 	
	const username = req.user[0].username
	const updated = {};
	const updateableFields = ['email', 'firstName', 'lastName', 'password'];
	updateableFields.forEach(field => {
		if (field in req.body) {
			if (typeof req.body[field] !== 'string') {
				return res.status(422).json({
					code: 422,
					reason: 'ValidationError',
					message: 'Incorrect field type: expected string',
					location: field
				})
			}
			updated[field] = req.body[field]
		}
	})

	if (updated.email && !(emailValidator.validate(updated.email))) {
		res.status(400).json({reason: 'ValidationError', message: 'Invalid email address'})
	};

	const sizedFields = {
		password: {
			min: 8,
			max: 72
		}
	};

	if (updated.password && (updated.password.length < 8 || updated.password.length > 72)) {
		res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Password must be between 8 and 72 characters long'
		});
	}

	User.update( {username: username}, {$set: updated})
		.then(user => res.status(204).end())
		.catch(err => res.status(500).json({message:  'Internal server error'}))	
})

router.delete('/user/:id', (req, res) => {
	if (!(req.user) || !(req.user[0].username === req.params.id)) {
		res.status(401).json({reason: 'Unauthorized'})
	} 

	const username = req.user[0].username;
	User
		.remove({username: username})
		.then(Space
			.remove({owner: username}))
			.then(() => {
				console.log(`Deleted user with id ${username} and associated spaces`);
				res.status(204).end();
			})
			.catch(err => {
	      		console.error(err);
	      		res.status(500).json({ error: 'uh oh. something went awry.' });
	    	});
})

// spaces
router.post('/find_spaces', (req, res) => {
	// space search req contains either a location or a username query	
	let username = (req.user && req.user[0]) ? req.user[0].username : false;
	let resArray = [];
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
			.then(spaces => {
				spaces.forEach(space => {
					// check to see if requester is owner
					resArray.push({
						isOwner: username === space.owner,
						space: space
					})
				});
				res.json(resArray)	
			})
			.catch(err => {
				console.error(err);
				res.status(500).json({ error: 'uh oh. something went awry.' })
			});
	} else if (req.body.username) {		
		Space
			.find({owner: req.body.username})			
			.then(spaces => {				
				if (spaces.length === 0) {									
					return Promise.reject({
						code: 404,
						reason: 'No spaces associated with this user found',	
					})
				}
				spaces.forEach(space => {
					// check to see if requester is owner
					resArray.push({
						isOwner: username === space.owner,
						space: space
					})
				})
				res.json(resArray)
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

router.post('/spaces', fileUpload(), (req, res) => {
	// create a new space
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
			bathroom, description, spaceType, dailyRate, hourlyRate, monthlyRate} = req.body;
		const owner = req.user[0].username;
		lng = parseFloat(lng);
		lat = parseFloat(lat);

		let rates = {};
		if (req.body.dailyRate) {
			rates.daily = req.body.dailyRate;
		}	
		if (req.body.hourlyRate) {
			rates.hourly = req.body.hourlyRate;
		}
		if (req.body.monthlyRate) {
			rates.monthly = req.body.monthlyRate;
		}

		let coverImage;		
		if (req.files && req.files.photos) {			
			// check if user uploaded photo and, if so, move it to their dir
			photo = req.files.photos;
			fileName = shortId.generate() + '.jpg';
			coverImage = fileName;
			const filePath = './public/userdata/' + owner + '/' + fileName;			
			photo.mv(filePath)
		}

		const typeNames = {
			grg: 'Garage',
			brn: 'Barn',
			shd: 'Shed',
			stg: 'Storage facility',
			rm: 'Room',
			std: 'Studio',
		}

		return Space
			.create({
				title,
				type: typeNames[spaceType],
				owner,
				description,
				coverImage,				
				amenities: {
					electricity: !!electricity,
					heat: !!heat,
					water: !!water,
					bathroom: !!bathroom,
				},
				availability: {},
				hourly: !!hourly,
				daily: !!daily,
				monthly: !!monthly,
				longTerm: !!longTerm,
				location: {
					coordinates: [lng, lat]
				},
				rates,
				street,
				city,
				state,
				zip
			})
			.then(space => {
				// add spaceID for urls etc
				space.spaceID = shortId.generate() + space.zip
				space.save()				
				res.status(201).json(space);
			})			
			.catch(err => {
				if (err.reason === 'ValidationError') {
					res.status(err.code).json(err);
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

	let rates = {};
	if (req.body.dailyRate) {
		rates.daily = req.body.dailyRate;
	}	
	if (req.body.hourlyRate) {
		rates.hourly = req.body.hourlyRate;
	}
	if (req.body.monthlyRate) {
		rates.monthly = req.body.monthlyRate;
	}
	updated.rates = rates;

	let photoFile;	
	if (req.files && req.files.photos) {			
		// check if user uploaded photo
		photoFile = req.files.photos;
	}

	Space
		.findOne({spaceID: req.params.id})
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
				photoFile.mv(filePath)
				space.coverImage = fileName;
			}

			for (field in updated) {
				space[field] = updated[field];
			}	

			space.save();			
			res.status(204).end()
		})
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
		.findOne({spaceID: req.params.id})
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