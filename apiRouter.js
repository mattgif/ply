const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {Space, User} = require('./models');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const shortId = require('shortid');
const {localStrategy} = require('./auth');
const emailValidator = require("email-validator");
const aws = require('aws-sdk');
const fs = require('fs');
// fs is used implicitly by S3 sdk

const { S3_BUCKET, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = require('./config');

const AWS_REGION = 'us-east-2';

aws.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION
});

const s3 = new aws.S3();

const localAuth = passport.authenticate('local', {session: true});

const METERS_PER_MILE = 1609.34;

router.use(bodyParser.json());
passport.use(localStrategy);

function deleteOldPhoto(photoURL) {
    // delete old coverImage from S3 when new one added
    const split = photoURL.split('/');
    const key = split[split.length-1];
    const params = {
        Bucket: S3_BUCKET,
        Delete: {
            Objects: [{
                Key: key,
            }]
        }
    };

    s3.deleteObjects(params, function(err, data) {
        if (err) {
            console.error(err, err.stack)
        } else {
            console.log('s3 item deleted', data);
        }
    })
}
function getPhotoURL(photo, owner) {
    // uploads image to s3 and returns url
    const fileType = photo.mimetype;

    if (fileType !== "image/jpeg" && fileType !== "image/png") {
        return {
            code: 500,
            message: "Invalid image file type",
            reason: 'ValidationError',
        }
    }
    const fileExtension = (fileType === "image/jpeg") ? '.jpg' : '.png';
    const fileName = owner + shortId.generate() + fileExtension;

    const params = {
        "Bucket": S3_BUCKET,
        Key: fileName,
        Body: photo.data,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.putObject(params, function(err, data) {
        if (err) {
            console.error(err, err.stack);
        }
    });
    return `http://${S3_BUCKET}.s3-${AWS_REGION}.amazonaws.com/${fileName}`
}

// user
router.post('/login', localAuth, (req, res) => {
	res.json({message: "login succeeded"});
});

router.post('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
});

router.get('/user/:id', (req, res) => {
    if (!(req.user)) {
        res.status(401).json({message: "Unauthorized"})
    }
	User
		.findOne({username: req.params.id})
		.then(user => {res.json(user.serialize())})
});

router.put('/user/:id', (req, res) => {
	if (!(req.user) || !(req.user[0].username === req.params.id)) {
		res.status(401).json({reason: 'Unauthorized'})
	} 	
	const username = req.user[0].username;
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
	});

	if (updated.email && !(emailValidator.validate(updated.email))) {
		res.status(400).json({reason: 'ValidationError', message: 'Invalid email address'})
    }

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
});

router.delete('/user/:id', (req, res) => {
	if (!(req.user) || !(req.user[0].username === req.params.id)) {
		res.status(401).json({reason: 'Unauthorized'})
	} 

	const username = req.user[0].username;

	Space
		.remove({owner: username})
		.then(() => {
			User
				.remove({username: username})
                .then(() => {
                    res.status(204).end();
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ error: 'uh oh. something went awry.' });
                });
		});
});

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
				});
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
});

router.post('/spaces', fileUpload(), (req, res) => {
	// create a new space
	if (!req.user) {
		res.status(401).redirect('/login');
	} else {
		const requiredFields = ['title', 'street', 'city', 'state', 'zip', 'lat', 'lng'];

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
		if (dailyRate) {
			rates.daily = dailyRate;
		}
		if (hourlyRate) {
			rates.hourly = hourlyRate;
		}
		if (monthlyRate) {
			rates.monthly = monthlyRate;
		}

		let coverImage;
		if (req.files && req.files.photos) {
            // if user uploaded photo, upload to AWS and return url
		    const photoURL = getPhotoURL(req.files.photos, owner);
			if (photoURL.code) {
		        res.status(500).json(photoURL);
            } else {
                coverImage = photoURL;
            }
		} else {
            // if not image uploaded, use placeholder
            coverImage = `http://${S3_BUCKET}.s3-${AWS_REGION}.amazonaws.com/placeholder-min.jpg`;
		};

		const typeNames = {
			grg: 'Garage',
			brn: 'Barn',
			shd: 'Shed',
			stg: 'Storage facility',
			rm: 'Room',
			std: 'Studio',
            oth: 'Other'
		};

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
				space.spaceID = shortId.generate() + space.zip;
				space.save();
				res.status(201).json(space);
			})
			.catch(err => {
				if (err.reason === 'ValidationError') {
					res.status(err.code).json(err);
				}
				console.error(err);
				res.status(500).json({code: 500, message: 'Internal server error'});
			})
	}
	

	res.json({'placeholder':'create req received'})
});

router.put('/spaces/:id', fileUpload(), (req, res) => {	
	if (!(req.user)) {
		// make sure user is logged in
		return res.status(401).json({message: "You must be logged in to make this request"});	
	}
	const requester = req.user[0].username;

	const updated = {amenities: {}};
	const topLevelFields = ['title', 'description', 'spaceType'];
	topLevelFields.forEach(field => {
		if (field in req.body) {
			updated[field] = req.body[field];
		}	
	});

    const typeNames = {
        grg: 'Garage',
        brn: 'Barn',
        shd: 'Shed',
        stg: 'Storage facility',
        rm: 'Room',
        std: 'Studio',
        oth: 'Other'
    };

    if (updated.spaceType) {
        updated.type = typeNames[updated.spaceType];
    };

	const amenities = ['electricity', 'heat', 'water', 'bathroom'];
	amenities.forEach(field => {
		updated.amenities[field] = field in req.body;
	});

	const availabilityBasics = ['hourly', 'daily', 'monthly', 'longTerm'];
	availabilityBasics.forEach(field => {
        updated[field] = (field in req.body)
    });

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
			    deleteOldPhoto(space.coverImage);
                const photoURL = getPhotoURL(photoFile, space.owner);
                if (photoURL.code) {
                    res.status(500).json(photoURL);
                } else {
                    space.coverImage = photoURL;
                }
            };

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
});

router.delete('/spaces/:id', (req, res) => {
	if (!(req.user)) {
		// make sure user is logged in
		return res.status(401).json({message: "You must be logged in to make this request"})	
	}
	const requester = req.user[0].username;
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
});

module.exports = router;