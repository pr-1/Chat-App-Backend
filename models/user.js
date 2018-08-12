const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

// User Schema
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  profile_url: {
    type: String,
    default: ''
  }
});
const User = mongoose.model('User', UserSchema);

const getUserById = function(id, callback){
  User.findById(id, callback);
}

const addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if(err) throw err;
        newUser.password = hash;
        newUser.save(callback);
      });
    });
  }
 const getUserByEmail = function(email, callback){
    const query = {email: email}
    User.findOne(query, callback);
  }
const comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if(err) throw err;
      callback(null, isMatch);
    });
}
module.exports = {
  UserSchema: UserSchema,
  User: User,
  getUserByEmail: getUserByEmail,
  comparePassword: comparePassword,
  getUserById: getUserById,
  addUser: addUser
}