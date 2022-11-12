const express = require('express');
const {getQuestions, getQuestionAnswers, getAnswers, getAnswersPhotos, saveQuestion, saveAnswer, savePhotos, incrementQuestionHelpfulnessCount, flagQuestionAsReported, incrementAnswerHelpfulnessCount, flagAnswerAsReported, findProductID} = require('./database.js');
const {LRUCache} = require('./cache.js')

let answersCache = new LRUCache(500);
let questionsCache = new LRUCache(500);

var app = express();
app.use(express.json());
app.use(express.static('static_files'));

app.get('/qa/questions', (req, res)=> {
  let product_id = req.query.product_id;

  let cacheID = `CID-${product_id}`;
  let cacheHit = questionsCache.get(cacheID);
  if (cacheHit != null) {
    return res.status(200).send(cacheHit);
  }

  let promise1 = getQuestions(product_id, req.query.count)
  .then((res) => {return res.rows})
  .catch((err) => {return 'err'})

  let promise2 = getQuestionAnswers(product_id, req.query.count)
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

      let finalResults = {
        product_id: product_id,
        results: questions
      };

      questionsCache.set(cacheID, finalResults)

      res.status(200).send(finalResults)
    }
  })
})

app.get('/qa/questions/*/answers', (req, res)=> {

  let question_id = req.params[0];
  let queryCount = req.query.count || 5;

  let cacheID = `CID-${question_id}`;
  let cacheHit = answersCache.get(cacheID);
  if (cacheHit != null) {
    return res.status(200).send(cacheHit);
  }

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

      let finalResults = {
        question: question_id,
        page: 1,
        count: queryCount,
        results: answers
      }
      answersCache.set(cacheID, finalResults);
      res.status(200).send(finalResults);
    }
  })
})

app.post('/qa/questions', (req, res)=> {
  let cacheID = `CID-${req.body.product_id}`;
  questionsCache.delete(cacheID);

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

  let cacheID = `CID-${question_id}`;
  if (answersCache.delete(cacheID) === true) {
    findProductID(question_id)
    .then((val)=> {
      product_id = val.rows[0].product_id;
      questionsCache.delete(`CID-${product_id}`)
    })
  }

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