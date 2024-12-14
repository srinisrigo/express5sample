'use strict'
var path = require('path');
const { Sequelize} = require('sequelize');
const sequelize = exports.sequelize = new Sequelize({
  dialect: 'sqlite',
  force: true,
  storage: path.join(__dirname, '../database.sqlite')
});
