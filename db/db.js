const { Sequelize } = require('sequelize');
const { DB_USERNAME, DB_PASSWORD, DB_ADDRESS } = require('../config/config.js');

const sequelize = new Sequelize('qna', DB_USERNAME, DB_PASSWORD, {
  host: DB_ADDRESS,
  dialect: 'postgres',
  // logging: false
});

sequelize.authenticate()
  .then(res => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = { sequelize };
