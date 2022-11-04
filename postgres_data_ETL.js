const {Pool} = require('pg');
const {POSTGRESQL_USER, POSTGRESQL_PASSWORD, POSTGRESQL_PORT} = require('./config.js');

const pool = new Pool({
  user: POSTGRESQL_USER,
  host: 'localhost',
  database: 'qanda',
  password: POSTGRESQL_PASSWORD,
  port: POSTGRESQL_PORT,
})

const copyCVS = function (inp) {
  return `COPY ${inp} FROM '/Users/bentanaka/QandA-API-Service/${inp}.csv' DELIMITER ',' CSV HEADER`
}
const alterReportedColumn = function(inp) {
  return `ALTER TABLE ${inp} ALTER COLUMN reported TYPE bool USING CASE WHEN reported=0 THEN false ELSE true END, ALTER COLUMN reported SET DEFAULT False`
}

const resetPrimaryKeySequence = function (inp, idColName) {
  return `SELECT setval('${inp}_${idColName}_seq', (SELECT MAX(${idColName}) FROM ${inp}))`
}

const alterUnixTimeToTimestamp = function (inp, dateColName) {
  return `ALTER TABLE ${inp} ALTER COLUMN ${dateColName} type varchar(60) USING to_char(to_timestamp(${dateColName}/1000.0) at time zone 'UTC', 'yyyy-mm-ddThh24:mi:ss.ff3Z'), ALTER COLUMN ${dateColName} SET DEFAULT to_char(CURRENT_TIMESTAMP at time zone 'UTC', 'yyyy-mm-ddThh24:mi:ss.ff3Z')`
}

const photosSchema = 'CREATE TABLE photos (id SERIAL PRIMARY KEY, answer_id int NOT NULL, url varchar(255) NOT NULL)';

const photosCVS = "COPY photos FROM '/Users/bentanaka/QandA-API-Service/answers_photos.csv' DELIMITER ',' CSV HEADER";

pool.query(photosSchema, (err, res)=> {
  if (err) {
    console.log(err);
    pool.end()
  } else {
    console.log('created empty photos table!');
    pool.query(photosCVS, (err, res)=> {
      if (err) {
        console.log(err);
        pool.end()
      } else {
        console.log('imported csv data to photos table');
        pool.query(resetPrimaryKeySequence('photos', 'id'), (err, res)=> {
          if (err) {
            console.log(err);
            pool.end()
          } else {
            console.log('changed ID so its synced and next inserted row wont try to be ID 2');
            loadQuestionsDB()
          }
        })

      }
    });
  }
})

const questionsSchema = 'CREATE TABLE questions (question_id SERIAL PRIMARY KEY, product_id int NOT NULL, question_body varchar(1000) NOT NULL, question_date double precision, asker_name varchar(60) NOT NULL, asker_email varchar(60) NOT NULL, reported int, question_helpfulness int DEFAULT 0)';

const loadQuestionsDB = ()=> {
  pool.query(questionsSchema, (err, res)=> {
    if (err) {
      console.log(err);
      pool.end()
    } else {
      console.log('created empty questions table!');
      pool.query(copyCVS('questions'), (err, res)=> {
        if (err) {
          console.log(err);
          pool.end()
        } else {
          console.log('imported csv data to questions table');
          pool.query(alterReportedColumn('questions'), (err, res)=> {
            if (err) {
              console.log(err)
              pool.end()
            } else {
              console.log('converted reported column to boolean');
              pool.query(resetPrimaryKeySequence('questions', 'question_id'), (err, res)=> {
                if (err) {
                  console.log(err);
                  pool.end();
                } else {
                  console.log('changed ID so its synced and next inserted row wont try to be ID 2');
                  pool.query(alterUnixTimeToTimestamp('questions', 'question_date'), (err, res)=> {
                    if (err) {
                      console.log(err)
                      pool.end();
                    } else {
                      console.log('date column changed to timestamp!');
                      loadAnswersDB()
                    }
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}

const answersSchema = 'CREATE TABLE answers (answer_id SERIAL PRIMARY KEY, question_id int NOT NULL, body varchar(1000) NOT NULL, date double precision, answerer_name varchar(60) NOT NULL, answerer_email varchar(60) NOT NULL, reported int, helpfulness int DEFAULT 0)';

const loadAnswersDB = ()=> {
  pool.query(answersSchema, (err, res)=> {
    if (err) {
      console.log(err);
      pool.end()
    } else {
      console.log('created empty answers table!');
      pool.query(copyCVS('answers'), (err, res)=> {
        if (err) {
          console.log(err);
          pool.end()
        } else {
          console.log('imported csv data to answers table');
          pool.query(alterReportedColumn('answers'), (err, res)=> {
            if (err) {
              console.log(err)
              pool.end()
            } else {
              console.log('converted reported column to boolean');
              pool.query(resetPrimaryKeySequence('answers', 'answer_id'), (err, res)=> {
                if (err) {
                  console.log(err);
                  pool.end()
                } else {
                  console.log('changed ID so its synced and next inserted row wont try to be ID 2');
                  pool.query(alterUnixTimeToTimestamp('answers', 'date'), (err, res)=> {
                    if (err) {
                      console.log(err);
                      pool.end();
                    } else {
                      console.log('date column changed to timestamp!');
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
}