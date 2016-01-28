import FeedEntry from '../models/feed_entry';
import PlaceResource from './place_resource';

class EntryResource {

  static queue() {
    // Newest 10 in the queue
    return FeedEntry
      .where({published_state: 'queued'})
      .query('limit', 10)
      .query('orderBy', 'created_at', 'desc')
      .fetchAll(this.fetchOptions())
      .then((feedEntryCollection) => {
        return feedEntryCollection.models;
      });
  }

  static fetchByPlace(placeId) {
    return FeedEntry
      .where({published_state: 'published'})
      .query((qb) => {
        qb.innerJoin(
          'feed_entries_places as fep',
          'fep.feed_entry_id',
          'feed_entries.id'
        ).where('fep.place_id', placeId);
      })
      .query('limit', 3)
      .query('orderBy', 'created_at', 'desc')
      .fetchAll(this.fetchOptions())
      .then((feedEntryCollection) => {
        return feedEntryCollection.models;
      });
  }

  static ignore(req) {
    const id = req.params.id;
    // Query for the full record so validations can be checked.
    return this.fetch(id)
      .then(feedEntry => feedEntry.save({published_state: 'ignored'}, {patch: true}));
  }

  static publish(id) {
    return this.fetch(id)
      .then(feedEntry => feedEntry.save({published_state: 'published'}, {patch: true}));
  }

  static addPlace(feedEntryId, placeId) {
    return this.forge(feedEntryId)
      .places()
      .attach(placeId)
      .then( () => this.fetch(feedEntryId) );
  }

  static removePlace(feedEntryId, placeId) {
    return this.forge(feedEntryId)
      .places()
      .detach(placeId)
      .then( () => this.fetch(feedEntryId) );
  }

  static forge(id) {
    return FeedEntry.forge({id: id});
  }

  static fetch(id) {
    return this.forge(id).fetch(this.fetchOptions());
  }

  static fetchOptions() {
    // If we're sending records to the client, include relations.
    return {withRelated: ['feed', 'places']};
  }

  static updateOrCreate(feed, remoteEntry) {
    const identity = {feed_id: feed.id, source_id: remoteEntry.guid};
    return FeedEntry
      .forge(identity)
      .fetch()
      .then((feedEntry) => {
        if(!feedEntry) feedEntry = FeedEntry.forge(identity);
        feedEntry.updateFromRemote(remoteEntry);
        return feedEntry.save();
      });
  }

}

module.exports = EntryResource;
