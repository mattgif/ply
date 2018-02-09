const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, closeServer, runServer} = require('../server');
const faker = require('faker');
const mongoose =require('mongoose');
const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;
const should = chai.should();

const {User} = require('../models');
const { JWT_SECRET } = require('../config');

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

// function seedUserData() {    
//     const seedData = [];
//     for (let i = 1; i <= 10; i++ ) {
//         seedData.push({
//             email: faker.internet.email(),
//             username: faker.internet.userName(),
//             firstName: faker.name.firstName(),
//             lastName: faker.name.lastName(),
//             password: faker.internet.password(),
//         })
//     }    
//     return User.insertMany(seedData);
// }

describe('user API tests', () => {
    before(() => {
        return runServer(TEST_DATABASE_URL);
    })

    // beforeEach(() => {
    //     return seedUserData();
    // })

    afterEach(() => {
        return tearDownDb();
    })

    after(() => {
        return closeServer();
    })

    describe('/user', () => {
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
                password: 'testpassword',
            }

            let countBeforePost;
            return User
                .count()
                .then(count => {
                    countBeforePost = count;                    
                })
            return chai.request(app)
                .post('/user')
                .send(newUser)
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

    describe('api/login', () => {
        // test strategy:
        // create user with known creds
        // send post request to login end point
        // inspect res to make sure it's a json object with authToken as key in body
        it ('should return a login success message', () => {
            const newUser = {
                email: 'MsUserLady@example.com',
                username: 'logintest',
                firstName: 'A',
                lastName: 'Testaccount',
                password: 'passw0rd'
            }
            return chai.request(app)
                .post('/user')
                .send(newUser)
                .then((res) => {
                    return chai
                        .request(app)
                        .post('/api/login')
                        .send({
                            username: 'logintest',
                            password: 'passw0rd'
                        })
                        .then(res => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.be.an('object');
                            expect(res.body.message).to.equal("login succeeded")
                        })
                })
        });    

        it ('should reject request with no credentials', () => {
              return chai
                .request(app)
                .post('/api/login')
                .then(() =>
                  expect.fail(null, null, 'Request should not succeed')
                )
                .catch(err => {
                  if (err instanceof chai.AssertionError) {
                    throw err;
                  }

                  const res = err.response;
                  expect(res).to.have.status(400);
            });
        })
    })
})