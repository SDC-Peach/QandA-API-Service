const { Client, Pool } = require('pg')
const {POSTGRESQL_USER, POSTGRESQL_PASSWORD, POSTGRESQL_PORT} = require('./config.js');

const pool = new Pool({
  user: POSTGRESQL_USER,
  host: 'localhost',
  database: 'qanda',
  password: POSTGRESQL_PASSWORD,
  port: POSTGRESQL_PORT,
})

// const photosSchema = 'CREATE TABLE photos (id int NOT NULL PRIMARY KEY, answer_id int NOT NULL, url varchar(255) NOT NULL)';

// const photosCVS = "COPY photos FROM '/Users/bentanaka/QandA-API-Service/answers_photos.csv' DELIMITER ',' CSV HEADER";

// pool.query(photosSchema, (err, res)=> {
//   if (err) {
//     console.log(err);
//     pool.end()
//   } else {
//     console.log('created empty photos table!', res);
//     pool.query(photosCVS, (err, res)=> {
//       if (err) {
//         console.log(err);
//         pool.end()
//       } else {
//         console.log('imported csv data to photos table', res);
//         pool.end()
//       }
//     });
//   }
// })

// const questionsSchema = 'CREATE TABLE questions (id serial PRIMARY KEY, product_id int NOT NULL, body varchar(1000) NOT NULL, date_written bigint, asker_name varchar(60) NOT NULL, asker_email varchar(60) NOT NULL, reported int, helpful int NOT NULL)';
const questionsSchema = 'CREATE TABLE questions (id SERIAL PRIMARY KEY, product_id int NOT NULL, body varchar(1000) NOT NULL, date_written double precision, asker_name varchar(60) NOT NULL, asker_email varchar(60) NOT NULL, reported int, helpful int DEFAULT 0)';

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
        pool.query('ALTER TABLE questions ALTER COLUMN reported TYPE bool USING CASE WHEN reported=0 THEN false ELSE true END, ALTER COLUMN reported SET DEFAULT False', (err, res)=> {
          if (err) {
            console.log(err)
            pool.end()
          } else {
            console.log('converted reported column to boolean', res);

            pool.query("SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions))", (err, res)=> {
              if (err) {
                console.log(err);
                pool.end();
              } else {
                console.log('changed ID so its synced and next inserted row wont try to be ID 2');

                pool.query("ALTER TABLE questions ALTER COLUMN date_written type varchar(60) USING to_char(to_timestamp(date_written/1000.0) at time zone 'UTC', 'yyyy-mm-ddThh24:mi:ss.ff3Z')", (err, res)=> {
                  if (err) {
                    console.log(err)
                    pool.end();
                  } else {
                    console.log('date column changed to timestamp!', res);
                    pool.end()
                  }
                })

              }
            })
          }
        })

      }
    });
  }
})

// const answersSchema = 'CREATE TABLE answers (id int NOT NULL PRIMARY KEY, question_id int NOT NULL, body varchar(1000) NOT NULL, date_written bigint, answerer_name varchar(60) NOT NULL, answerer_email varchar(60) NOT NULL, reported int NOT NULL, helpful int NOT NULL)';

// const answersCVS = "COPY answers FROM '/Users/bentanaka/QandA-API-Service/answers.csv' DELIMITER ',' CSV HEADER";

// pool.query(answersSchema, (err, res)=> {
//   if (err) {
//     console.log(err);
//     pool.end()
//   } else {
//     console.log('created empty answers table!', res);
//     pool.query(answersCVS, (err, res)=> {
//       if (err) {
//         console.log(err);
//         pool.end()
//       } else {
//         console.log('imported csv data to answers table', res);
//         pool.end()
//       }
//     });
//   }
// })
