import bookshelf from './bookshelf';
import Checkit from 'checkit';
import Feed from './feed';
import Place from './place';

const FeedEntry = bookshelf.Model.extend({
  tableName: 'feed_entries',
  hasTimestamps: true,

  initialize: function (attrs, opts) {
    this.on('saving', this.validate);
  },

  feed: function() {
    return this.belongsTo(Feed);
  },

  places: function() {
    return this.belongsToMany(Place);
  },

  validate: function() {
    return new Checkit({
      uri: ['required', 'url'],
      published_state: (val) => {
        return ['published', 'queued', 'ignored', 'delayed'].indexOf(val) > -1
      }
    }).run(this.attributes);
  },

  updateFromRemote: function(remoteEntry) {
    this.set({
      title:               remoteEntry.title,
      uri:                 remoteEntry.link,
      author:              remoteEntry.author,
      summary:             remoteEntry.description,
      source_id:           remoteEntry.guid,
      source_updated_at:   remoteEntry.date,
      source_published_at: remoteEntry.pubdate,
    });
    if(!this.get('published_state')) this.set('published_state', 'queued');
  },

  serialize: function(options) {
    const attrs = bookshelf.Model.prototype.serialize.call(this, options)
    delete attrs.summary;
    delete attrs.google_place_id;
    delete attrs.viewport_lat_north;
    delete attrs.viewport_lat_south;
    delete attrs.viewport_lon_east;
    delete attrs.viewport_lon_west;
    delete attrs.created_at;

    attrs.thumbnail_data_uri = this.thumbnailDataUri();
    delete attrs.summary_thumbnail_uri;
    delete attrs.summary_thumbnail;

    attrs.title = attrs.summary_title || attrs.title;
    delete attrs.summary_title;

    return attrs;
  },

  thumbnailDataUri() {
    return `data:image/jpg;base64,${this.get('summary_thumbnail')}`;
  },
});

module.exports = FeedEntry
