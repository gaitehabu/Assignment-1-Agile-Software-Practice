const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const _ = require("lodash");
const mongoose = require("mongoose");
const User = require('../models/users')


const mongodbUri = 'mongodb+srv://AtlasAdminister:wojiubugaosuni@cluster0-k2ynh.mongodb.net/test?retryWrites=true&w=majority';
let server;
let db;

mongoose.connect(mongodbUri);
server = require("../bin/www");

describe('Users: models', function () {

    // before(async () => {
    //     try {
    //         mongoose.connect(mongodbUri);
    //         server = require("../bin/www");
    //         db = mongoose.connection;
    //     } catch (e) {
    //         console.log(e);
    //     }
    // });

    // beforeEach(async () => {
    //     try {
    //         await User.deleteMany({});
    //         let user = new User();
    //         user.name = 'Jona';
    //         user.password = '123456';
    //         await user.save();
    //         user.name = 'HuYan';
    //         user.password = 'qazwsx';
    //         await user.save();
    //     } catch (e) {
    //         console.log(e);
    //     }
    // });

    describe('GET /users/name/:name', () => {
        describe('when the name is valid', () => {
            it('should return the matching user', function () {
                return request(server)
                    .get('/users/name/Meng')
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property("name", "Meng");
                        expect(res.body).to.have.property("password", "changedPassword");
                    });
            });
        });
        describe('when the name is invalid', () => {
            it('should return the NOT Found message', function () {
                return request(server)
                    .get('/users/name/9999')
                    .expect(200)
                    .expect({message: "User NOT Found By Name!!"});
            });
        });
    });

    describe('POST /user', () => {
        it('should return confirmation message and add a user', function () {
            const user = {
                name: 'Arli',
                password: 'fox111'
            };
            return request(server)
                .post('/users')
                .send(user)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.property("message", "User Added Successfully!");
                });
        });
        after(() => {
            return request(server)
                .get('/users/name/Arli')
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.property("name", "Arli");
                    expect(res.body).to.have.property("password", "fox111");
                });
        });
    });

    describe('PUT /user/:id/password', () => {
        describe('when the name is valid', () => {
            it('should return the message and user password changed', function () {
                const user = {
                    password: 'changedPassword'
                };
                return request(server)
                    .put('/users/5db4f87b722f7382f2394ccf/password')
                    .send(user)
                    .expect(200)
                    .then(res => {
                        expect(res.body.data).to.have.property("password", "changedPassword");
                    });
            });
        });
        describe('when the name is invalid', () => {
            it('should return the NOT Found message', function () {
                return request(server)
                    .put('/users/qqqq/password')
                    .expect({message: "User NOT Found"});
            });
        });
    });

    describe("DELETE /users/:id", () => {
        describe("when the id is valid", () => {
            let lastOne = User[User.length - 1]

            it("should return a message and delete a user", () => {
                return request(server)
                    .delete("/users/5db50086ebb3e2862bb098fc")
                    .expect(200)
                    .then(resp => {
                        expect(resp.body).to.include({ message: "User deleted Successfully!" });
                    });
            });
            after(() => {
                return request(server)
                    .get("/users/5db50086ebb3e2862bb098fc")
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .then(res => {
                        expect(res.body.data).to.equal(undefined);
                    });
            });
        });
        describe("when the id is invalid", () => {
            it("should return a message for User NOT DELETED", () => {
                return request(server)
                    .delete("/users/1100001")
                    .then(resp => {
                        expect(resp.body).to.include({ message: "User NOT Deleted!" });
                    });

            });
        });
    })


    // after(async () => {
    //     try {
    //         await db.dropDatabase();
    //     } catch (e) {
    //         console.log(e);
    //     }
    // });


});