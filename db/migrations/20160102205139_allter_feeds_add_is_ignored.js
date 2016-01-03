exports.up = function(knex, Promise) {
  return knex.schema.table('feeds', (t) => {
    t.boolean('is_ignored').defaultTo(false).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('feeds', (t) => {
    t.dropColumn('is_ignored');
  });
};
