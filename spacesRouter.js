const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const {locations, userStatus} = require('./mock')

function locDetailsGenerator(loc) {
	// generator for returning location data
	return {
		spaceID: loc.spaceID,
		title: loc.title,
		image: "/userdata/" + loc.owner + "/" + loc.spaceID + "/" + loc.coverImage,
		type: loc.type,
		street: loc.street,
		city: loc.city,		
		state: loc.state,
		zip: loc.zip,
		lat: loc.location.lat,
		lng: loc.location.lng,		
		owner: loc.owner,
		description: loc.description,
		rates: loc.rates,
		hourlyAvail: loc.hourlyAvail,
		monthlyAvail: loc.monthlyAvail,
		dailyAvail: loc.dailyAvail,
		longTerm: loc.longTerm,
		electricity: loc.amenities.electricity,
		heat: loc.amenities.heat,
		water: loc.amenities.water,
		bathroom: loc.amenities.bathroom
	}
}

router.get('/create', (req, res) => {
	res.render('space_create')
})

router.get('/about', (req, res) => {
	res.render('about');
})

router.get('/s', (req, res) => {		
	res.render('search');
})

router.get('/:id', (req, res) => {
	const loc = locations.filter((space) => {
		return space.spaceID === req.params.id
	})[0]

	let spaceContext = locDetailsGenerator(loc)

	if (userStatus.loggedIn) {
		res.render('details_owner', spaceContext)
	} else {
		res.render('details', spaceContext);		
	}
})

router.get('/:id/edit', (req, res) => {
	const loc = locations.filter((space) => {
		return space.spaceID === req.params.id
	})[0]

	let spaceContext = locDetailsGenerator(loc)

	if (userStatus.loggedIn) {
		res.render('space_edit', spaceContext)
	} else {
		res.render('details', spaceContext);		
	}
})

module.exports = router;