const express = require('express');
const router = express.Router();
const ejs = require('ejs');

router.get('/find_spaces', (req, res) => {
	res.json(locations);
})

module.exports = router;