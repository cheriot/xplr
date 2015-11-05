import FeedEntry from '../models/feed_entry';

class EntryResource {

  static list(req) {
    // Oldest 10
    // TODO: that have not been published or ignored.
    return FeedEntry
      .query('limit', 10)
      .query('orderBy', 'created_at', 'asc')
      .fetchAll({withRelated: ['feed']})
      .then((feedEntryCollection) => {
        console.log('first feed entry', feedEntryCollection.models[0]);
        return feedEntryCollection.models;
      });
  }
}

module.exports = EntryResource;
