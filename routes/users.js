const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');

router.post('/register', (req, res, next) => {
    let newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });
    User.getUserByEmail(newUser.email, (err,user)=> {
      if(err) throw err;
      if(user){
        return res.json({success:false,message:'User Already registered'});
      }
      User.addUser(newUser, (err, user) => {
        if(err){
          res.json({success: false, message:'Failed to register user'});
        } else {
          res.json({success: true, message:'User registered'});
        }
      });
    });
   
  });

router.post('/login',(req, res, next)=>{
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, message: 'User not found'});
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign({data: user}, config.secret, {
          expiresIn: 172800 //2 Days
        });

        res.json({
          success: true,
          token: `Bearer ${token}`,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profile_url: user.profile_url
          }
        });
      } else {
        return res.json({success: false, message: 'Wrong password'});
      }
    });
  });
  });
  router.post('/change-password',(req, res, next)=>{
    const id = req.body.id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
     
    User.getUserById(id, (err, user)=>{
      if(err) throw err;
      if(user) {
        User.comparePassword(oldPassword, user.password, (err, isMatch)=> {
          if(err) throw err;
          if(isMatch) {
            user.password = newPassword;
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(user.password, salt, (err, hash) => {
                if(err) throw err;
                user.password = hash;
                user.save((err, user) => {
                  if(err){
                    res.json({success: false, message:'Failed to update password'});
                  } else {
                    res.json({success: true, message:'Updated Password'});
                  }
                });
              });
            });
          } else {
            return res.json({success: false, message: "Old Password Wrong"});
          }
         });
    }
     });

});
router.post('/update-profile', (req, res, next)=> {
  const id = req.body.id;
  const name = req.body.name;
  const profile_url = req.body.profile_url;
 User.getUserById(id, (err, user)=>{
   if (err) {
   if(!user) {
     res.json({status: false, message: 'User id wrong'});
   }
   } else {
    user.name = name;  
    user.profile_url = profile_url;
    user.save((err, user) => {
     if(err){
       res.json({success: false, message:'Failed to update profile url'});
     } else {
       res.json({success: true, message:'profile url updated'});
     }
   });
   }
    
 });
 
});

module.exports = router;