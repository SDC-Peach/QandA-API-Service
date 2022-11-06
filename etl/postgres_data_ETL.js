const {Pool} = require('pg');
const {POSTGRESQL_USER, POSTGRESQL_PASSWORD, POSTGRESQL_PORT} = require('../config.js');

const pool = new Pool({
  user: POSTGRESQL_USER,
  host: 'localhost',
  database: 'qanda',
  password: POSTGRESQL_PASSWORD,
  port: POSTGRESQL_PORT,
})

const copyCVS = function (inp) {
  return `COPY ${inp} FROM '/Users/bentanaka/QandA-API-Service/etl/${inp}.csv' DELIMITER ',' CSV HEADER`
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

const photosCVS = "COPY photos FROM '/Users/bentanaka/QandA-API-Service/etl/answers_photos.csv' DELIMITER ',' CSV HEADER";

const loadQuestionsDB = ()=> {
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

const loadAnswersDB = ()=> {
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
                  loadPhotosDB()
                }
              })
            }
          })
        }
      })
    }
  });
}

const loadPhotosDB = ()=> {
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
          pool.end()
        }
      })

    }
  });
}

loadQuestionsDB();
