
exports.up = function(knex, Promise) {
  return knex.schema.table('feeds', (t) => {
    t.index(['id']);
  })
  .table('feed_entries', (t) => {
    t.index(['id']);
  })
  .table('feed_entries_places', (t) => {
    t.index(['feed_entry_id']);
    t.index(['place_id']);
  })
  .table('places', (t) => {
    t.index(['id']);
    t.index(['lat', 'lon', 'geo_level']);
  });
};

exports.down = function(knex, Promise) {
  
};
