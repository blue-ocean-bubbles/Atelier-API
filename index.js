const express = require('express');
const db = require('./db/db.js');
const api = require('./db/api.js');
const { port } = require('./config/config.js');

const app = express();

app.get('/qa/questions/:product_id', async (req, res) => {
  const id = req.params.product_id;
  console.log(`serving GET request to /qa/questions/${id}`);
  console.log(api.getQuestionList(id))
  api.getQuestionList(id)
    .then((questionList) => {
      res.json(questionList);
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
})
