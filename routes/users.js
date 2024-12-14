var express = require('express');
var router = express.Router();
var {sequelize} = require('./db');
const { Model, DataTypes } = require('sequelize');
var hasher = require('pbkdf2-password')();
var path = require('path');
// var multer  = require('multer');
var multer  = require('multer')({ dest: path.join(__dirname, '../public/images/avatar')});

class User extends Model {}
User.init({
  id:{
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4 // Or DataTypes.UUIDV1
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  salt: DataTypes.STRING,
  hash: DataTypes.STRING,
  avatar: DataTypes.STRING
}, { sequelize, modelName: 'user' });

// Sync models with database
sequelize.sync();

router.get('/login', function(req, res){
  res.render('user/login');
});

router.get('/create', function(req, res){
  res.render('user/create');
});

router.get('/avatar/:id', function(req, res){
  res.render('user/avatar', {id: req.params.id});
});

router.post('/avatar/:id', async (req, res) => {
  let upload = multer.single('avatar');
  upload(req, res, async (err) => {
    if ( err && err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      res.json(err);
    } else if (err) {
      // An unknown error occurred when uploading.
      res.json(err);
    }

    console.log(req.file.filename);
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.update({
        avatar: req.file.filename
      });
      // Everything went fine.
      res.redirect('/users');
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  })
})

router.get('/', async (req, res, next) => {
  var users = await User.findAll();
  if (!users.length) {
    hasher({ password: 'user1' }, async (err, pass, salt, hash) => {
      if (err) throw err;
      else {
        await User.create({
          name: 'user1',
          email: 'user1@express.com',
          salt: salt,
          hash: hash,
          avatar: 'a97d9675ab94ff804e1c3950c94c2587'
        });
        users = await User.findAll();
        res.render('user/index', {users: users, message: 'testone'});
      }
    });
  }
  else res.render('user/index', {users: users, message: 'testone'});
});

router.get('/:id', async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  res.json(user);
});

// router.post('/', async (req, res, next) => {
//   const user = await User.create(req.body);
//   res.json(user);
// });

router.post('/', async (req, res, next) => {
  hasher({ password: req.body.hash }, async (err, pass, salt, hash) => {
    if (err) throw err;
    else {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        salt: salt,
        hash: hash
      });
      var users = await User.findAll();
      res.render('user/index', {users: users});
    }
  });
});

router.put('/:id', async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.update(req.body);
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

router.delete('/:id', async (req, res, next) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    await user.destroy();
    res.json({ message: 'User deleted' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;
