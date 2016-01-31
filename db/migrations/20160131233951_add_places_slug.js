
exports.up = function(knex, Promise) {
  return knex.schema.table('places', t => {
    t.string('slug', 32);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('places', t => {
    t.dropColumn('slug');
  });
};
