const { Sequelize } = require('sequelize');
const { DB_USERNAME, DB_PASSWORD } = require('../config/config.js');

const sequelize = new Sequelize('qna', DB_USERNAME, DB_PASSWORD, {
  host: 'localhost',
  dialect: 'postgres'
});

sequelize.authenticate()
  .then(res => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', error);
  });

module.exports = sequelize;