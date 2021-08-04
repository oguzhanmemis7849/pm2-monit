let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
let should = chai.should();

chai.use(chaiHttp);


describe('GET /api/getpm2list', () => {
    it("it should get pm2 list ", (done) => {
        chai.request(server)
            .get('/api/getpm2list')
            .end((err, response) => {
                response.should.have.status(200);
                response.body.should.be.a('array');
                response.body[0].should.have.property('name')
                done();
            })
    })
})

describe('/POST /api/appstart', () => {
    it('it should start the processes', (done) => {
        let query = {
            name: "api2"
        }
        chai.request(server)
            .post('/api/appstart')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200); 
                res.body[0].should.have.property('status');
                res.body.should.be.a('array');
                res.body[0].should.have.property('status').eql("online"); 
                done();
            });
    });

});

describe('/POST /api/appstop', () => {
    it('it should stop the processes ', (done) => {
        let query = {
            name: "api2"
        }
        chai.request(server)
            .post('/api/appstop')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200); 
                res.body[0].should.have.property('status');
                res.body.should.be.a('array');
                res.body[0].should.have.property('status').eql("stopped"); 
                done();
            });
    });

});

describe('/POST /api/apprestart', () => {
    it('it should restart the processes', (done) => {
        let query = {
            name: "api2"
        }
        chai.request(server)
            .post('/api/apprestart')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200); 
                res.body[0].should.have.property('restart_count');
                res.body.should.be.a('array');
                done();
            });
    });

});

describe('/DELETE /api/appdelete/:id', () => {
    it('it should delete the processes', (done) => {
        let query = {
            id:0
        }
        chai.request(server)
            .delete('/api/appdelete/:id')
            .send(query)
            .end((err, res) => {
                res.should.have.status(200); 
                res.body.should.have.property('message');
                res.body.should.be.a('object');
                done();
            });
    });

});