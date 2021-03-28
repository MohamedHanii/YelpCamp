const moongose = require('mongoose');
const Schema = moongose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type:String,
        require:true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = moongose.model('User', UserSchema);