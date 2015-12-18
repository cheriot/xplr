-- feeds
create sequence feeds_id_seq;
select setval('feeds_id_seq', (select max(id) from feeds));
alter table feeds alter id set DEFAULT nextval('feeds_id_seq');
alter table feeds alter id set not null;

-- feed_entries
create sequence feed_entries_id_seq;
select setval('feed_entries_id_seq', (select max(id) from feed_entries));
alter table feed_entries alter id set DEFAULT nextval('feed_entries_id_seq');
alter table feed_entries alter id set not null;

-- migrations
create sequence migrations_id_seq;
select setval('migrations_id_seq', (select max(id) from migrations));
alter table migrations alter id set DEFAULT nextval('migrations_id_seq');
alter table migrations alter id set not null;

-- places
create sequence places_id_seq;
select setval('places_id_seq', (select max(id) from places));
alter table places alter id set DEFAULT nextval('places_id_seq');
alter table places alter id set not null;
