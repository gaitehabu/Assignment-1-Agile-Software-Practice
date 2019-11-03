const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const _ = require("lodash");
const mongoose = require("mongoose");
const Recipe = require('../models/recipes')

const mongodbUri = 'mongodb+srv://AtlasAdminister:wojiubugaosuni@cluster0-k2ynh.mongodb.net/cookingweb?retryWrites=true&w=majority';
let server;
let db;

let testID;

describe('Recipes: models', function () {
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

    describe('GET /recipes', () => {
        it('should return all recipes', done => {
            request(server)
                .get('/recipes')
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .end((err, res) => {
                    try {
                        expect(res.body).to.be.a("array");
                        expect(res.body.length).to.equal(5);
                        let result = _.map(res.body, recipe => {
                            return {
                                name: recipe.name,
                                username: recipe.username
                            };
                        });
                        expect(result).to.deep.include({
                            name: "Noodles",
                            username: "Francis"
                        });
                        expect(result).to.deep.include({
                            name: "Pizza",
                            username: "Francis"
                        });
                        expect(result).to.deep.include({
                            name: "Curry",
                            username: "Qi"
                        });
                        expect(result).to.deep.include({
                            name: "Chips",
                            username: "Meng"
                        });
                        expect(result).to.deep.include({
                            name: "Chips",
                            username: "Jack"
                        });
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });

    describe('GET /recipes/:id', () => {
        describe('when the id is valid', () => {
            it('should return the matching recipe', done => {
                request(server)
                    .get('/recipes/5db4cd6920a9f87338d01bfe')
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property("name", "Noodles");
                        expect(res.body).to.have.property("username", "Francis");
                        done(err);
                    });
            });
        });
        describe('when the id is invalid', () => {
            it('should return the NOT Found message', done => {
                request(server)
                    .get('/recipes/12333')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Recipe NOT Found By ID!!");
                        done(err);
                    })
            });
        });
    });

    describe('GET /recipes/name/:name', () => {
        describe('when the name is correct', () => {
            it('should return the matching recipe', done => {
                request(server)
                    .get('/recipes/name/Chips')
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.length).to.equal(2);
                        let result = _.map(res.body, recipe => {
                            return {
                                name: recipe.name,
                                username: recipe.username
                            };
                        });
                        expect(result).to.deep.include({
                            name: "Chips",
                            username: "Meng"
                        });
                        expect(result).to.deep.include({
                            name: "Chips",
                            username: "Jack"
                        });
                        done(err);
                    });
            });
        });
        describe('when the name is wrong', () => {
            it('should return the NOT Found message', done => {
                request(server)
                    .get('/recipes/name/iceCream')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Recipe NOT Found By Name!!");
                        done(err);
                    })
            });
        });
    });

    describe('GET /recipes/username/:username', () => {
        describe('when the username is correct', () => {
            it('should return the matching recipe', done => {
                request(server)
                    .get('/recipes/username/Francis')
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.length).to.equal(2);
                        let result = _.map(res.body, recipe => {
                            return {
                                name: recipe.name,
                                username: recipe.username
                            };
                        });
                        expect(result).to.deep.include({
                            name: "Pizza",
                            username: "Francis"
                        });
                        expect(result).to.deep.include({
                            name: "Noodles",
                            username: "Francis"
                        });
                        done(err);
                    });
            });
        });
        describe('when the username is wrong', () => {
            it('should return the NOT Found message', done => {
                request(server)
                    .get('/recipes/username/Zoe')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Recipe NOT Found By Username!!");
                        done(err);
                    })
            });
        });
    });

    describe('GET /recipes/:id/comment', () => {
        describe('when the id is valid', () => {
            it('should return the matching comment in recipe', done => {
                request(server)
                    .get('/recipes/5db4cd6920a9f87338d01bfe/comment')
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.length).to.equal(2);
                        let result = _.map(res.body, comment => {
                            return {
                                username: comment.username,
                                text: comment.text
                            };
                        });
                        expect(result).to.deep.include({
                            username: "Meng",
                            text: "Looks good and tasty."
                        });
                        expect(result).to.deep.include({
                            username: "Qi",
                            text: "Good!"
                        });
                        done(err);
                    });
            });
        });
        describe('when the id is invalid', () => {
            it('should return the NOT Found message', done => {
                request(server)
                    .get('/recipes/11111/comment')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.message).equals("Recipe NOT Found By ID!!");
                        done(err);
                    })
            });
        });
    });

    describe('GET /recipes/search/:name', () => {
        describe('when the name is correct', () => {
            it('should return the matching recipe', done => {
                request(server)
                    .get('/recipes/search/i')
                    .set("Accept", "application/json")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body.length).to.equal(3);
                        let result = _.map(res.body, recipe => {
                            return {
                                name: recipe.name,
                                username: recipe.username
                            };
                        });
                        expect(result).to.deep.include({
                            name: "Chips",
                            username: "Meng"
                        });
                        expect(result).to.deep.include({
                            name: "Chips",
                            username: "Jack"
                        });
                        expect(result).to.deep.include({
                            name: "Pizza",
                            username: "Francis"
                        });
                        done(err);
                    });
            });
        });
        describe('when the name is wrong', () => {
            it('should return the NOT Found message', done => {
                request(server)
                    .get('/recipes/search/ooo')
                    .expect(200)
                    .end((err, res) => {
                        expect(res.body).to.have.property("message", "Bad search!!");
                        done(err);
                    })
            });
        });
    });

    describe('POST /recipes', () => {
        const recipe = {
            name: "Dumpling", username: "John",
            content: {material: [], step: ["Making...", "..."]},
            comment: [{"id": 200000200, username: "Yan", text: "So tasty!", date: "2015.2.5"}],
            like: 3
        };
        it('should return confirmation message and add a recipe', function () {
            return request(server)
                .post('/recipes')
                .send(recipe)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.property("message", "Recipe Added Successfully!");
                    testID = res.body.data._id;
                });
        });
        after(() => {
            return request(server)
                .get(`/recipes/${testID}`)
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.property("name", "Dumpling");
                    expect(res.body).to.have.property("username", "John");
                    expect(res.body).to.have.property("like", 0);
                });
        });
    });

    

});

