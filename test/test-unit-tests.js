const chai = require('chai');
const chaiHttp = require('chai-http');
const {app} = require('../server')

const expect = chai.expect;
const should = chai.should;

chai.use(chaiHttp);

describe('front end endpoints tests', () => {
	// Test strategy:
	// 1. for each end point that users can navigate to, send http request
	// 2. inspect response status to make sure connection succeeds
	// 3. inspect response to see if it's an html file
	describe('splash', () => {
		it('should return a status of 200 and be html', () => {
			return chai.request(app)
				.get('/')
				.then(res => {
					expect(res).to.have.status(200);
					expect(res).to.be.html;
				})
		})		
	})

	describe('search results', () => {
		it('should return a status of 200 and be html', () => {
			return chai.request(app)
				.get('/spaces/s')
				.then(res => {
					expect(res).to.have.status(200);
					expect(res).to.be.html;
				})
		})	
	})	
})

describe('api endpoints tests', () => {
	// Get request to endpoint
	// Verify response is JSON
	// Verify resopnse JSON has the correct structure
	describe('search results', () => {
		it('should return a json object', () => {
			return chai.request(app)
				.get('/api/find_spaces')
				.then(res => {
					expect(res).to.be.json
				})
		})
	})
})