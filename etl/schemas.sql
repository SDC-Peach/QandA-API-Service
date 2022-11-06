DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS questions;

CREATE TABLE questions (
  question_id SERIAL PRIMARY KEY,
  product_id int NOT NULL,
  question_body varchar(1000) NOT NULL,
  question_date double precision,
  asker_name varchar(60) NOT NULL,
  asker_email varchar(60) NOT NULL,
  reported int,
  question_helpfulness int DEFAULT 0
);

COPY questions FROM '/Users/bentanaka/QandA-API-Service/etl/questions.csv' DELIMITER ',' CSV HEADER ;

ALTER TABLE questions ALTER COLUMN reported TYPE bool USING CASE WHEN reported=0 THEN false ELSE true END, ALTER COLUMN reported SET DEFAULT False;

SELECT setval('questions_question_id_seq', (SELECT MAX(question_id) FROM questions));

ALTER TABLE questions ALTER COLUMN question_date type varchar(60) USING to_char(to_timestamp(question_date/1000.0) at time zone 'UTC', 'yyyy-mm-ddThh24:mi:ss.ff3Z'), ALTER COLUMN question_date SET DEFAULT to_char(CURRENT_TIMESTAMP at time zone 'UTC', 'yyyy-mm-ddThh24:mi:ss.ff3Z');

CREATE INDEX idx_product_id ON questions(product_id);

CREATE TABLE answers (
  answer_id SERIAL PRIMARY KEY,
  question_id int NOT NULL REFERENCES questions (question_id),
  body varchar(1000) NOT NULL,
  date double precision,
  answerer_name varchar(60) NOT NULL,
  answerer_email varchar(60) NOT NULL,
  reported int,
  helpfulness int DEFAULT 0
);

COPY answers FROM '/Users/bentanaka/QandA-API-Service/etl/answers.csv' DELIMITER ',' CSV HEADER;

ALTER TABLE answers ALTER COLUMN reported TYPE bool USING CASE WHEN reported=0 THEN false ELSE true END, ALTER COLUMN reported SET DEFAULT False;

SELECT setval('answers_answer_id_seq', (SELECT MAX(answer_id) FROM answers));

ALTER TABLE answers ALTER COLUMN date type varchar(60) USING to_char(to_timestamp(date/1000.0) at time zone 'UTC', 'yyyy-mm-ddThh24:mi:ss.ff3Z'), ALTER COLUMN date SET DEFAULT to_char(CURRENT_TIMESTAMP at time zone 'UTC', 'yyyy-mm-ddThh24:mi:ss.ff3Z');

CREATE INDEX idx_question_id ON answers(question_id);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  answer_id int NOT NULL REFERENCES answers (answer_id),
  url varchar(255) NOT NULL
);

COPY photos FROM '/Users/bentanaka/QandA-API-Service/etl/answers_photos.csv' DELIMITER ',' CSV HEADER;

SELECT setval('photos_id_seq', (SELECT MAX(id) FROM photos));

CREATE INDEX idx_answer_id ON photos(answer_id);