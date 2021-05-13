const express = require('express');
const db = require('./db/db.js');
const api = require('./db/api.js');
const { port } = require('./config/config.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/qa/questions/:product_id', async (req, res) => {
  api.getQuestionList(req.params.product_id)
    .then((questionList) => {
      res.json(questionList);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

app.post('/qa/questions', (req, res) => {
  api.addQuestion(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(400);
    });
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  api.addAnswer(req.params.question_id, req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.sendStatus(400);
    });
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  api.markQuestionHelpful(req.params.question_id)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  api.markAnswerHelpful(req.params.answer_id)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.put('/qa/questions/:question_id/report', (req, res) => {
  api.reportQuestion(req.params.question_id)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  api.reportAnswer(req.params.answer_id)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

// verification for loader.io
app.get('/loaderio-ebf0c6588793bf3b02501b9af46ba8e9/', (req, res) => {
  res.send('loaderio-ebf0c6588793bf3b02501b9af46ba8e9');
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
