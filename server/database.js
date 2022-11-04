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

    // const crazyQuery = `INSERT INTO joined (question_id, question_body, question_date, asker_name, asker_email, question_helpfulness, reported, answers)
    // SELECT q.question_id, q.question_body, q.question_date, q.asker_name, q.asker_email, q.question_helpfulness, q.reported, array_agg(answers)
    // FROM questions q WHERE product_id='${product_id}' LIMIT ${count}
    //   JOIN answers a ON a.question_id = q.question_id
    // GROUP BY q.question_id, q.question_id`

  return pool.connect()
  .then(client=> {
    return client
      .query(`SELECT * FROM answers WHERE question_id IN (SELECT question_id FROM questions WHERE product_id='${product_id}' LIMIT ${count})`)
      .then(res => {
        client.release();
        successCB(res.rows);
      })
      .catch(err => {
        console.log(err)
        client.release();
        errCB(err.stack);
      })
  })

  // return pool.connect()
  // .then(client=> {
  //   return client
  //     .query(`SELECT * FROM questions WHERE product_id='${product_id}' LIMIT ${count}`)
  //     // .query(crazyQuery)
  //     .then(res => {
  //       client.release();
  //       successCB({product_id: product_id,
  //         results: res.rows
  //         });
  //     })
  //     .catch(err => {
  //       client.release();
  //       errCB(err.stack);
  //     })
  // })
}

module.exports = {
  getQuestions: getQuestions
}