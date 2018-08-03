# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table anomalie (
  id                            bigint auto_increment not null,
  date_anomalie                 datetime(6),
  contenu                       varchar(255),
  etat                          integer,
  projet_id                     bigint,
  constraint pk_anomalie primary key (id)
);

create table calendar_event (
  id                            bigint auto_increment not null,
  title                         varchar(255),
  start                         datetime(6),
  end                           datetime(6),
  color                         varchar(255),
  user_id                       bigint,
  projet_id                     bigint,
  constraint uq_calendar_event_user_id unique (user_id),
  constraint pk_calendar_event primary key (id)
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
  theme                         varchar(255),
  date_creation                 datetime(6),
  user_id                       bigint,
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

create table user (
  id                            bigint auto_increment not null,
  name                          varchar(255),
  surname                       varchar(255),
  email                         varchar(255),
  login                         varchar(255),
  password                      varchar(255),
  folder                        varchar(255),
  droit                         integer,
  categorie_id                  bigint,
  constraint pk_user primary key (id)
);

create table user_projet (
  user_id                       bigint not null,
  projet_id                     bigint not null,
  constraint pk_user_projet primary key (user_id,projet_id)
);

create index ix_anomalie_projet_id on anomalie (projet_id);
alter table anomalie add constraint fk_anomalie_projet_id foreign key (projet_id) references projet (id) on delete restrict on update restrict;

alter table calendar_event add constraint fk_calendar_event_user_id foreign key (user_id) references user (id) on delete restrict on update restrict;

create index ix_calendar_event_projet_id on calendar_event (projet_id);
alter table calendar_event add constraint fk_calendar_event_projet_id foreign key (projet_id) references projet (id) on delete restrict on update restrict;

alter table mail_token add constraint fk_mail_token_user_id foreign key (user_id) references user (id) on delete restrict on update restrict;

create index ix_message_expediteur_id on message (expediteur_id);
alter table message add constraint fk_message_expediteur_id foreign key (expediteur_id) references user (id) on delete restrict on update restrict;

create index ix_message_destinataire_id on message (destinataire_id);
alter table message add constraint fk_message_destinataire_id foreign key (destinataire_id) references user (id) on delete restrict on update restrict;

create index ix_projet_user_id on projet (user_id);
alter table projet add constraint fk_projet_user_id foreign key (user_id) references user (id) on delete restrict on update restrict;

create index ix_projet_user_projet on projet_user (projet_id);
alter table projet_user add constraint fk_projet_user_projet foreign key (projet_id) references projet (id) on delete restrict on update restrict;

create index ix_projet_user_user on projet_user (user_id);
alter table projet_user add constraint fk_projet_user_user foreign key (user_id) references user (id) on delete restrict on update restrict;

create index ix_user_categorie_id on user (categorie_id);
alter table user add constraint fk_user_categorie_id foreign key (categorie_id) references referentiel (id) on delete restrict on update restrict;

create index ix_user_projet_user on user_projet (user_id);
alter table user_projet add constraint fk_user_projet_user foreign key (user_id) references user (id) on delete restrict on update restrict;

create index ix_user_projet_projet on user_projet (projet_id);
alter table user_projet add constraint fk_user_projet_projet foreign key (projet_id) references projet (id) on delete restrict on update restrict;


# --- !Downs

alter table anomalie drop foreign key fk_anomalie_projet_id;
drop index ix_anomalie_projet_id on anomalie;

alter table calendar_event drop foreign key fk_calendar_event_user_id;

alter table calendar_event drop foreign key fk_calendar_event_projet_id;
drop index ix_calendar_event_projet_id on calendar_event;

alter table mail_token drop foreign key fk_mail_token_user_id;

alter table message drop foreign key fk_message_expediteur_id;
drop index ix_message_expediteur_id on message;

alter table message drop foreign key fk_message_destinataire_id;
drop index ix_message_destinataire_id on message;

alter table projet drop foreign key fk_projet_user_id;
drop index ix_projet_user_id on projet;

alter table projet_user drop foreign key fk_projet_user_projet;
drop index ix_projet_user_projet on projet_user;

alter table projet_user drop foreign key fk_projet_user_user;
drop index ix_projet_user_user on projet_user;

alter table user drop foreign key fk_user_categorie_id;
drop index ix_user_categorie_id on user;

alter table user_projet drop foreign key fk_user_projet_user;
drop index ix_user_projet_user on user_projet;

alter table user_projet drop foreign key fk_user_projet_projet;
drop index ix_user_projet_projet on user_projet;

drop table if exists anomalie;

drop table if exists calendar_event;

drop table if exists mail_token;

drop table if exists message;

drop table if exists projet;

drop table if exists projet_user;

drop table if exists referentiel;

drop table if exists user;

drop table if exists user_projet;

