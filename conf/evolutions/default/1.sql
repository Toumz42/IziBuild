# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table calendar_event (
  id                            bigint auto_increment not null,
  title                         varchar(255),
  start                         datetime(6),
  end                           datetime(6),
  color                         varchar(255),
  classe_id                     bigint,
  prof_id                       bigint,
  constraint pk_calendar_event primary key (id)
);

create table classe (
  id                            bigint auto_increment not null,
  name                          varchar(255),
  constraint pk_classe primary key (id)
);

create table classe_matiere (
  classe_id                     bigint not null,
  matiere_id                    bigint not null,
  constraint pk_classe_matiere primary key (classe_id,matiere_id)
);

create table groupe_projet (
  id                            bigint auto_increment not null,
  theme                         varchar(255),
  date_soutenance               datetime(6),
  constraint pk_groupe_projet primary key (id)
);

create table matiere (
  id                            bigint auto_increment not null,
  matiere                       varchar(255),
  coef                          double,
  constraint pk_matiere primary key (id)
);

create table note (
  id                            bigint auto_increment not null,
  user_id                       bigint,
  matiere_id                    bigint,
  note                          integer,
  constraint pk_note primary key (id)
);

create table suivi_projet (
  id                            bigint auto_increment not null,
  date_suivi                    datetime(6),
  contenu                       varchar(255),
  etat                          integer,
  groupe_id                     bigint,
  constraint pk_suivi_projet primary key (id)
);

create table user (
  id                            bigint auto_increment not null,
  name                          varchar(255),
  surname                       varchar(255),
  email                         varchar(255),
  login                         varchar(255),
  password                      varchar(255),
  droit                         integer,
  classe_id                     bigint,
  groupe_id                     bigint,
  constraint pk_user primary key (id)
);

alter table calendar_event add constraint fk_calendar_event_classe_id foreign key (classe_id) references classe (id) on delete restrict on update restrict;
create index ix_calendar_event_classe_id on calendar_event (classe_id);

alter table calendar_event add constraint fk_calendar_event_prof_id foreign key (prof_id) references user (id) on delete restrict on update restrict;
create index ix_calendar_event_prof_id on calendar_event (prof_id);

alter table classe_matiere add constraint fk_classe_matiere_classe foreign key (classe_id) references classe (id) on delete restrict on update restrict;
create index ix_classe_matiere_classe on classe_matiere (classe_id);

alter table classe_matiere add constraint fk_classe_matiere_matiere foreign key (matiere_id) references matiere (id) on delete restrict on update restrict;
create index ix_classe_matiere_matiere on classe_matiere (matiere_id);

alter table note add constraint fk_note_user_id foreign key (user_id) references user (id) on delete restrict on update restrict;
create index ix_note_user_id on note (user_id);

alter table note add constraint fk_note_matiere_id foreign key (matiere_id) references matiere (id) on delete restrict on update restrict;
create index ix_note_matiere_id on note (matiere_id);

alter table suivi_projet add constraint fk_suivi_projet_groupe_id foreign key (groupe_id) references groupe_projet (id) on delete restrict on update restrict;
create index ix_suivi_projet_groupe_id on suivi_projet (groupe_id);

alter table user add constraint fk_user_classe_id foreign key (classe_id) references classe (id) on delete restrict on update restrict;
create index ix_user_classe_id on user (classe_id);

alter table user add constraint fk_user_groupe_id foreign key (groupe_id) references groupe_projet (id) on delete restrict on update restrict;
create index ix_user_groupe_id on user (groupe_id);


# --- !Downs

alter table calendar_event drop foreign key fk_calendar_event_classe_id;
drop index ix_calendar_event_classe_id on calendar_event;

alter table calendar_event drop foreign key fk_calendar_event_prof_id;
drop index ix_calendar_event_prof_id on calendar_event;

alter table classe_matiere drop foreign key fk_classe_matiere_classe;
drop index ix_classe_matiere_classe on classe_matiere;

alter table classe_matiere drop foreign key fk_classe_matiere_matiere;
drop index ix_classe_matiere_matiere on classe_matiere;

alter table note drop foreign key fk_note_user_id;
drop index ix_note_user_id on note;

alter table note drop foreign key fk_note_matiere_id;
drop index ix_note_matiere_id on note;

alter table suivi_projet drop foreign key fk_suivi_projet_groupe_id;
drop index ix_suivi_projet_groupe_id on suivi_projet;

alter table user drop foreign key fk_user_classe_id;
drop index ix_user_classe_id on user;

alter table user drop foreign key fk_user_groupe_id;
drop index ix_user_groupe_id on user;

drop table if exists calendar_event;

drop table if exists classe;

drop table if exists classe_matiere;

drop table if exists groupe_projet;

drop table if exists matiere;

drop table if exists note;

drop table if exists suivi_projet;

drop table if exists user;

