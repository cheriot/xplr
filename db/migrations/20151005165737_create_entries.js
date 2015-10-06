
exports.up = function(knex, Promise) {
  return knex.schema.createTable('feed_entries', function (table) {
    table.increments();
    table.integer('feed_id');
    table.string('title');
    table.string('uri');
    table.string('author');
    table.string('summary');
    table.string('source_id');
    table.timestamp('source_updated_at');
    table.timestamp('source_published_at');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('feed_entries');
};
