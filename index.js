const express = require('express');
const api = require('/db');
const config = require('config.js');
const { port }

const app = express();

app.get('/qa/questions', (req, res) => {

});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
})

/******
 *
 *  WORK IN PROGRESS
 *
 ******/