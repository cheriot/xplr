import isUri from 'isuri';
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

  bestUri: function() {
    const sourceId = this.get('source_id');
    const uri = this.get('uri');
    // Most sourceId values are better urls that skip google's feedproxy
    // but some are not valid uris or are tokens that happen to be valid
    // uris without being web uris.
    if (!isUri.test(sourceId) || sourceId.indexOf('http') == -1)
      return uri;
    else if (/feedproxy/.test(uri)) {
      // google's feedproxy doesn't play well with link_thumbnailer
      return sourceId;
    } else if (uri.length > sourceId.length) {
      return uri;
    } else {
      return sourceId;
    }
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

    attrs.uri = this.bestUri();
    delete attrs.source_id;

    return attrs;
  },

  thumbnailDataUri() {
    const thumbnail = this.get('summary_thumbnail');
    if(thumbnail) {
      return `data:image/jpg;base64,${this.get('summary_thumbnail')}`;
    } else {
      return null;
    }
  },
});

module.exports = FeedEntry
