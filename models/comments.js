let mongoose = require('mongoose');

let CommentSchema = new mongoose.Schema({
    username: String,
    text: String,
    date: {type: Date,
        default: Date.now}
    },
    {collection: 'comments'});

module.exports = mongoose.model('Comments', CommentSchema);