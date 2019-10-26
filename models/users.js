let mongoose = require('mongoose');


let UserSchema = new mongoose.Schema({
        name: String,
        password: String,
        sex: String,
        personal_lnfo: String
    },
    { collection: 'users' });

module.exports = mongoose.model('Users', UserSchema);

