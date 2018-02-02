const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, closeServer, runServer} = require('../server');
const faker = require('faker');
const mongoose =require('mongoose');
const {TEST_DATABASE_URL} = require('../config')

const expect = chai.expect;
const should = chai.should();

const {User} = require('../models')

chai.use(chaiHttp);

function tearDownDb() {
	// called in 'afterEach' blocks to ensure data modularity
	return new Promise((resolve, reject) => {
		console.warn('Deleting database');
		mongoose.connection.dropDatabase()
			.then(result => resolve(result))
			.catch(err => reject(err));
	});
}

function seedUserData() {
	console.info('seeding user data');
	const seedData = [];
	// seedData.push({
	// 	email: "demo@example.com",
	// 	username: "demouser",
	// 	firstName: "Demo",
	// 	lastName: "User",
	// 	password: User.hashPassword("password")
	// })
	for (let i = 1; i <= 10; i++ ) {
		seedData.push({
			email: faker.internet.email(),
			username: faker.internet.userName(),
			firstName: faker.name.firstName(),
			lastName: faker.name.lastName(),
			password: faker.internet.password(),
		})
	}
	return User.insertMany(seedData);
}

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

describe('search endpoints tests', () => {
	// Get request to endpoint
	// Verify response is JSON
	// Verify resopnse JSON has the correct structure
	describe('POST request to search results (location)', () => {
		it('should return a json object', () => {
			query = {
						"location": 
							{
								"type": "Point", 
								"coordinates": [-77.0368707,38.9071923]
							}
					}
			return chai.request(app)
				.post('/api/find_spaces')
				.send(query)
				.then(res => {					
					expect(res).to.be.json
				})
		})
	})

	describe('POST request to search results (user)', () => {
		it('should return a json object', () => {
			query = {
						"username": "alan20"
					}
			return chai.request(app)
				.post('/api/find_spaces')
				.send(query)
				.then(res => {					
					expect(res).to.be.json
				})
		})
	})
})

describe('user API tests', () => {
	before(() => {
		return runServer(TEST_DATABASE_URL);
	})

	beforeEach(() => {
		return seedUserData();
	})

	afterEach(() => {
		return tearDownDb();
	})

	after(() => {
		return closeServer();
	})

	describe('POST request to create a new user', () => {
		// test strategy:
		// 1. request # of users currently in db
		// 2. Make post request with data,
		// 3. inspect response for correct status,
		// 4. inspect response for correct keys,
		// 5. inspect response for ID (to verify it was inserted in db)
		// 6. make sure # of users in db is previous count + 1
		// 7. check password hashing
		// 8. test edge cases for failure
		it('should add a new user', () => {
			const newUser = {
				email: 'testuser@example.com',
				username: 'MrTestMan',
				firstName: 'Bot',
				lastName: 'Userman',
				password: faker.internet.password(),
			}

			let countBeforePost;

			return User
				.count()
				.then(count => {
					countBeforePost = count;
					return chai.request(app)
					.post('/api/user')
					.send(newUser)
				})			
				.then(res => {					
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.an('object');
					const expectedKeys = ['email','username','firstName','lastName','spaces']
					res.body.should.have.all.keys(expectedKeys);
					res.body.email.should.equal(newUser.email);
					res.body.username.should.equal(newUser.username);
					res.body.firstName.should.equal(newUser.firstName);
					res.body.lastName.should.equal(newUser.lastName);
					return User.count()
				})
				.then(newCount => {
					newCount.should.equal(countBeforePost+1)
				});
		})
	})
})
