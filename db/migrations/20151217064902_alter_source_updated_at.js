
exports.up = function(knex, Promise) {
  return knex.schema.table('feeds', (t) => {
    t.string('source_updated_at');
    t.string('source_published_at');
  }).table('feed_entries', (t) => {
    t.string('source_updated_at');
    t.string('source_published_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('feeds', (t) => {
    t.timestamp('source_updated_at');
    t.timestamp('source_published_at');
  }).table('feed_entries', (t) => {
    t.timestamp('source_updated_at');
    t.timestamp('source_published_at');
  });
};
