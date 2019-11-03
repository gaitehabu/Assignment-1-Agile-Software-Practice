let recipes = require('../models/recipes');
var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');


let mongodbUri = 'mongodb+srv://AtlasAdminister:wojiubugaosuni@cluster0-k2ynh.mongodb.net/cookingweb';
mongoose.connect(mongodbUri, { useNewUrlParser: true , useUnifiedTopology: true });

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});


router.findAll = (req, res) => {
    // Return a JSON representation of our list
    res.setHeader('Content-Type', 'application/json');
    recipes.find(function(err, recipes) {
        if (err)
            res.send(err);
        res.send(JSON.stringify(recipes,null,5));
    });
}

function getByValue(array, id) {
    var result  = array.filter(function(obj){return obj.id == id;} );
    return result ? result[0] : null; // or undefined
}

router.findOneByID = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    recipes.findOne({ "_id" : req.params.id },function(err, recipe) {
        if (err)
            res.json({message: 'Recipe NOT Found By ID!!', errorMessage: err});
        else
        if (recipe == null)
            res.send({message: "Recipe NOT Found By ID!!"});
        else
            res.send(JSON.stringify(recipe,null,5));
    });
}

function getByName(array, name) {
    var result  = array.filter(function(obj){return obj.name == name;} );
    return result ? result : null; // or undefined
}

router.findOneByName = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    recipes.find({ "name" : req.params.name },function(err, recipe) {
        if (err)
            res.json({ message: 'Recipe NOT Found By Name!!', errorMessage: err});
        else
        if (recipe.length == 0)
            res.send({message: "Recipe NOT Found By Name!!"});
        else
            res.send(JSON.stringify(recipe,null,5));
    });
}

function getByUserName(array, username) {
    var result  = array.filter(function(obj){return obj.username == username;} );
    return result ? result : null; // or undefined
}

router.findOneByUserName = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    recipes.find({ "username" : req.params.username },function(err, recipe) {
        if (err)
            res.json({ message: 'Recipe NOT Found By Username!!', errorMessage: err});
        else
        if (recipe.length == 0)
            res.send({message: "Recipe NOT Found By Username!!"});
        else
            res.send(JSON.stringify(recipe,null,5));
    });
}

router.findComment = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    recipes.find({ "_id" : req.params.id },function(err, recipe) {
        if (err)
            res.json({ message: 'Recipe NOT Found By ID!!', errorMessage: err});
        else{
            if (recipe.length == 0)
                res.send("Recipe NOT Found By ID!!");
            else
                res.send(JSON.stringify(recipe[0].comment,null,5));
        }
    });
}

router.fuzzySearch = (req, res) => {

    const keyword = req.params.name;
    const reg = new RegExp(keyword,'i');
    recipes.find( {name:{$regex:reg}}, function (err, recipe) {
        if (err)
            res.json({message: 'Search NOT Successfully', errorMessage: err});
        else {
            if (recipe.length == 0)
                res.send("Bad search!!");
            else
                res.send(JSON.stringify(recipe,null,5));
        }
    })
}

router.addRecipe = (req, res) => {

    let recipe = new recipes();

    recipe.name = req.body.name;
    recipe.username = req.body.username;
    recipe.content = req.body.content;
    recipe.comment = req.body.comment;

    recipe.save(function (err) {
        if (err)
            res.json({message: 'User NOT Added!', errorMessage: err});
        else
            res.json({message: 'User Added Successfully!', data: recipe});
    });
}

router.addComment = (req, res) => {

    recipes.findById(req.params.id, function (err, recipe) {
        if (err)
            res.json({ message: 'Recipe NOT Found By ID!!', errorMessage: err});
        else {
            if (recipe == null)
                res.send("Recipe NOT Found By ID")
            else {
                recipe.comment.push({username : req.body.username, text : req.body.text, date : Date.now()})
                recipe.save(function (err) {
                    if (err)
                        res.json({message: 'Comment NOT Added!', errorMessage: err});
                    else
                        res.json({message: 'Comment Added Successfully!', data: recipe.comment});
                });
            }
        }
    })

}

router.incrementUpLike = (req, res) => {
    recipes.findById(req.params.id, function(err, recipe) {
        if (err)
            res.json({message: 'Recipe NOT Found', errorMessage: err});
        else {
            if (recipe == null)
                res.send("Recipe NOT Found By ID")
            else {
                recipe.like += 1;
                recipe.save(function (err) {
                    if (err)
                        res.json({message: 'UpLike NOT Successful!!', errorMessage: err});
                    else
                        res.json({message: 'Recipe UpLike Successfully!', data: recipe});
                });
            }

        }
    });
}

router.editRecipes = (req, res) => {
    recipes.findById(req.params.id, function (err, recipe) {
        if (err)
            res.json({message: 'Recipe NOT Found', errorMessage: err});
        else {
            if (recipe == null)
                res.send("Recipe NOT Found!");
            else {
                recipe.name = req.body.name;
                recipe.content = req.body.content;
                recipe.save(function(err) {
                    if (err)
                        res.json({message: 'Edit Recipes NOT Successful!!', errorMessage: err});
                    else
                        res.json({message: 'Edit Recipes Successful!!', data: recipe});
                })
            }
        }
    });
}

router.deleteRecipe = (req, res) => {
    recipes.findByIdAndRemove(req.params.id, function(err, user) {
        if (err)
            res.json({message: 'Recipe NOT Deleted!', errorMessage: err});
        else
        if (user == null)
            res.send("Recipe NOT Found");
        else
            res.json({message: 'Recipe deleted Successfully!'});
    });

}

router.deleteRecipeComment = (req, res) => {


    recipes.findById(req.params.id, function (err, recipe) {
        if (err)
            res.json({ message: 'Recipe NOT Found By ID!!', errorMessage: err});
        else {
            if (recipe == null)
                res.send("Recipe NOT Found By ID")
            else {

                let comment = getByValue(recipe.comment, req.params.cid)
                if (comment == null)
                    res.send("Comment NOT Found! - Recipe Comment Delete NOT Successful!");
                else {
                    let index = recipe.comment.indexOf(comment);
                    recipe.comment.splice(index, 1);
                    recipe.save(function (err) {
                        if (err)
                            res.json({message: 'Comment NOT Delete!', errorMessage: err});
                        else
                            res.json({message: 'Comment Delete Successfully!', data: recipe.comment });
                    });
                }

            }
        }
    })
}

module.exports = router;