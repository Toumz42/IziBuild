# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table calendar_event (
  id                            bigint auto_increment not null,
  title                         varchar(255),
  start                         datetime(6),
  end                           datetime(6),
  color                         varchar(255),
  user_id                       bigint,
  projet_id                     bigint,
  constraint pk_calendar_event primary key (id)
);

create table calendar_event_user (
  calendar_event_id             bigint not null,
  user_id                       bigint not null,
  constraint pk_calendar_event_user primary key (calendar_event_id,user_id)
);

create table mail_token (
  id                            bigint auto_increment not null,
  token                         varchar(255),
  expire_date                   datetime(6),
  user_id                       bigint,
  constraint uq_mail_token_user_id unique (user_id),
  constraint pk_mail_token primary key (id)
);

create table message (
  id                            bigint auto_increment not null,
  message                       varchar(255),
  date                          datetime(6),
  expediteur_id                 bigint,
  destinataire_id               bigint,
  constraint pk_message primary key (id)
);

create table projet (
  id                            bigint auto_increment not null,
  type_id                       bigint,
  theme                         varchar(255),
  date_creation                 datetime(6),
  adresse                       varchar(255),
  superficie                    bigint,
  user_id                       bigint,
  constraint uq_projet_type_id unique (type_id),
  constraint pk_projet primary key (id)
);

create table projet_user (
  projet_id                     bigint not null,
  user_id                       bigint not null,
  constraint pk_projet_user primary key (projet_id,user_id)
);

create table referentiel (
  id                            bigint auto_increment not null,
  code                          varchar(255),
  libelle                       varchar(255),
  commentaire                   varchar(255),
  type                          integer not null,
  constraint pk_referentiel primary key (id)
);

create table task (
  id                            bigint auto_increment not null,
  date_task                     datetime(6),
  type_id                       bigint,
  contenu                       varchar(255),
  etat                          integer,
  projet_id                     bigint,
  constraint uq_task_type_id unique (type_id),
  constraint pk_task primary key (id)
);

create table user (
  id                            bigint auto_increment not null,
  name                          varchar(255),
  surname                       varchar(255),
  email                         varchar(255),
  login                         varchar(255),
  password                      varchar(255),
  folder                        varchar(255),
  adresse                       varchar(255),
  ville                         varchar(255),
  code_postal                   varchar(255),
  portable                      varchar(255),
  telephone                     varchar(255),
  date_naissance                varchar(255),
  siret                         varchar(255),
  societe                       varchar(255),
  droit                         integer,
  categorie_id                  bigint,
  constraint pk_user primary key (id)
);

create index ix_calendar_event_user_id on calendar_event (user_id);
alter table calendar_event add constraint fk_calendar_event_user_id foreign key (user_id) references user (id) on delete restrict on update restrict;

create index ix_calendar_event_projet_id on calendar_event (projet_id);
alter table calendar_event add constraint fk_calendar_event_projet_id foreign key (projet_id) references projet (id) on delete restrict on update restrict;

create index ix_calendar_event_user_calendar_event on calendar_event_user (calendar_event_id);
alter table calendar_event_user add constraint fk_calendar_event_user_calendar_event foreign key (calendar_event_id) references calendar_event (id) on delete restrict on update restrict;

create index ix_calendar_event_user_user on calendar_event_user (user_id);
alter table calendar_event_user add constraint fk_calendar_event_user_user foreign key (user_id) references user (id) on delete restrict on update restrict;

alter table mail_token add constraint fk_mail_token_user_id foreign key (user_id) references user (id) on delete restrict on update restrict;

create index ix_message_expediteur_id on message (expediteur_id);
alter table message add constraint fk_message_expediteur_id foreign key (expediteur_id) references user (id) on delete restrict on update restrict;

create index ix_message_destinataire_id on message (destinataire_id);
alter table message add constraint fk_message_destinataire_id foreign key (destinataire_id) references user (id) on delete restrict on update restrict;

alter table projet add constraint fk_projet_type_id foreign key (type_id) references referentiel (id) on delete restrict on update restrict;

create index ix_projet_user_id on projet (user_id);
alter table projet add constraint fk_projet_user_id foreign key (user_id) references user (id) on delete restrict on update restrict;

create index ix_projet_user_projet on projet_user (projet_id);
alter table projet_user add constraint fk_projet_user_projet foreign key (projet_id) references projet (id) on delete restrict on update restrict;

create index ix_projet_user_user on projet_user (user_id);
alter table projet_user add constraint fk_projet_user_user foreign key (user_id) references user (id) on delete restrict on update restrict;

alter table task add constraint fk_task_type_id foreign key (type_id) references referentiel (id) on delete restrict on update restrict;

create index ix_task_projet_id on task (projet_id);
alter table task add constraint fk_task_projet_id foreign key (projet_id) references projet (id) on delete restrict on update restrict;

create index ix_user_categorie_id on user (categorie_id);
alter table user add constraint fk_user_categorie_id foreign key (categorie_id) references referentiel (id) on delete restrict on update restrict;


# --- !Downs

alter table calendar_event drop foreign key fk_calendar_event_user_id;
drop index ix_calendar_event_user_id on calendar_event;

alter table calendar_event drop foreign key fk_calendar_event_projet_id;
drop index ix_calendar_event_projet_id on calendar_event;

alter table calendar_event_user drop foreign key fk_calendar_event_user_calendar_event;
drop index ix_calendar_event_user_calendar_event on calendar_event_user;

alter table calendar_event_user drop foreign key fk_calendar_event_user_user;
drop index ix_calendar_event_user_user on calendar_event_user;

alter table mail_token drop foreign key fk_mail_token_user_id;

alter table message drop foreign key fk_message_expediteur_id;
drop index ix_message_expediteur_id on message;

alter table message drop foreign key fk_message_destinataire_id;
drop index ix_message_destinataire_id on message;

alter table projet drop foreign key fk_projet_type_id;

alter table projet drop foreign key fk_projet_user_id;
drop index ix_projet_user_id on projet;

alter table projet_user drop foreign key fk_projet_user_projet;
drop index ix_projet_user_projet on projet_user;

alter table projet_user drop foreign key fk_projet_user_user;
drop index ix_projet_user_user on projet_user;

alter table task drop foreign key fk_task_type_id;

alter table task drop foreign key fk_task_projet_id;
drop index ix_task_projet_id on task;

alter table user drop foreign key fk_user_categorie_id;
drop index ix_user_categorie_id on user;

drop table if exists calendar_event;

drop table if exists calendar_event_user;

drop table if exists mail_token;

drop table if exists message;

drop table if exists projet;

drop table if exists projet_user;

drop table if exists referentiel;

drop table if exists task;

drop table if exists user;

