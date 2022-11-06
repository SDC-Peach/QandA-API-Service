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

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  answer_id int NOT NULL REFERENCES answers (answer_id),
  url varchar(255) NOT NULL
);
