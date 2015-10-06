import bookshelf from './bookshelf';
import Checkit from 'checkit';

const FeedEntry = bookshelf.Model.extend({
  tableName: 'feed_entries',
  hasTimestamps: true,

  initialize: function (attrs, opts) {
    this.on('saving', this.validateSave);
  },

  validateSave: function() {
    return new Checkit({
      uri: 'required'
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
      return feedEntry.save();
    });
}

module.exports = FeedEntry
