
exports.up = function(knex, Promise) {
  return knex.schema.table('feed_entries', t => {
    t.string('summary_title');
    t.string('summary_description');
    t.text('summary_thumbnail');
    t.string('summary_thumbnail_uri');
    t.timestamp('summarized_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('feed_entries', t => {
    t.dropColumn('summary_title');
    t.dropColumn('summary_description');
    t.dropColumn('summary_thumbnail');
    t.dropColumn('summary_thumbnail_uri');
    t.dropColumn('summarized_at');
  });
};
