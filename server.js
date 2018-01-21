const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('common'));
app.use(express.static('public'));


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
})

app.get('/s', (req, res) => {		
	res.sendFile(__dirname + '/public/search.html');
})

app.listen(process.env.PORT || 8080)

module.exports = {app}