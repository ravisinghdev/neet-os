create table if not exists questions (
  id serial primary key,
  subject text,
  chapter text,
  dpp text,
  question text,
  options jsonb,
  answer_index int,
  explanation text
);

create unique index if not exists unique_question_text
on questions (lower(trim(question)));
