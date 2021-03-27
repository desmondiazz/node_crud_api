const request = require('supertest');
const app = require('../../app');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const moment = require('moment');

describe('Init test', function () {
    it('Express server should start properly', function (done) {
        request(app)
        .get('/')
        .expect(200)
        .end((err)=>{
            if(err) return done(err);
            done();
        })
    });
});

describe('Create new book',function(){
    it('API should respond with 400 if no data is sent',function(done){
        request(app)
        .post('/books/add')
        .send({})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end((err) => {
            if (err) return done(err);
            done();
        });
    });

    const data = {
        authorName:'Daniel Kahneman',
        releaseDate:'2011-10-25',
        name:'Thinking fast and slow'
    };

    it('Should be able to add a book without any errors',function(done){
        request(app)
        .post('/books/add')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            assert.equal(res.body.result.authorName, data['authorName'])
            assert.equal(res.body.result.name, data['name'])
            assert.equal(res.body.result.releaseDate, moment(data['releaseDate']).valueOf())
            expect(res.body.result).to.have.property('uuid')
        })
        .expect(200, done)
    });
});

describe('Fetch book',function(){
    const data = {
        authorName:'Daniel Kahneman',
        releaseDate:'2011-10-25',
        name:'Thinking fast and slow'
    };

    let uuid = null;

    it('Should be able to add a book without any errors',function(done){
        request(app)
        .post('/books/add')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            expect(res.body.result).to.have.property('uuid')
            uuid = res.body.result.uuid;
        })
        .expect(200, done)
    });

    it('Should be able to fetch created book',function(done){
        request(app)
        .get(`/books/${uuid}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            assert.equal(res.body.result.authorName, data['authorName'])
            assert.equal(res.body.result.name, data['name'])
            assert.equal(res.body.result.releaseDate, moment(data['releaseDate']).valueOf())
            expect(res.body.result).to.have.property('uuid')
        })
        .expect(200, done)
    });
    
    it('Should not be able to fetch book if wrong id is passed',function(done){
        request(app)
        .get(`/books/someid`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done)
        .expect((res) => {
            assert.equal(res.body.message,'Book not found')
        })
    });
});

describe('Should fetch all books',function(){
    it('Should not be able to fetch array of books',function(done){
        request(app)
        .post(`/books/get-all-books`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res)=>{
            expect(res.body.result).to.be.an('array');
            expect(res.body.result.length).to.be.greaterThan(0)
        })
    });
    
    it('Should not be able to fetch limited array of books',function(done){
        const limit = 1
        request(app)
        .post(`/books/get-all-books`)
        .send({limit})
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
        .expect((res)=>{
            expect(res.body.result).to.be.an('array');
            expect(res.body.result.length).to.equal(limit);
        })
    });
})

describe('Should be able to update a book',function(){
    let data = {
        authorName:'George R.R. Martins',
        releaseDate:'2011-10-25',
        name:'A Clash of Kings'
    };

    let updatedData = {
        authorName:'George R.R. Martin',
        releaseDate:'1998-11-16',
        name:'A Clash of Kings (A Song of Ice and Fire)'
    }

    let uuid = null;
    it('Should be able to add a book without any errors',function(done){
        request(app)
        .post('/books/add')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            expect(res.body.result).to.have.property('uuid')
            assert.equal(res.body.result.authorName, data['authorName'])
            assert.equal(res.body.result.name, data['name'])
            assert.equal(res.body.result.releaseDate, moment(data['releaseDate']).valueOf())
            uuid = res.body.result.uuid;
        })
        .expect(200, done)
    });
    
    it('Should be able to update a book without any errors',function(done){
        request(app)
        .put(`/books/${uuid}`)
        .send(updatedData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            assert.equal(res.body.result.authorName, updatedData['authorName'])
            assert.equal(res.body.result.name, updatedData['name'])
            assert.equal(res.body.result.releaseDate, moment(updatedData['releaseDate']).valueOf())
        })
        .expect(200, done)
    });
});

describe('Should be able to delete a book',function(){
    let data = {
        authorName:'George R.R. Martins',
        releaseDate:'2011-10-25',
        name:'A Clash of Kings'
    };

    let uuid = null;

    it('Should be able to add a book without any errors',function(done){
        request(app)
        .post('/books/add')
        .send(data)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            expect(res.body.result).to.have.property('uuid')
            assert.equal(res.body.result.authorName, data['authorName'])
            assert.equal(res.body.result.name, data['name'])
            assert.equal(res.body.result.releaseDate, moment(data['releaseDate']).valueOf())
            uuid = res.body.result.uuid;
        })
        .expect(200, done)
    });

    it('Should be able to fetch created book',function(done){
        request(app)
        .get(`/books/${uuid}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            assert.equal(res.body.result.authorName, data['authorName'])
            assert.equal(res.body.result.name, data['name'])
            assert.equal(res.body.result.releaseDate, moment(data['releaseDate']).valueOf())
            expect(res.body.result).to.have.property('uuid')
        })
        .expect(200, done)
    });
    
    it('Should be able to delete book',function(done){
        request(app)
        .delete(`/books/${uuid}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect((res) => {
            assert.equal(res.body.result,'Success.')
        })
        .expect(200, done)
    });

    it('Should not be able to fetch deleted book',function(done){
        request(app)
        .get(`/books/${uuid}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done)
        .expect((res) => {
            assert.equal(res.body.message,'Book not found')
        })
    });

    let updatedData = {
        authorName:'George R.R. Martin',
        releaseDate:'1998-11-16',
        name:'A Clash of Kings (A Song of Ice and Fire)'
    }

    it('Should not be able to update a book',function(done){
        request(app)
        .put(`/books/${uuid}`)
        .send(updatedData)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400, done)
        .expect((res) => {
            assert.equal(res.body.message,'Book not found')
        })
    });
})