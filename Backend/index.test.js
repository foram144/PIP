const assert = require('assert');
const fs = require('fs');
const path = require('path');
const supertest = require('supertest');
const { StatusCodes } = require('http-status-codes');

const DATA_FILE = path.join(__dirname, '..', 'users.csv');

beforeEach(() => {
    fs.writeFileSync(DATA_FILE, '');
});

const server = require('../Backend/index');
const request = supertest('http://localhost:8080');

describe('User Management API', function() {

    it('should return a welcome mesage', function(done) {
        request.get('/')
            .expect(StatusCodes.OK)
            .end((err, res) =>{
                if (err)
                    return done(err);
                assert.strictEqual(res.body.message, 'Welcome to the User Management API');
                done();
            });
    });

    it('should return OK status for health check', function(done) {
        request.get('/health')
            .expect(StatusCodes.OK)
            .end((err, res) =>{
                if (err)
                    return done(err);
                assert.strictEqual(res.body.status, StatusCodes.OK);
                done();
            });
    });

    it('should return an empty list of users', function(done) {
        request.get('/users')
            .expect(StatusCodes.OK)
            .end((err, res) =>{
                if (err)
                    return done(err);
                assert(Array.isArray(res.body));
                assert.strictEqual(res.body.length, 0);
                done();
            });
    });

    it('should create a new user', function(done) {
        const newUser = { name: 'Esti', surname: 'Cronje' };
        request.post('/users')
            .send(newUser)
            .expect(StatusCodes.CREATED)
            .end((err, res) =>{
                if (err)
                    return done(err);
                assert.strictEqual(res.body.name, newUser.name);
                assert.strictEqual(res.body.surname, newUser.surname);
                done();
            });
    });

    it('should not create a duplicate user', function(done) {
        const newUser = { name: 'Esti', surname: 'Cronje' };
        request.post('/users')
            .send(newUser)
            .expect(StatusCodes.CONFLICT)
            .end((err, res) =>{
                if (err)
                    return done(err);
                assert.strictEqual(res.body.message, 'User already exists');
                done();
            });
    });

    it('should return a user by ID', function(done) {
        const newUser = { name: 'Esti', surname: 'Cronje' };
        request.post('/users')
            .send(newUser)
            .expect(StatusCodes.CREATED)
            .end((err, res) =>{
                if (err)
                    return done(err);
                const userId = res.body.id;
                request.get(`/users/${userId}`)
                    .expect(StatusCodes.OK)
                    .end((err, res) => {
                        if (err)
                            return done(err);
                        assert.strictEqual(res.body.name, newUser.name);
                        assert.strictEqual(res.body.surname, newUser.surname);
                        done();
                    });
            });
    });

    it('should return 404 for a non-existent user by ID', function(done) {
        request.get('/users/999')
            .expect(StatusCodes.NOT_FOUND)
            .end((err, res) =>{
                if (err)
                    return done(err);
                assert.strictEqual(res.body.message, 'User not found');
                done();
            });
    });
});