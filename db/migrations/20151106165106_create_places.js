
exports.up = function(knex, Promise) {
  return knex.schema.createTable('places', function (table) {
    table.increments();
    table.string('name')              .notNullable();
    table.string('google_place_id')   .notNullable();
    table.string('google_uri')        .notNullable();
    table.string('formatted_address') .notNullable();
    table.decimal('lat')              .notNullable();
    table.decimal('lon')              .notNullable();
    table.string('geo_level')         .notNullable(); // country, city, address
    table.string('website');
    table.timestamps();
  }).createTable('feed_entries_places', function(table) {
    table.integer('feed_entry_id').references('feed_entries.id');
    table.integer('place_id').references('places.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('places');
  return knex.schema.dropTable('feed_entry_places');
};
