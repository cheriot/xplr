
exports.up = function(knex, Promise) {
  // enum: published, queued, ignored
  return knex.schema.raw(
    "alter table feed_entries add column published_state varchar(9) not null default 'queued'"
  );
};

exports.down = function(knex, Promise) {
  return knex.schema.table('feeds', (table) => {
    table.dropColumn('published_state');
  });
};
