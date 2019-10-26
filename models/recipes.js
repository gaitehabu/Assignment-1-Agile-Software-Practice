let mongoose = require('mongoose');

let RecipeSchema = new mongoose.Schema({
    name: String,
    username: String,
    date: {type: Date,
        default: Date.now},
    content: {material: Array,
        step: Array},
    comment: [{username: String,
        text: String,
        date: Date}],
    like: {type: Number, default: 0}
    },
    {collection: 'recipes'});

module.exports = mongoose.model('Recipes', RecipeSchema);



