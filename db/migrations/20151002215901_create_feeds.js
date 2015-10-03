
exports.up = function(knex, Promise) {
  return knex.schema.createTable('feeds', function (table) {
    table.increments();
    table.string('name');
    table.string('uri');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('feeds');
};
