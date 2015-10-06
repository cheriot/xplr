
exports.up = function(knex, Promise) {
  return knex.schema.table('feeds', (table) => {
    // The feed will provide a title so drop name.
    table.dropColumn('name');
    table.string('title');
    table.string('subtitle');
    table.string('site_uri');
    table.string('author');
    table.timestamp('source_updated_at');
    table.timestamp('source_published_at');
 });
};

exports.down = function(knex, Promise) {
};
