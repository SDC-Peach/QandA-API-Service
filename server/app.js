const express = require('express');
const {getQuestions} = require('./database.js')

var app = express();

app.get('/qa/questions', (req, res)=> {

  getQuestions(req.query.product_id, req.query.count,
    results=>res.status(200).send(results),
    err=>res.status(500).send('database query error')
  )

})

app.listen(3000);
console.log('Listening on port 3000');