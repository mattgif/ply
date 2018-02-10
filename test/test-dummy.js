'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const should = chai.should();

const { BlogPost } = require('../models');
const { closeServer, runServer, app } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

describe('placeholder', () => {
	// no tests while I figure out how to test cookie based auth
	// before(function () {
 //    	return runServer(TEST_DATABASE_URL);
	// });

	// afterEach(function () {
	//     return tearDownDb();
	// });

	// after(function () {
	//     return closeServer();
	// });

	it('should pass no matter what', () => {
		let blah = true;
		blah.should.equal(true);
	})
})