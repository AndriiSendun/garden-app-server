const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middlware/auth');

//User Model
const User = require('../../models/user');

//@route POST api/auth
router.post('/', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Enter all fields' });
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.status(400).json({ message: 'User does\'t exist' });
      }

      //Password validation
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(!isMatch) return res.status(400).json({message: 'Wrong password or email'})

          jwt.sign(
            { id: user.id },
            config.get('JWT'),
            { expiresIn: 3600 },
            (err, token) => {
              if(err) throw err;

              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  flowers: user.flowers
                }
              });

            }
          );
        });
    });
});

//@route GET api/auth/user
//@desc  Get user data
router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user));
});

//@route DELETE api/auth/user
//@desc  delete user data
router.delete('/user', auth, (req, res) => {
  try{
    User.findByIdAndDelete(req.user.id)
      .then(user => res.json());
  } catch (err) {
    res.status(400).json({message: 'Deleting fail'});
  }
});

//@route PUT api/auth/user/email
//@desc  change user email
router.put('/user/email', auth, (req, res) => {
  let {email} = req.body;

  //check if email already exist
  User.findOne({ email })
  .then(user => {
    if (user) res.status(400).json({ message: 'User with such email already exist' });

    try {
      User.findByIdAndUpdate(req.user.id, {$set: { email }}, {new: true})
      .select('-password')
      .then(user => res.json(Object.assign({}, {id: user.id, name:user.name, email: user.email, flowers: user.flowers, date: user.date})));
    } catch (err) {
      res.json({message: "Cannot change email"});
    }

  });
});

//@route PUT api/auth/user/name
//@desc  change user name
router.put('/user/name', auth, (req, res) => {
  let {name} = req.body;

  try {
    User.findByIdAndUpdate(req.user.id, {$set: { name }}, {new: true})
    .select('-password')
    .then(user => res.json(Object.assign({}, {id: user.id, name:user.name, email: user.email, flowers: user.flowers, date: user.date})));
  } catch (err) {
    res.json({message: "Cannot change name"});
  }

});

//@route PUT api/auth/user/password
//@desc  change user password
router.put('/user/password', auth, (req, res) => {
  let {password} = req.body;

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      password = hash;
      try {
        User.findByIdAndUpdate(req.user.id,  {$set: { password }}, {new: true})
        .select('-password')
        .then(user => res.json(Object.assign({}, {id: user.id, name:user.name, email: user.email, flowers: user.flowers, date: user.date})));
      } catch (err) {
        res.json({message: "Cannot change password"});
      }
    });
  });
});

module.exports = router;
