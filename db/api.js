const { sequelize } = require('./db.js');

module.exports.getQuestionList = (productId) => {
  return new Promise((resolve, reject) => {
    sequelize.query(`SELECT * FROM questions WHERE product_id = ${productId}`)
      .then((response) => (response[0]))
      .then((questions) => {
        let answers = questions.map((question) =>
          sequelize.query(`SELECT * FROM answers WHERE question_id = ${question.id}`)
        );
        Promise.all(answers)
          .then((answers) => {
            for (var i = 0; i < answers.length; i++) {
              answers[i] = answers[i][0];
            }
            flatAnswers = answers.flat();
            let photos = flatAnswers.map((answer) =>
              sequelize.query(`SELECT * FROM photos WHERE answer_id = ${answer.id}`)
            );
            Promise.all(photos)
              .then((photos) => {
                for (var j = 0; j < photos.length; j++) {
                  photos[j] = photos[j][0];
                }
                resolve(formatQuestionList(questions, answers, photos));
              })
          })
      })
    .catch((err) => {
      console.log(err);
    });
  });
}

formatQuestionList = (questions, answers, photos) => {
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

  return questions;
}

// module.exports.getQuestionList(1)
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   })
