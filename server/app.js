const express = require('express');
const {getQuestions, getQuestionAnswers, getQuestionAnswersPhotos, getAnswers, getAnswersPhotos, saveQuestion} = require('./database.js')

var app = express();
app.use(express.json());

app.get('/qa/questions', (req, res)=> {

  let promise1 = getQuestions(req.query.product_id, req.query.count)
  .then((res) => {return res.rows})
  .catch((err) => {return 'err'})

  let promise2 = getQuestionAnswers(req.query.product_id, req.query.count)
  .then((res) => {return res.rows})
  .catch((err) => {return 'err'})

  let promise3 = getQuestionAnswersPhotos(req.query.product_id, req.query.count)
  .then((res) => {return res.rows})
  .catch((err) => {return 'err'})

  Promise.all([promise1, promise2, promise3])
  .then(([questions, answers, photos])=> {

    if (questions === 'err' || answers === 'err' || photos === 'err') {
      res.status(500).send()
    } else {
      questions.forEach((question)=> {
        question.answers = {}
        answers.forEach((answer)=> {
          if (answer.question_id === question.question_id) {
            answer.id = answer.answer_id;
            answer.photos = []
            photos.forEach((photo)=> {
              if (photo.answer_id === answer.id) {
                answer.photos.push(photo)
              }
            })

            question.answers[answer.answer_id] = answer
          }
        })
      })

      res.status(200).send({
        product_id: req.query.product_id,
        results: questions
      })
    }
  })
})

app.get('/qa/questions/:*/answers', (req, res)=> {
  let question_id = req.params[0];
  let queryCount = req.query.count || 5;

  let promise1 = getAnswers(question_id, queryCount)
  .then((res) => {return res.rows})
  .catch((err) => {return 'err'})

  let promise2 = getAnswersPhotos(question_id, queryCount)
  .then((res) => {return res.rows})
  .catch((err) => {return 'err'})

  Promise.all([promise1, promise2])
  .then(([answers, photos])=> {

    if (answers === 'err' || photos === 'err') {
      res.status(500).send()
    } else {
      answers.forEach((answer)=> {
        answer.photos = []
        photos.forEach((photo)=> {
          if (photo.answer_id === answer.id) {
            answer.photos.push(photo)
          }
        })
      })

      res.status(200).send({
        question: question_id,
        page: 1,
        count: queryCount,
        results: answers
      })
    }
  })
})

app.post('/qa/questions', (req, res)=> {
  saveQuestion(req.body)
  .then(val=> {

    res.status(201).send()
  })
  .catch(err=> {
    console.log('server failed to save new question to DB')
    res.status(500).send()
  })

})


app.listen(3000);
console.log('Listening on port 3000');

