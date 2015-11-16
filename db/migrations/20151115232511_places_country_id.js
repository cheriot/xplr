
exports.up = function(knex, Promise) {
  return knex.schema.table('places', t => {
    t.integer('country_id').references('places.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('places', t => {
    t.dropColumn('country_id');
  });
};
