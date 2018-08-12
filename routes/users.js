const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const UserModule = require('../models/user');
const User = UserModule.User;

router.post('/register', (req, res) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  UserModule.getUserByEmail(newUser.email, (err, user) => {
    if (err) throw err;
    if (user) {
      return res.json({
        success: false,
        message: 'User Already registered'
      });
    }
    UserModule.addUser(newUser, (err, user) => {
      if (err) {
        res.json({
          success: false,
          message: 'Failed to register user'
        });
      } else {
        res.json({
          success: true,
          message: 'User registered'
        });
      }
    });
  });

});

router.post('/login', (req, res) => {
  console.log(User);
  const email = req.body.email;
  const password = req.body.password;

  UserModule.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        success: false,
        message: 'User not found'
      });
    }

    UserModule.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({
          data: user
        }, config.secret, {
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
        return res.json({
          success: false,
          message: 'Wrong password'
        });
      }
    });
  });
});
router.post('/change-password', (req, res) => {
  const id = req.body.id;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  UserModule.getUserById(id, (err, user) => {
    if (err) throw err;
    if (user) {
      UserModule.comparePassword(oldPassword, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          user.password = newPassword;
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user.save((err, user) => {
                if (err) {
                  res.json({
                    success: false,
                    message: 'Failed to update password'
                  });
                } else {
                  res.json({
                    success: true,
                    message: 'Updated Password'
                  });
                }
              });
            });
          });
        } else {
          return res.json({
            success: false,
            message: "Old Password Wrong"
          });
        }
      });
    }
  });

});
router.post('/update-profile', (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const profile_url = req.body.profile_url;
  UserModule.getUserById(id, (err, user) => {
    if (err) {
      if (!user) {
        res.json({
          status: false,
          message: 'User id wrong'
        });
      }
    } else {
      user.name = name;
      user.profile_url = profile_url;
      user.save((err, user) => {
        if (err) {
          res.json({
            success: false,
            message: 'Failed to update profile url'
          });
        } else {
          res.json({
            success: true,
            message: 'profile url updated'
          });
        }
      });
    }

  });

});
router.get('/authenticate', passport.authenticate('jwt', {session:false}), (req, res) => {
    return res.json({success: true, user: req.user});
});

module.exports = router;