const express = require('express');
const db = require('./db/db.js');
const api = require('./db/api.js');
const { port } = require('./config/config.js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/qa/questions/:product_id', async (req, res) => {
  console.log(`serving GET request to /qa/questions/${req.params.product_id}`);
  api.getQuestionList(req.params.product_id)
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
      res.sendStatus(400);
    });
});

app.post('/qa/questions/:question_id/answers', (req, res) => {
  console.log(`serving POST request to /qa/questions/${req.params.question_id}/answers`);
  api.addAnswer(req.params.question_id, req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.end();
    });
});

app.put('/qa/questions/:question_id/helpful', (req, res) => {
  console.log(`serving PUT request to /qa/questions/${req.params.question_id}/helpful`);
  api.markQuestionHelpful(req.params.question_id)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  console.log(`serving PUT request to /qa/answers/${req.params.answer_id}/helpful`);
  api.markAnswerHelpful(req.params.answer_id)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

app.put('/qa/questions/:question_id/report', (req, res) => {
  console.log(`serving PUT request to /qa/questions/${req.params.question_id}/report`);
  api.reportQuestion(req.params.question_id)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

app.put('/qa/answers/:answer_id/report', (req, res) => {
  console.log(`serving PUT request to /qa/answers/${req.params.answer_id}/report`);
  api.reportAnswer(req.params.answer_id)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      console.log(err);
      res.end();
    });
});

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
})
