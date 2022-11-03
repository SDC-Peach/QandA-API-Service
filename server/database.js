const {Pool} = require('pg');
const {POSTGRESQL_USER, POSTGRESQL_PASSWORD, POSTGRESQL_PORT} = require('../config.js');

const pool = new Pool({
  user: POSTGRESQL_USER,
  host: 'localhost',
  database: 'qanda',
  password: POSTGRESQL_PASSWORD,
  port: POSTGRESQL_PORT,
})

const getQuestions = function (product_id, count, successCB, errCB) {
  return pool.connect()
  .then(client=> {
    return client
      .query(`SELECT * FROM questions WHERE product_id='${product_id}' LIMIT ${count}`)
      .then(res => {
        client.release();
        successCB(res.rows);
      })
      .catch(err => {
        client.release();
        errCB(err.stack);
      })
  })
}

module.exports = {
  getQuestions: getQuestions
}