const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const {locations, userStatus} = require('./mock')
const { Space, User } = require('./models')

function locDetailsGenerator(space) {
	// context for space details
	return {
		spaceID: space.spaceID,
		title: space.title,
		image: "/userdata/" + space.owner + "/" + space.coverImage,
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
		hourlyAvail: space.hourlyAvail,
		monthlyAvail: space.monthlyAvail,
		dailyAvail: space.dailyAvail,
		longTerm: space.longTerm,
		electricity: space.amenities.electricity,
		heat: space.amenities.heat,
		water: space.amenities.water,
		bathroom: space.amenities.bathroom
	}
}

router.get('/create', (req, res) => {
	if (req.user && req.username) {	
		console.log(req.user)
		res.render('space_create', {isLoggedIn: req.isLoggedIn, username: req.username})	
	} else {		
		res.redirect(301, '/login')
	}
	
})

router.get('/s', (req, res) => {		
	res.render('search', {isLoggedIn: req.isLoggedIn, username: req.username});
})

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
		});			
})

router.get('/:id/edit', (req, res) => {
	// inspect cookie for username and compare to space ID owner
	// if serve page; else redirect to login
	const loc = locations.filter((space) => {
		return space.spaceID === req.params.id
	})[0]

	let spaceContext = locDetailsGenerator(loc);
	spaceContext.isLoggedIn = req.isLoggedIn;

	if (userStatus.loggedIn) {
		res.render('space_edit', spaceContext)
	} else {
		res.render('details', spaceContext);		
	}
})

module.exports = router;