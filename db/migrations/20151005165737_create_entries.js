
exports.up = function(knex, Promise) {
  return knex.schema.createTable('feed_entries', function (table) {
    table.increments();
    table.string('title');
    table.string('uri');
    table.string('source_id');
    table.string('summary');
    table.timestamp('source_updated_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('feed_entries');
};
