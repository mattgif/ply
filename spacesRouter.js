const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const {locations} = require('./mock')

router.get('/create', (req, res) => {
	res.render('space_create')
})

router.get('/share', (req, res) => {
	res.render('share');
})

router.get('/s', (req, res) => {		
	res.render('search');
})

router.get('/id/:id', (req, res) => {
	const loc = locations.filter((space) => {
		return space.spaceID === req.params.id
	})[0]

	res.render('details', {
		title: loc.title,
		image: "/userdata/" + loc.owner + "/" + loc.spaceID + "/" + loc.coverImage,
		type: loc.type,
		city: "Washington, D.C.",
		owner: loc.owner,
		description: loc.description,
		rates: loc.rates,
	});
})

module.exports = router;