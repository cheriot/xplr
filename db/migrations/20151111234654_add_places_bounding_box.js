
exports.up = function(knex, Promise) {
  return knex.schema.table('places', t => {
    t.decimal('viewport_lat_north');
    t.decimal('viewport_lat_south');
    t.decimal('viewport_lon_east');
    t.decimal('viewport_lon_west');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('places', t => {
    t.dropColumn('viewport_lat_north');
    t.dropColumn('viewport_lat_south');
    t.dropColumn('viewport_lon_east');
    t.dropColumn('viewport_lon_west');
  });
};
