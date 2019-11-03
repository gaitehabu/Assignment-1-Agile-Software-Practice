const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const _ = require("lodash");
const mongoose = require("mongoose");
const User = require('../models/users')


const mongodbUri = 'mongodb+srv://AtlasAdminister:wojiubugaosuni@cluster0-k2ynh.mongodb.net/cookingweb?retryWrites=true&w=majority';
let server;
let db;

let testID;

describe('Users: models', function () {

    before(async () => {
        try {
            mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
            server = require("../bin/www");
            db = mongoose.connection;
        } catch (e) {
            console.log(e);
        }
    });

    after(async () => {
        try {
            await mongoose.connection.close();
            await server.close()
        } catch (error) {
            console.log(error);
        }
    });

    describe('GET /users', () => {
        it('should return all users', done => {
            request(server)
                .get('/users')
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.equal(3);
                        let result = _.map(res.body, user => {
                            return {
                                name: user.name,
                                password: user.password
                            };
                        });
                        expect(result).to.deep.include({
                            name: "Meng",
                            password: "changedPassword"
                        });
                        expect(result).to.deep.include({
                            name: "Arli",
                            password: "fox111"
                        });
                        expect(result).to.deep.include({
                            name: "Francis",
                            password: "123456789"
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });

    describe('GET /users/:id', () => {
        describe('when the id is valid', () => {
            it('should return the matching user', done => {
                request(server)
                    .get('/users/5db596749ab793039c1a5a6f')
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property("name", "Francis");
                        expect(res.body).to.have.property("password", "123456789");
                        done(err);
                    });
            });
        });
        describe('when the id is invalid', () => {
            it('should return the NOT Found message', done => {
                request(server)
                    .get('/users/1119999')
                    .expect(200)
                    .end((err, res) => {
                        expect({message: "User NOT Found By ID!!"});
                        done(err);
                    })
            });
        });
    });

    describe('GET /users/name/:name', () => {
        describe('when the name is valid', () => {
            it('should return the matching user', done => {
                request(server)
                    .get('/users/name/Francis')
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property("name", "Francis");
                        expect(res.body).to.have.property("password", "123456789");
                        done(err);
                    });
            });
        });
        describe('when the name is invalid', () => {
            it('should return the NOT Found message', done => {
                request(server)
                    .get('/users/name/9999')
                    .expect(200)
                    .end((err, res) => {
                        expect({message: "User NOT Found By Name!!"});
                        done(err);
                    })
            });
        });
    });
    
});