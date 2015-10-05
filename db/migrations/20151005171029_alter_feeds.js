
exports.up = function(knex, Promise) {
  return knex.schema.table('feeds', (table) => {
    // The feed will provide a title so drop name.
    table.dropColumn('name');
    table.string('title');
    table.string('subtitle');
    table.string('source_id');
    table.timestamp('source_updated_at');
  });
};

exports.down = function(knex, Promise) {
};
