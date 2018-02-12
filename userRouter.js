const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { User } = require('./models');
const mkdirp = require('mkdirp');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', (req, res) => {
	const requiredFields = ['email', 'username', 'firstName', 'lastName', 'password'];

	const missingField = requiredFields.find(field => 
		!(field in req.body));

	if (missingField) {
		res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: missingField + ' is required',
			location: missingField
		});
	}

	const nonStringField = requiredFields.find(field => 
		(field in req.body) && typeof req.body[field] !== 'string');

	if (nonStringField) {
		res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Incorrect field type: expected string',
			location: nonStringField
		});
	}

	const explicitlyTrimmedFields = ['email', 'username', 'password'];

	const nonTrimmedField = explicitlyTrimmedFields.find(field => 
		req.body[field].trim() !== req.body[field]);

	if (nonTrimmedField) {		
		res.status(422).json({
				code: 422,
				reason: 'ValidationError',
				message: nonTrimmedField + ' cannot start or end with whitespace',
				location: nonTrimmedField
			})

}
    const sizedFields = {
		username: {
			min: 3,
			max: 24,
		},
		password: {
			min: 8,
			max: 72
		}
	};

	const tooSmallField = Object.keys(sizedFields).find(field => 
		'min' in sizedFields[field] && req.body[field].trim().length < sizedFields[field].min);
	const tooLargeField = Object.keys(sizedFields).find(field => 
		'max' in sizedFields[field] && req.body[field].trim().length > sizedFields[field].max);

	if (tooSmallField || tooLargeField) {
		res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: tooSmallField
				? tooSmallField + ` must be at least ${sizedFields[tooSmallField].min} characters long`
				: tooLargeField + ` must be at most ${sizedFields[tooLargeField].max} characters long`,
			location: tooSmallField || tooLargeField
		});
	}

	let {email, username, firstName, lastName, password} = req.body;
	firstName = firstName.trim();
	lastName = lastName.trim();
	
	return User
		.find({username})
		.count()
		.then(count => {
			if (count > 0) {
				return Promise.reject({
					code: 422,
					reason: 'ValidationError',
					message: 'Username already taken',
					location: 'username'
				});
			}
			return User
				.find({email})
				.count()
				.then(count => {
					if (count > 0) {
						return Promise.reject({
							code: 422,
							reason: 'ValidationError',
							message: 'User with that email already exists. Try logging in.',
							location: 'email'
						});
					}
					// if no user w/that email (and username) exists, hash PW
					return User.hashPassword(password)
				})
				.then(hash => {
					return User.create({
						email,
						username,
						password: hash,
						firstName,
						lastName,
						spaces: []
					});
				})
				.then(user => {
					mkdirp('./public/userdata/' + user.serialize().username, function (err) {
						if (err) {
							console.error(err)
						} else {
							console.log('dir created')
						}
					});
					// maybe have client handle redirect since it's json?
					res.status(201).redirect(301,'/login').end();
				})
		})
		.catch(err => {
			if (err.reason === 'ValidationError') {
				res.status(err.code).json(err);
			}
			res.status(500).json({code: 500, message: 'Internal server error'});
		})
});

router.get('/:id', (req, res) => {
	res.render('user_spaces', {
		isLoggedIn: req.isLoggedIn,
		username: req.params.id	
	})
});

module.exports = router;