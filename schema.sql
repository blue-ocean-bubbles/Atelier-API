DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS answers;
DROP TABLE IF EXISTS photos;

CREATE TABLE "questions" (
	"id" serial NOT NULL,
	"product_id" bigint NOT NULL,
	"body" varchar(1000) NOT NULL,
	"date_written" DATE NOT NULL,
	"asker_name" varchar(60) NOT NULL,
	"asker_email" varchar(60) NOT NULL,
	"reported" BOOLEAN NOT NULL DEFAULT 'false',
	"helpful" int NOT NULL,
	CONSTRAINT "questions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "answers" (
	"id" serial NOT NULL,
	"question_id" serial NOT NULL,
	"body" varchar(1000) NOT NULL,
	"date_written" DATE NOT NULL,
	"answerer_name" varchar(60) NOT NULL,
	"answerer_email" varchar(60) NOT NULL,
	"reported" BOOLEAN NOT NULL DEFAULT 'false',
	"helpful" int NOT NULL,
	CONSTRAINT "answers_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "photos" (
	"id" serial NOT NULL,
	"answer_id" bigint NOT NULL,
	"url" varchar(255) NOT NULL,
	CONSTRAINT "photos_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "answers" ADD CONSTRAINT "answers_fk0" FOREIGN KEY ("question_id") REFERENCES "questions"("id");
ALTER TABLE "photos" ADD CONSTRAINT "photos_fk0" FOREIGN KEY ("answer_id") REFERENCES "answers"("id");
