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
      published_state: (val) => ['published', 'queued', 'ignored'].indexOf(val) > -1
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
  }
});

module.exports = FeedEntry
