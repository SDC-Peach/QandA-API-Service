const {Pool} = require('pg');
const {POSTGRESQL_USER, POSTGRESQL_PASSWORD, POSTGRESQL_PORT} = require('../config.js');

const pool = new Pool({
  user: POSTGRESQL_USER,
  host: 'localhost',
  database: 'qanda',
  password: POSTGRESQL_PASSWORD,
  port: POSTGRESQL_PORT,
})

const getQuestions = function (product_id, count) {
  return pool.query(`SELECT * FROM questions WHERE product_id='${product_id}' LIMIT ${count}`)
}

const getQuestionAnswers = function (product_id, count) {
  return pool.query(`SELECT * FROM answers WHERE question_id IN (SELECT question_id FROM questions WHERE product_id='${product_id}' LIMIT ${count})`)
}

const getQuestionAnswersPhotos = function (product_id, count) {
  return pool.query(`SELECT * FROM photos WHERE answer_id IN (SELECT answer_id FROM answers WHERE question_id IN (SELECT question_id FROM questions WHERE product_id='${product_id}' LIMIT ${count}))`)
}

const getAnswers = function (question_id, count) {
  console.log (...arguments)
  return pool.query(`SELECT * FROM answers WHERE question_id='${question_id}' LIMIT ${count}`)
}
const getAnswersPhotos = function (question_id, count) {
  return pool.query(`SELECT * FROM photos WHERE answer_id IN (SELECT answer_id FROM answers WHERE question_id='${question_id}' LIMIT ${count})`)
}

const saveQuestion = function(formData) {
  return pool.query('INSERT INTO questions (product_id, question_body, asker_name, asker_email) VALUES ($1, $2, $3, $4)', [formData.product_id, formData.body, formData.name, formData.email])
}

module.exports = {
  getQuestions: getQuestions,
  getQuestionAnswers: getQuestionAnswers,
  getQuestionAnswersPhotos: getQuestionAnswersPhotos,
  getAnswers: getAnswers,
  getAnswersPhotos: getAnswersPhotos,
  saveQuestion: saveQuestion
}