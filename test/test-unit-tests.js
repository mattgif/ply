const chai = require('chai');
const chaiHttp = require('chai-http');
const {app} = require('../server')

const expect = chai.expect;
const should = chai.should;

chai.use(chaiHttp);

describe('check status of root url', () => {
	// Test strategy:
	// 1. http request to index page
	// 2. inspect response status to make sure connection succeeds
	// 3. inspect response to see if it's an html file
	it('should return a status of 200 and be html', () => {
		return chai.request(app)
			.get('/')
			.then(res => {
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			})
	})	
})