import bookshelf from './bookshelf';
import Checkit from 'checkit';
import Feed from './feed';

const FeedEntry = bookshelf.Model.extend({
  tableName: 'feed_entries',
  hasTimestamps: true,

  feed: function() {
    return this.belongsTo(Feed);
  },

  initialize: function (attrs, opts) {
    this.on('saving', this.validateSave);
  },

  validateSave: function() {
    return new Checkit({
      uri: ['required', 'url'],
      published_state: (val) => ['published', 'queued', 'ignored'].indexOf(val) > -1
    }).run(this.attributes);
  },

});

FeedEntry.findOrCreateFromRemote = function(feed, feedPost) {
  const identity = {feed_id: feed.id, source_id: feedPost.guid};
  return FeedEntry
    .forge(identity)
    .refresh()
    .then((feedEntry) => {
      if(!feedEntry) feedEntry = FeedEntry.forge(identity)
      feedEntry.set('title', feedPost.title);
      feedEntry.set('uri', feedPost.link);
      feedEntry.set('author', feedPost.author);
      feedEntry.set('summary', feedPost.description);
      feedEntry.set('source_id', feedPost.guid);
      feedEntry.set('source_updated_at', feedPost.date);
      feedEntry.set('source_published_at', feedPost.pubdate);
      // We may be reimporting.
      if(!feedEntry.get('published_state')) feedEntry.set('published_state', 'queued');
      return feedEntry.save();
    });
}

module.exports = FeedEntry
