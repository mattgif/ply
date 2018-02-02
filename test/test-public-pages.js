const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, closeServer, runServer} = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

describe('pages accessible without login', () => {
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

describe('search API', () => {
    // Get request to endpoint
    // Verify response is JSON
    // Verify resopnse JSON has the correct structure
    describe('POST location request to /api/find_spaces', () => {
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
});
