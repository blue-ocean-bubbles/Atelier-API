const { sequelize } = require('./db.js');

module.exports.getQuestionList = (productId) => {
  return new Promise((resolve, reject) => {
    sequelize.query(
        `SELECT id AS question_id, body AS question_body, date_written AS question_date, asker_name, helpful AS question_helpfulness, reported
        FROM questions WHERE product_id = ${productId} AND NOT reported`
      )
      .then((response) => (response[0]))
      .then((questions) => {
        let answers = questions.map((question) =>
          sequelize.query(
            `SELECT id, body, date_written AS date, answerer_name, helpful AS helpfulness
            FROM answers WHERE question_id = ${question.question_id} AND NOT reported`
          )
        );
        Promise.all(answers)
          .then((answers) => {
            for (var i = 0; i < answers.length; i++) {
              answers[i] = answers[i][0];
            }
            let flatAnswers = answers.flat();
            let photos = flatAnswers.map((answer) =>
              sequelize.query(`SELECT url FROM photos WHERE answer_id = ${answer.id}`)
            );
            Promise.all(photos)
              .then((photos) => {
                for (var j = 0; j < photos.length; j++) {
                  photos[j] = photos[j][0];
                }
                resolve(formatQuestionList(questions, answers, photos, productId));
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports.addQuestion = (form) => {
  const { body, name, email } = form;
  const id = parseInt(form.product_id);
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

  return sequelize.query(
    `INSERT INTO questions(product_id, body, date_written, asker_name, asker_email, helpful)
    VALUES (${id}, '${body}', '${date}', '${name}', '${email}', 0)`
  )
    .catch((err) => {
      console.log(err);
    });
};

module.exports.addAnswer = (questionId, form) => {
  const { body, name, email, photos } = form;
  const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

  return sequelize.query(
    `INSERT INTO answers(question_id, body, date_written, answerer_name, answerer_email)
    VALUES (${questionId}, '${body}', '${date}', '${name}', '${email}')
    RETURNING id`
  )
    .then((answerId) => {
      const photoQueries = photos.map((url) =>
        sequelize.query(`INSERT INTO photos(answer_id, url)
          VALUES (${answerId[0][0].id}, '${url}')`)
      );
      return Promise.all(photoQueries);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports.markQuestionHelpful = (questionId) => {
  return sequelize.query(
    `UPDATE questions SET helpful = helpful + 1 WHERE id = ${questionId}`
  )
    .catch((err) => {
      console.log(err);
    });
};

module.exports.markAnswerHelpful = (answerId) => {
  return sequelize.query(
    `UPDATE answers SET helpful = helpful + 1 WHERE id = ${answerId}`
  )
    .catch((err) => {
      console.log(err);
    });
};

module.exports.reportQuestion = (questionId) => {
  return sequelize.query(
    `UPDATE questions SET reported = true WHERE id = ${questionId}`
  )
    .catch((err) => {
      console.log(err);
    });
};

module.exports.reportAnswer = (answerId) => {
  return sequelize.query(
    `UPDATE answers SET reported = true WHERE id = ${answerId}`
  )
    .catch((err) => {
      console.log(err);
    });
};

formatQuestionList = (questions, answers, photos, productId) => {
  let answerTemplate = {};

  for (let i = 0; i < answers.length; i++) {
    for (let j = 0; j < answers[i].length; j++) {
      answers[i][j].photos = photos[j].map(photo => photo.url);
      answerTemplate[answers[i][j].id] = answers[i][j];
    }
    answers[i] = answerTemplate;
    answerTemplate = {};
  }

  for (let i = 0; i < questions.length; i++) {
    questions[i].answers = answers[i];
  }

  return {
    'product_id': productId,
    'results': questions
  };
};
