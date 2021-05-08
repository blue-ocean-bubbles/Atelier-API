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
            flatAnswers = answers.flat();
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
          })
      })
    .catch((err) => {
      console.log(err);
    });
  });
}

// module.exports.addQuestion = (form) => {
//   const { body, name, email } = form;
//   const id = parseInt(form.product_id);

//   return new Promise((resolve, reject) => {
//     // HERE HERE HERE
//     sequelize.query(`INSERT INTO questions ...`)
//   });
// };

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
}

// module.exports.getQuestionList(1)
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   })
