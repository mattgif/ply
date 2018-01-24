const express = require('express');
const app = express();
const morgan = require('morgan');
const ejs = require('ejs');

const {locations} = require('./mock')

app.use(morgan('common'));
app.use(express.static('public'));

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
	res.render('index');
})

app.get('/share', (req, res) => {
	res.render('share');
})

app.get('/s', (req, res) => {		
	res.render('search');
})

app.get('/spaces/:id', (req, res) => {
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

app.get('/api/find_spaces', (req, res) => {
	res.json(locations);
})

app.listen(process.env.PORT || 8080)

module.exports = {app}