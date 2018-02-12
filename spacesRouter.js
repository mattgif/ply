const express = require('express');
const router = express.Router();
const { Space } = require('./models');

function locDetailsGenerator(space) {
	// context for space details
	return {
		spaceID: space.spaceID,
		title: space.title,
		image: space.coverImage ? "/userdata/" + space.owner + "/" + space.coverImage : false,
		type: space.type,
		street: space.street,
		city: space.city,		
		state: space.state,
		zip: space.zip,
		lat: space.location.lat,
		lng: space.location.lng,		
		owner: space.owner,
		description: space.description,
		rates: space.rates ? space.rates : false,
		hourlyAvail: space.hourly,
		monthlyAvail: space.monthly,
		dailyAvail: space.daily,
		longTerm: space.longTerm,
		amenities: {
			electricity: space.amenities.electricity,
			heat: space.amenities.heat,
			water: space.amenities.water,
			bathroom: space.amenities.bathroom	
		}		
	}
}

router.get('/create', (req, res) => {
	if (req.user && req.username) {			
		res.render('space_create', {isLoggedIn: req.isLoggedIn, username: req.username})	
	} else {		
		res.redirect(301, '/login')
	}
	
});

router.get('/s', (req, res) => {		
	res.render('results', {isLoggedIn: req.isLoggedIn, username: req.username});
});

router.get('/:id', (req, res) => {
	// inspect cookie for username and compare to space ID owner
	// if match, serve page w/edit button
	Space
		.findOne({spaceID: req.params.id})
		.then(space => {
			const spaceContext = locDetailsGenerator(space);			
			spaceContext.isLoggedIn = !!req.user[0];
			spaceContext.username = req.username;
			res.render('details', spaceContext)
		})
		.catch(err => res.status(500).json({message:  'Internal server error'}));		
});

router.get('/:id/edit', (req, res) => {
	// inspect cookie for username and compare to space ID owner
	// if serve page; else redirect to login
	Space
	.findOne({spaceID: req.params.id})
	.then(space => {
		const spaceContext = locDetailsGenerator(space);
		spaceContext.isLoggedIn = !!req.user[0];
		spaceContext.username = req.username;
		if (req.user[0].username = space.owner) {
			res.render('space_edit', spaceContext);
		} else {
			res.render('details', spaceContext)
		}
	})
});

module.exports = router;