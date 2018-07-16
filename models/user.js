var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//available through mongoose
var userSchema = mongoose.Schema({
    fullname: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String},
    //admin or regular user
    role: {type: String, default: ''},
    school: {
        name: {type: String, default: ''},
        image: {type: String, default: ''}
    },
    passwordResetToken: {type: String, default: ''},
    passwordResetExpires: {type: Date, default: Date.now},
    facebook: {type: String, default: ''},
    tokens: Array
});

userSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

//export values or schema
module.exports = mongoose.model('User', userSchema);
