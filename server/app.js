const express = require('express');
const {getQuestions, getQuestionAnswers, getAnswers, getAnswersPhotos, saveQuestion, saveAnswer, savePhotos, incrementQuestionHelpfulnessCount, flagQuestionAsReported, incrementAnswerHelpfulnessCount, flagAnswerAsReported} = require('./database.js')

var app = express();
app.use(express.json());

app.get('/qa/questions', (req, res)=> {

  let promise1 = getQuestions(req.query.product_id, req.query.count)
  .then((res) => {return res.rows})
  .catch((err) => {return 'err'})

  let promise2 = getQuestionAnswers(req.query.product_id, req.query.count)
  .then((res) => {return res.rows})
  .catch((err) => {return 'err'})

  Promise.all([promise1, promise2])
  .then(([questions, answers])=> {

    if (questions === 'err' || answers === 'err') {
      res.status(500).send()
    } else {
      questions.forEach((question)=> {
        question.answers = {}
        answers.forEach((answer)=> {
          if (answer.question_id === question.question_id) {
            delete answer.question_id;
            question.answers[answer.id] = answer
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

app.get('/qa/questions/*/answers', (req, res)=> {
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
          if (photo.answer_id === answer.answer_id) {
            delete photo.answer_id;
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
    res.status(500).send()
  })
})

app.post('/qa/questions/*/answers', (req, res)=> {
  let question_id = req.query.question_id || req.params[0];

  saveAnswer(question_id, req.body)
  .then(generatedAnswerID=> {
    generatedAnswerID = generatedAnswerID.rows[0].answer_id;

    if (req.body.photos.length > 0) {
      savePhotos(generatedAnswerID, req.body.photos)
      .then(()=>{
        res.status(201).send()
      })
      .catch(err=> {
        res.status(500).send()
      })
    } else {
      res.status(201).send()
    }
  })
  .catch(err=> {
    res.status(500).send()
  })
})

app.put('/qa/questions/*/helpful', (req, res)=> {
  let question_id = req.query.question_id || req.params[0];
  incrementQuestionHelpfulnessCount(question_id)
  .then(val=>{
    res.status(204).send();
  })
  .catch(err=>{
    res.status(500).send();
  })
})

app.put('/qa/questions/*/report', (req, res)=> {
  let question_id = req.query.question_id || req.params[0];
  flagQuestionAsReported(question_id)
  .then(val=>{
    res.status(204).send();
  })
  .catch(err=>{
    res.status(500).send();
  })
})

app.put('/qa/answers/*/helpful', (req, res)=> {
  let answer_id = req.query.answer_id || req.params[0];
  incrementAnswerHelpfulnessCount(answer_id)
  .then(val=>{
    res.status(204).send();
  })
  .catch(err=>{
    res.status(500).send();
  })
})

app.put('/qa/answers/*/report', (req, res)=> {
  let answer_id = req.query.answer_id || req.params[0];
  flagAnswerAsReported(answer_id)
  .then(val=>{
    res.status(204).send();
  })
  .catch(err=>{
    res.status(500).send();
  })
})

app.listen(3000);
console.log('Listening on port 3000');