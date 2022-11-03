const { Client, Pool } = require('pg')
const {POSTGRESQL_PASSWORD, POSTGRESQL_PORT} = require('./config.js');

const pool = new Pool({
  user: 'bentanaka',
  host: 'localhost',
  database: 'qanda',
  password: POSTGRESQL_PASSWORD,
  port: POSTGRESQL_PORT,
})

const photosSchema = 'CREATE TABLE photos (id int NOT NULL PRIMARY KEY, answer_id int NOT NULL, url varchar(255) NOT NULL)';

const photosCVS = "COPY photos FROM '/Users/bentanaka/QandA-API-Service/answers_photos.csv' DELIMITER ',' CSV HEADER";

pool.query(photosSchema, (err, res)=> {
  if (err) {
    console.log(err);
    pool.end()
  } else {
    console.log('created empty photos table!', res);
    pool.query(photosCVS, (err, res)=> {
      if (err) {
        console.log(err);
        pool.end()
      } else {
        console.log('imported csv data to photos table', res);
        pool.end()
      }
    });
  }
})

const questionsSchema = 'CREATE TABLE questions (id int NOT NULL PRIMARY KEY, product_id int NOT NULL, body varchar(1000) NOT NULL, date_written_untransformed bigint, asker_name varchar(60) NOT NULL, asker_email varchar(60) NOT NULL, reported int NOT NULL, helpful int NOT NULL)';

const questionsCVS = "COPY questions FROM '/Users/bentanaka/QandA-API-Service/questions.csv' DELIMITER ',' CSV HEADER";

pool.query(questionsSchema, (err, res)=> {
  if (err) {
    console.log(err);
    pool.end()
  } else {
    console.log('created empty questions table!', res);
    pool.query(questionsCVS, (err, res)=> {
      if (err) {
        console.log(err);
        pool.end()
      } else {
        console.log('imported csv data to questions table', res);
        pool.end()
      }
    });
  }
})

const answersSchema = 'CREATE TABLE answers (id int NOT NULL PRIMARY KEY, question_id int NOT NULL, body varchar(1000) NOT NULL, date_written_untransformed bigint, answerer_name varchar(60) NOT NULL, answerer_email varchar(60) NOT NULL, reported int NOT NULL, helpful int NOT NULL)';

const answersCVS = "COPY answers FROM '/Users/bentanaka/QandA-API-Service/answers.csv' DELIMITER ',' CSV HEADER";

pool.query(answersSchema, (err, res)=> {
  if (err) {
    console.log(err);
    pool.end()
  } else {
    console.log('created empty answers table!', res);
    pool.query(answersCVS, (err, res)=> {
      if (err) {
        console.log(err);
        pool.end()
      } else {
        console.log('imported csv data to answers table', res);
        pool.end()
      }
    });
  }
})
