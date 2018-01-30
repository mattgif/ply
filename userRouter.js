const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const {locations} = require('./mock');

router.get('/:id', (req, res) => {
	res.render('user_spaces', {
		username: req.params.id,
	})
});

module.exports = router;