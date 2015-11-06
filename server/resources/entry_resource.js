import FeedEntry from '../models/feed_entry';

class EntryResource {

  static list(req) {
    // Oldest 10
    return FeedEntry
      .where({published_state: 'queued'})
      .query('limit', 10)
      .query('orderBy', 'created_at', 'asc')
      .fetchAll({withRelated: ['feed']})
      .then((feedEntryCollection) => {
        console.log('first feed entry', feedEntryCollection.models[0]);
        return feedEntryCollection.models;
      });
  }

  static ignore(req) {
    const id = req.params.id;
    // Query for the full record so validations can be checked.
    return FeedEntry
      .forge({id: id})
      .fetch()
      .then((feedEntry) => feedEntry.save({published_state: 'ignored'}));
  }
}

module.exports = EntryResource;
