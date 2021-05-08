const express = require('express');
const db = require('./db/db.js');
const api = require('./db/api.js');
const { port } = require('./config/config.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/qa/questions/:product_id', async (req, res) => {
  const id = req.params.product_id;
  console.log(`serving GET request to /qa/questions/${id}`);
  api.getQuestionList(id)
    .then((questionList) => {
      res.json(questionList);
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

app.post('/qa/questions', (req, res) => {
  console.log('serving POST request to /qa/questions');
  api.addQuestion(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.end();
    });
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
})
